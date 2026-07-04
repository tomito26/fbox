import { Link } from "react-router-dom";

const Footer = () => {
    return(
        <div className="footer-items">
            <div className="footer">
                <h3>Links</h3>
                <div className="footer-links">
                    <ul>
                        <li><Link to="/movies">Movies</Link></li>
                        <li><Link to="/tvSeries">TV-Shows</Link></li>
                        <li><Link to="/topImdb">Most Watched</Link></li>
                        <li><Link to="/topImdb">Top IMDb</Link></li>
                    </ul>
                    <ul>
                        <li><Link to="/search?q=action">Action Movies</Link></li>
                        <li><Link to="/search?q=horror">Horrors</Link></li>
                        <li><Link to="/search?q=science%20fiction">Sci-fi</Link></li>
                        <li><Link to="/search?q=thriller">Thriller</Link></li>
                    </ul>
                    <ul>
                        <li><Link to="/">Contact</Link></li>
                        <li><Link to="/">Request</Link></li>
                    </ul>
                </div>
            </div>
            <div className="about-footer">
                <h3>About</h3>
                <div className="footer-info">
                    <p><strong>FBOX</strong> is a top <strong>free streaming website</strong>,where to watch  movies online for free without registration required.With a big database and great features,we're confident <strong>FBOX</strong> is the best free movies online website in the space that you can't simply miss!<br/> <strong>FBOX movie</strong>,<strong>FBOX tv shows</strong>,FBOX online,FBOX movies online</p>
                </div>
            </div>
        </div>
    );
}
export default Footer;