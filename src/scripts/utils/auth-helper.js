class AuthHelper {
  static TOKEN_KEY = 'token';

  static saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isLoggedIn() {
    const token = this.getToken();
    return token && token.length > 0;
  }

  static requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.hash = '#/login';
      return false;
    }
    return true;
  }

  static logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    window.location.hash = '#/login';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

export default AuthHelper;
