import AuthApi from '../../api/auth'; 
import AuthHelper from '../../utils/auth-helper';

class RegisterPage {
  async render() {
    return `
      <section class="auth-page">
        <div class="auth-card">
          <h1>Buat Akun Baru</h1>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="name">Nama Lengkap</label>
              <input type="text" id="name" required />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required />
            </div>

            <button type="submit" class="btn-primary">Daftar</button>
            <p id="register-message" class="error"></p>

            <p class="auth-link">Sudah punya akun?
              <a href="#/login">Masuk di sini</a>
            </p>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.querySelector('#register-form');
    const message = document.querySelector('#register-message');

    
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.querySelector('#name').value.trim();
      const email = document.querySelector('#email').value.trim();
      const password = document.querySelector('#password').value.trim();

      message.innerHTML = ''; 

      try {
        
        const response = await AuthApi.register({ name, email, password });

        message.innerHTML = `<span class="success">Pendaftaran berhasil! Mengarahkan ke halaman login...</span>`;

        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1500);
      } catch (err) {
        console.error(err);
        message.innerHTML = `<span class="error">Gagal daftar: ${err.message || 'Periksa data Anda.'}</span>`;
      }
    });
  }
}

export default RegisterPage;
