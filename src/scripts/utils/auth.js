const Auth = {
  getToken() {
    return localStorage.getItem('token');
  },

  setToken(token) {
    localStorage.setItem('token', token);
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  updateUI() {
    const navList = document.querySelector('#nav-list');
    if (!navList) return;

    if (this.isLoggedIn()) {
      navList.innerHTML = `
        <li><a href="#/" class="font-medium hover:text-yellow-500 transition-colors">Beranda</a></li>
        <li><a href="#/add-story" class="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-500 transition-colors inline-block">Tambah Story</a></li>
        <li><button id="logout-btn" class="font-medium text-red-500 hover:text-red-700 transition-colors">Logout</button></li>
      `;
      
      document.querySelector('#logout-btn')?.addEventListener('click', () => {
        this.removeToken();
        window.location.hash = '#/login';
        this.updateUI();
      });
    } else {
      navList.innerHTML = `
        <li><a href="#/login" class="font-medium hover:text-yellow-500 transition-colors">Login</a></li>
        <li><a href="#/register" class="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-500 transition-colors inline-block">Register</a></li>
      `;
    }
  }
};

export default Auth;
