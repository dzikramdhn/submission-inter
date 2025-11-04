import AuthApi from '../../api/auth'; 
import AuthHelper from '../../utils/auth-helper';

class LoginPage {
  async render() {
    return `
      <section class="auth-page">
        <div class="auth-card">
          <h1>Masuk ke Akun Anda</h1>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required />
            </div>

            <button type="submit" class="btn-primary">Masuk</button>
            <p id="login-message" class="error"></p>

            <p class="auth-link">Belum punya akun? 
              <a href="#/register">Daftar di sini</a>
            </p>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#login-form');
    const message = document.querySelector('#login-message');

    if (!form) return; 

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {

        const response = await AuthApi.login({ email, password });

        localStorage.setItem('token', response.loginResult.token);
        message.innerHTML = `<span class="success">Login berhasil!</span>`;


        setTimeout(() => {
          window.location.hash = '#/';
        }, 1000);
      } catch (err) {
        console.error(err);
        message.innerHTML = `<span class="error">Email atau password salah!</span>`;
      }
    });
  }
}

export default LoginPage;
