import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { UserAuthContextProvider } from './Context/UserAuthContext';
import PrivateLink from './components/PrivateLink';
import Movies from './pages/movies/Movies';
import TvSeries from './pages/tvSeries/TvSeries';
import TopImdb from './pages/imdb/TopImdb';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/Profile';
import TvShows from './components/TvShows';
import RecommendedMovies from './components/RecommendedMovies';
import Trendings from './components/Trendings';
import Footer from './components/Footer';
import Movie from './components/Movie';
import TvShowVideos from './components/TvShowVideos';
import SeasonOne from './components/SeasonOne';
import Season from './components/Season';


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
          <Route path='/movie/:movieId' element={<PrivateLink><Movie/></PrivateLink>}/>
          <Route path='/tvshows/:tvshowId' element={<PrivateLink><TvShowVideos/></PrivateLink>}>
            <Route path='/tvshows/:tvshowId/' element={<SeasonOne/>}/>
            <Route  path='/tvshows/:tvshowId/:seasonNumber' element={<Season/>}/>
          </Route>
        </Routes>
        <Footer/>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
