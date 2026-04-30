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
        <li><a href="#/" class="bg-[#caffbf] border-2 border-black shadow-[4px_4px_0_0_#000] text-black px-4 py-2 rounded-xl font-bold hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all inline-block">Beranda</a></li>
        <li><a href="#/add-story" class="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] text-black px-4 py-2 rounded-xl font-bold hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all inline-block">Tambah Story</a></li>
        <li><button id="logout-btn" class="bg-red-400 border-2 border-black shadow-[4px_4px_0_0_#000] text-black px-4 py-2 rounded-xl font-bold hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all inline-block cursor-pointer">Logout</button></li>
      `;

      document.querySelector('#logout-btn')?.addEventListener('click', () => {
        this.removeToken();
        window.location.hash = '#/login';
        this.updateUI();
      });
    } else {
      navList.innerHTML = `
        <li><a href="#/" class="bg-[#caffbf] border-2 border-black shadow-[4px_4px_0_0_#000] text-black px-4 py-2 rounded-xl font-bold hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all inline-block">Beranda</a></li>
        <li><a href="#/login" class="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] text-black px-4 py-2 rounded-xl font-bold hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all inline-block">Login</a></li>
        <li><a href="#/register" class="bg-yellow-400 border-2 border-black shadow-[4px_4px_0_0_#000] text-black px-4 py-2 rounded-xl font-bold hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all inline-block">Register</a></li>
      `;
    }
  }
};

export default Auth;
