import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { UserAuthContextProvider } from './Context/UserAuthContext';
import PrivateLink from './components/PrivateLink';
import Movies from './pages/Movies';
import TvSeries from './pages/TvSeries';
import TopImdb from './pages/TopImdb';


function App() {
  return (
    <UserAuthContextProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/' element={<PrivateLink><Home/></PrivateLink>}/>
          <Route path='/movies' element={<PrivateLink><Movies/></PrivateLink>}/>
          <Route path="/tvSeries" element={<PrivateLink><TvSeries/></PrivateLink>}/>
          <Route path='topImdb' element={<PrivateLink><TopImdb/></PrivateLink>}/>
        </Routes>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
