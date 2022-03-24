import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { UserAuthContextProvider } from './Context/UserAuthContext';
import PrivateLink from './components/PrivateLink';


function App() {
  return (
    <UserAuthContextProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/home' element={<PrivateLink><Home/></PrivateLink>}/>
        </Routes>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
