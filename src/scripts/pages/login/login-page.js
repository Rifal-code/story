import API from '../../utils/api';
import Auth from '../../utils/auth';

class LoginPage {
  async render() {
    return `
      <div class="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-100 rounded-2xl shadow-lg">
        <h2 class="text-3xl font-bold text-center mb-6">Masuk <span class="text-yellow-400">Dulu</span></h2>
        <form id="login-form" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-yellow-400 focus:border-yellow-400">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" required minlength="8" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-yellow-400 focus:border-yellow-400">
          </div>
          <p id="error-msg" class="text-red-500 text-sm hidden"></p>
          <button type="submit" id="login-btn" class="w-full bg-yellow-400 text-black py-2 px-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors cursor-pointer flex justify-center items-center">
            <span id="login-btn-text">Login Sekarang</span>
            <svg id="login-spinner" class="animate-spin ml-2 h-5 w-5 text-black hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </form>
        <p class="mt-4 text-center text-sm text-gray-600">Belum punya akun? <a href="#/register" class="text-yellow-600 font-bold hover:underline">Daftar di sini</a></p>
      </div>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#login-form');
    const errorMsg = document.querySelector('#error-msg');
    const loginBtn = document.querySelector('#login-btn');
    const loginBtnText = document.querySelector('#login-btn-text');
    const loginSpinner = document.querySelector('#login-spinner');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      // Set Loading State
      loginBtn.disabled = true;
      loginBtn.classList.add('opacity-70', 'cursor-not-allowed');
      loginBtnText.textContent = 'Memproses...';
      loginSpinner.classList.remove('hidden');
      errorMsg.classList.add('hidden');

      try {
        const response = await API.login(email, password);
        if (response.error) {
          errorMsg.textContent = response.message;
          errorMsg.classList.remove('hidden');
        } else {
          Auth.setToken(response.loginResult.token);
          window.location.hash = '#/'; // Go to home
        }
      } catch (error) {
        errorMsg.textContent = 'Gagal melakukan login. Periksa koneksi Anda.';
        errorMsg.classList.remove('hidden');
      } finally {
        // Reset Loading State
        loginBtn.disabled = false;
        loginBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        loginBtnText.textContent = 'Login Sekarang';
        loginSpinner.classList.add('hidden');
      }
    });
  }
}

export default LoginPage;
