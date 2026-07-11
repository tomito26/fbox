import './App.css';
import { BrowserRouter as Router,Routes,Route,useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import { UserAuthContextProvider } from './Context/UserAuthContext';
import { WatchlistProvider } from './Context/WatchlistContext';
import PrivateLink from './components/PrivateLink';
import ErrorBoundary from './components/ErrorBoundary';
import Watchlist from './pages/Watchlist';
import Movies from './pages/movies/Movies';
import TvSeries from './pages/tvSeries/TvSeries';
import TopImdb from './pages/imdb/TopImdb';
import SearchResults from './pages/SearchResults';
import Browse from './pages/Browse';
import LatestListing from './pages/LatestListing';
import Placeholder from './pages/Placeholder';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/Profile';
import TvShows from './components/TvShows';
import RecommendedMovies from './components/RecommendedMovies';
import Trendings from './components/Trendings';
import Footer from './components/Footer';
import Movie from './components/Movie';
import TvShowVideos from './components/TvShowVideos';

// Auth screens are immersive full-viewport split-screens — the global chrome
// (navbar + footer) is hidden on them so the sign-in moment stays focused.
const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];

function AppShell() {
  const { pathname } = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  return (
    <ErrorBoundary>
      {!isAuthRoute && <Navbar/>}
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/terms' element={<Placeholder title="Terms of Service"/>}/>
        <Route path='/privacy' element={<Placeholder title="Privacy Policy"/>}/>
        <Route path='/dmca' element={<Placeholder title="DMCA"/>}/>
        {/* Public: the whole catalogue is browsable without an account. */}
        <Route path='/' element={<Home/>}>
          <Route path='/' element={<RecommendedMovies/>}/>
          <Route path='tvshows' element={<TvShows/>}/>
          <Route path='trendings' element={<Trendings/>}/>
        </Route>
        <Route path='/movies' element={<Movies/>}/>
        <Route path="/tvSeries" element={<TvSeries/>}/>
        <Route path='topImdb' element={<TopImdb/>}/>
        <Route path='/search' element={<SearchResults/>}/>
        <Route path='/browse' element={<Browse/>}/>
        <Route path='/latest-movies' element={<LatestListing kind="movies"/>}/>
        <Route path='/latest-tv-series' element={<LatestListing kind="series"/>}/>
        <Route path='/requested' element={<LatestListing kind="trending"/>}/>
        <Route path='/movie/:movieId' element={<Movie/>}/>
        <Route path='/tvshows/:tvshowId' element={<TvShowVideos/>}/>
        {/* Auth-gated: personal to the signed-in user. */}
        <Route path='/watchlist' element={<PrivateLink><Watchlist/></PrivateLink>}/>
        <Route path='/profile' element={<PrivateLink><Profile/></PrivateLink>}/>
      </Routes>
      {!isAuthRoute && <Footer/>}
    </ErrorBoundary>
  );
}

function App() {
  return (
    <UserAuthContextProvider>
      <Router>
      {/* Watchlist context lives inside the Router so it can redirect guests to
          /login when they try to save — auth is only required for that action
          and the account pages, not for browsing. */}
      <WatchlistProvider>
        <AppShell/>
      </WatchlistProvider>
      </Router>
    </UserAuthContextProvider>
  );
}

export default App;
