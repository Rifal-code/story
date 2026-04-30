import API from '../../utils/api';
import Auth from '../../utils/auth';

class LoginPage {
  async render() {
    return `
      <div class="max-w-md mx-auto mt-10 bg-[#caffbf] p-8 border-2 border-black rounded-2xl shadow-[8px_8px_0_0_#000]">
        <h1 class="text-3xl font-bold text-center mb-6 font-mono text-black">Masuk <span class="bg-white px-2 border-2 border-black shadow-[2px_2px_0_0_#000] inline-block -rotate-2">Dulu</span></h1>
        <form id="login-form" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-bold text-black mb-1">Email</label>
            <input type="email" id="email" required class="block w-full px-4 py-2 border-2 border-black rounded-xl focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0_0_#000] bg-white text-black font-medium">
          </div>
          <div>
            <label for="password" class="block text-sm font-bold text-black mb-1">Password</label>
            <input type="password" id="password" required minlength="8" class="block w-full px-4 py-2 border-2 border-black rounded-xl focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0_0_#000] bg-white text-black font-medium">
          </div>
          <p id="error-msg" class="text-red-600 bg-white border-2 border-black px-3 py-1 font-bold text-sm hidden shadow-[2px_2px_0_0_#000] rounded"></p>
          <button type="submit" id="login-btn" class="w-full bg-[#fde047] text-black py-3 px-4 rounded-xl border-2 border-black font-bold hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] shadow-[6px_6px_0_0_#000] transition-all cursor-pointer flex justify-center items-center mt-6">
            <span id="login-btn-text">Login Sekarang</span>
            <svg id="login-spinner" class="animate-spin ml-2 h-5 w-5 text-black hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </form>
        <p class="mt-6 text-center text-sm font-bold text-black">Belum punya akun? <a href="#/register" class="text-blue-700 bg-white px-2 py-0.5 border-2 border-black rounded shadow-[2px_2px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all">Daftar di sini</a></p>
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
          window.location.hash = '#/';
        }
      } catch (error) {
        errorMsg.textContent = 'Gagal melakukan login. Periksa koneksi Anda.';
        errorMsg.classList.remove('hidden');
      } finally {
        loginBtn.disabled = false;
        loginBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        loginBtnText.textContent = 'Login Sekarang';
        loginSpinner.classList.add('hidden');
      }
    });
  }
}

export default LoginPage;
