import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import MapPage from '../pages/map/map-page';
import AddPage from '../pages/add/add-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import DetailPage from '../pages/detail/detail-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/map': new MapPage(),
  '/add': new AddPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/detail/:id': new DetailPage(),
  '/bookmark': new BookmarkPage(),
};

export default routes;
