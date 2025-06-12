import './styles/App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationForm';


function App() {

  return (
    <Router>
      <Routes>
        <Route path='login' element={<LoginPage />}/>
        <Route path='sign-up' element={<RegistrationPage />}/>

      </Routes>
    </Router>
  )
}

export default App
