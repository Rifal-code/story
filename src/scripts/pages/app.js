import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import Auth from '../utils/auth';
import IDBHelper from '../data/idb-helper';
import API from '../utils/api';

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
    this._setupOfflineSync();
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

  _setupOfflineSync() {
    window.addEventListener('online', async () => {
      console.log('Koneksi kembali online. Menyinkronkan data...');
      try {
        const syncStories = await IDBHelper.getAllSyncStories();
        for (const story of syncStories) {
          const res = await fetch(story.photoBase64);
          const blob = await res.blob();
          
          const formData = new FormData();
          formData.append('description', story.description);
          formData.append('photo', blob, 'offline-upload.jpg');
          if (story.lat && story.lon) {
            formData.append('lat', story.lat);
            formData.append('lon', story.lon);
          }
          
          await API.addStory(formData);
          await IDBHelper.deleteSyncStory(story.id);
        }
        if (syncStories.length > 0) {
          alert('Berhasil menyinkronkan ' + syncStories.length + ' story ke server.');
          if (window.location.hash === '#/' || window.location.hash === '') {
            this.renderPage();
          }
        }
      } catch (err) {
        console.error('Gagal sync data offline:', err);
      }
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
