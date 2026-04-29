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
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || routes['/']; // fallback to home

    // Proteksi Halaman (jika belum login, redirect ke login)
    const publicRoutes = ['/login', '/register'];
    if (!Auth.isLoggedIn() && !publicRoutes.includes(url)) {
      window.location.hash = '#/login';
      return;
    }
    
    // Redirect ke home jika sudah login tapi akses login/register
    if (Auth.isLoggedIn() && publicRoutes.includes(url)) {
      window.location.hash = '#/';
      return;
    }

    Auth.updateUI();

    const renderDOM = async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    };

    // Custom View Transition API
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
