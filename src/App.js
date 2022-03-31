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
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/Profile';
import TvShows from './components/TvShows';
import RecommendedMovies from './components/RecommendedMovies';
import Trendings from './components/Trendings';


function App() {
  return (
    <UserAuthContextProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/' element={<PrivateLink><Home/></PrivateLink>}>
            <Route path='/' element={<RecommendedMovies/>}/>
            <Route path='tvshows' element={<TvShows/>}/>
            <Route path='trendings' element={<Trendings/>}/>
          </Route>
          <Route path='/movies' element={<PrivateLink><Movies/></PrivateLink>}/>
          <Route path="/tvSeries" element={<PrivateLink><TvSeries/></PrivateLink>}/>
          <Route path='topImdb' element={<PrivateLink><TopImdb/></PrivateLink>}/>
          <Route path='/profile' element={<PrivateLink><Profile/></PrivateLink>}/>
        </Routes>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
