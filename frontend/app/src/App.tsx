import './styles/App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationForm';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "./features/user/userSlice";
import api from "./api";
import { type RootState, type AppDispatch } from "./store";

function App() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch> ();

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


  return (
    <Router>
      <Routes>
        <Route path='login' element={<LoginPage />}/>
        <Route path='sign-up' element={<RegistrationPage />}/>
        <Route path='/' element={<HomePage />}/>
        <Route path='/admin' element={<AdminLoginPage />}/>
        <Route path='/admin/page' element={<AdminPage />}/>
      </Routes>
    </Router>
  )
}

export default App
