import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { applyViewTransition } from '../utils/view-transition';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._updateNavbarVisibility(); 
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  
  async renderPage() {
    const token = localStorage.getItem('token'); 
    const url = getActiveRoute();

    
    if (!token && url !== '/login' && url !== '/register') {
      window.location.hash = '#/login';
      return;
    }

    const page = routes[url] || routes['/']; 
    this.#content.innerHTML = await page.render();
    await page.afterRender();

    this._setupLogout(); 
    this._updateNavbarVisibility(); 
  }

  
  _updateNavbarVisibility() {
    const token = localStorage.getItem('token');
    const nav = this.#navigationDrawer;
    const drawerButton = this.#drawerButton;

    if (!token) {
      nav.style.display = 'none';
      drawerButton.style.display = 'none';
    } else {
      nav.style.display = 'flex';
      drawerButton.style.display = 'block';
    }
  }

 
  _setupLogout() {
    const logoutButton = document.querySelector('#logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location.hash = '#/login';
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
    }
  }
}

export default App;
