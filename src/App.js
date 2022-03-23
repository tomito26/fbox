import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { UserAuthContextProvider } from './Context/UserAuthContext';


function App() {
  return (
    <UserAuthContextProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/home' element={<Home/>}/>
        </Routes>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
