import Profile from "../pages/Profile/Profile";
import { Home } from "../pages/Home/Home";
import TripsList from "../pages/TripsList/TripsList";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import RecoverPassword from "../pages/RecoverPassword/RecoverPassword";
import ChangePassword from "../pages/ChangePassword/ChangePassword";

const routes = [
    { path: '/', component: <Home />},
    { path: '/profile/*', component: <Profile />},
    { path: '/tripslist', component: <TripsList />},
    { path: '/login', component: <Login />},
    { path: '/register', component: <Register />},
    { path: '/recoverpassword', component: <RecoverPassword />},
    { path: '/changepassword', component: <ChangePassword />},
]

export default routes;
