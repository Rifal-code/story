import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import Auth from '../utils/auth';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    Auth.updateUI();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.#navigationDrawer.classList.toggle('hidden');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target) &&
        window.innerWidth < 768
      ) {
        this.#navigationDrawer.classList.add('hidden');
      }

      this.#navigationDrawer.querySelectorAll('a, button').forEach((el) => {
        if (el.contains(event.target) && window.innerWidth < 768) {
          this.#navigationDrawer.classList.add('hidden');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || routes['/'];

    const publicRoutes = ['/login', '/register'];
    if (!Auth.isLoggedIn() && !publicRoutes.includes(url)) {
      window.location.hash = '#/login';
      return;
    }
    
    if (Auth.isLoggedIn() && publicRoutes.includes(url)) {
      window.location.hash = '#/';
      return;
    }

    Auth.updateUI();

    const renderDOM = async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    };

    if (!document.startViewTransition) {
      await renderDOM();
      return;
    }

    document.startViewTransition(async () => {
      await renderDOM();
    });
  }
}

export default App;
