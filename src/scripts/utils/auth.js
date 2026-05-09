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

    // Append Push Notification Toggle
    const pushToggleLi = document.createElement('li');
    pushToggleLi.className = "mt-4 md:mt-0";
    pushToggleLi.innerHTML = `
      <div class="bg-white border-2 border-black shadow-[4px_4px_0_0_#000] px-4 py-2 rounded-xl flex items-center justify-between gap-4 w-full">
        <span class="text-sm font-bold text-black">Notifikasi</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="push-toggle" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 border-2 border-black peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-black after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-400"></div>
        </label>
      </div>
    `;
    navList.appendChild(pushToggleLi);

    // Bind event
    import('./notification-helper').then(({ default: NotificationHelper }) => {
      const pushToggle = document.getElementById('push-toggle');
      if (pushToggle) {
        NotificationHelper.isSubscribed().then(isSub => {
          pushToggle.checked = isSub;
        });
        pushToggle.addEventListener('change', async (e) => {
          e.preventDefault();
          const isSubscribed = await NotificationHelper.isSubscribed();
          if (isSubscribed) {
            const success = await NotificationHelper.unsubscribe();
            pushToggle.checked = !success;
            if (!success) alert('Gagal berhenti berlangganan notifikasi.');
          } else {
            const success = await NotificationHelper.subscribe();
            pushToggle.checked = success;
            if (!success) alert('Gagal berlangganan notifikasi atau izin ditolak.');
          }
        });
      }
    });
  }
};

export default Auth;
