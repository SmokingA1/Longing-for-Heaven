import './styles/App.css'
import { Routes, Route, useLocation} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationForm';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import ForgotPassword from './pages/ForgotPassword';
import UserProfilePage from './pages/UserProfilePage';
import ShippingAndPaymentPage from './pages/ShippingAndPayment';
import CheckoutPage from './pages/CheckoutPage';

import {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "./features/user/userSlice";
import { closeSideBar, closeSideCart } from './features/sideBar/sideBarSlice';
import api from "./api";
import { type RootState, type AppDispatch } from "./store";
import ContactsPage from './pages/ContactsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserOrdersPage from './pages/UserOrdersPage';

function App() {
  const user = useSelector((state: RootState) => state.user);
  const ui = useSelector((state: RootState) => state.ui)
  const dispatch = useDispatch<AppDispatch> ();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/users/me");
      } catch {
        dispatch(clearUser());
      }
    };

    if (user.name) {
      checkAuth();
    }
    console.log("App mounted!")
  }, []);

  useEffect(() => {
    if (ui.sideBarOpen) {
      dispatch(closeSideBar());
    }
    if (ui.sideCartOpen) {
      dispatch(closeSideCart());
    }
  }, [location.pathname])

  return (
    <Routes>
      <Route path='login' element={<LoginPage />}/>
      <Route path='sign-up' element={<RegistrationPage />}/>
      <Route path='/' element={<HomePage />}/>
      <Route path='/admin' element={<AdminLoginPage />}/>
      <Route path='/admin/page' element={<AdminPage />}/>
      <Route path='/contacts' element={<ContactsPage  />}/>
      <Route path='/shop/' element={<ShopPage  />}/>
      <Route path='/shop/:id' element={<ProductPage  />}/>
      <Route path='/shop/checkout' element={<CheckoutPage />} />
      <Route path='/forgot-password/' element={<ForgotPassword />}/>
      <Route path='/recover-password' element={<ResetPasswordPage /> }/>
      <Route path='/my-profile/' element={<UserProfilePage />} />
      <Route path='/shipping-and-payment/' element={<ShippingAndPaymentPage />} />
      <Route path='/my-orders/' element={<UserOrdersPage />} />
    </Routes>
  )
}

export default App
