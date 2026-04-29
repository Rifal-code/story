import API from '../../utils/api';

class RegisterPage {
  async render() {
    return `
      <div class="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-100 rounded-2xl shadow-lg">
        <h2 class="text-3xl font-bold text-center mb-6">Daftar <span class="text-yellow-400">Akun</span></h2>
        <form id="register-form" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" id="name" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-yellow-400 focus:border-yellow-400">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-yellow-400 focus:border-yellow-400">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password (Min. 8 karakter)</label>
            <input type="password" id="password" required minlength="8" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-yellow-400 focus:border-yellow-400">
          </div>
          <p id="alert-msg" class="text-sm hidden"></p>
          <button type="submit" id="register-btn" class="w-full bg-gray-900 text-white py-2 px-4 rounded-xl font-bold hover:bg-gray-800 transition-colors cursor-pointer flex justify-center items-center">
            <span id="register-btn-text">Buat Akun</span>
            <svg id="register-spinner" class="animate-spin ml-2 h-5 w-5 text-white hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-600">Sudah punya akun? <a href="#/login" class="text-yellow-600 font-bold hover:underline">Masuk</a></p>
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

      // Set Loading State
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
        // Reset Loading State
        registerBtn.disabled = false;
        registerBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        registerBtnText.textContent = 'Buat Akun';
        registerSpinner.classList.add('hidden');
      }
    });
  }
}

export default RegisterPage;
