import API from '../../utils/api';

class RegisterPage {
  async render() {
    return `
      <div class="max-w-md mx-auto mt-10 bg-[#ffb703] p-8 border-2 border-black rounded-2xl shadow-[8px_8px_0_0_#000]">
        <h1 class="text-3xl font-bold text-center mb-6 font-mono text-black">Daftar <span class="bg-white px-2 border-2 border-black shadow-[2px_2px_0_0_#000] inline-block rotate-2">Akun</span></h1>
        <form id="register-form" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-bold text-black mb-1">Nama Lengkap</label>
            <input type="text" id="name" required class="block w-full px-4 py-2 border-2 border-black rounded-xl focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0_0_#000] bg-white text-black font-medium">
          </div>
          <div>
            <label for="email" class="block text-sm font-bold text-black mb-1">Email</label>
            <input type="email" id="email" required class="block w-full px-4 py-2 border-2 border-black rounded-xl focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0_0_#000] bg-white text-black font-medium">
          </div>
          <div>
            <label for="password" class="block text-sm font-bold text-black mb-1">Password (Min. 8 karakter)</label>
            <input type="password" id="password" required minlength="8" class="block w-full px-4 py-2 border-2 border-black rounded-xl focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0_0_#000] bg-white text-black font-medium">
          </div>
          <p id="alert-msg" class="text-sm hidden bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0_0_#000] rounded font-bold"></p>
          <button type="submit" id="register-btn" class="w-full bg-[#a2d2ff] text-black py-3 px-4 rounded-xl border-2 border-black font-bold hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] shadow-[6px_6px_0_0_#000] transition-all cursor-pointer flex justify-center items-center mt-6">
            <span id="register-btn-text">Buat Akun</span>
            <svg id="register-spinner" class="animate-spin ml-2 h-5 w-5 text-black hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </form>
        <p class="mt-6 text-center text-sm font-bold text-black">Sudah punya akun? <a href="#/login" class="text-blue-700 bg-white px-2 py-0.5 border-2 border-black rounded shadow-[2px_2px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all">Masuk</a></p>
      </div>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#register-form');
    const alertMsg = document.querySelector('#alert-msg');
    const registerBtn = document.querySelector('#register-btn');
    const registerBtnText = document.querySelector('#register-btn-text');
    const registerSpinner = document.querySelector('#register-spinner');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      registerBtn.disabled = true;
      registerBtn.classList.add('opacity-70', 'cursor-not-allowed');
      registerBtnText.textContent = 'Mendaftar...';
      registerSpinner.classList.remove('hidden');
      alertMsg.classList.add('hidden');

      try {
        const response = await API.register(name, email, password);
        if (response.error) {
          alertMsg.textContent = response.message;
          alertMsg.className = 'text-red-500 text-sm block mt-2';
        } else {
          alertMsg.textContent = 'Berhasil mendaftar! Silakan login.';
          alertMsg.className = 'text-green-500 text-sm block font-bold mt-2';
          form.reset();
          setTimeout(() => {
            window.location.hash = '#/login';
          }, 1500);
        }
      } catch (error) {
        alertMsg.textContent = 'Gagal mendaftar. Coba lagi nanti.';
        alertMsg.className = 'text-red-500 text-sm block mt-2';
      } finally {
        registerBtn.disabled = false;
        registerBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        registerBtnText.textContent = 'Buat Akun';
        registerSpinner.classList.add('hidden');
      }
    });
  }
}

export default RegisterPage;
