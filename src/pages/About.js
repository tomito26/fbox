import { FaEnvelope, FaFacebookF,FaPinterest,FaPinterestP,FaTelegram,FaTwitter, FaWhatsapp } from "react-icons/fa"
const About = () =>{
    return(
    <div className="about">
        <h2>Watch Free  Movies Online</h2>
        <p>If you want to <strong>watch free movies online</strong> fbox.to is right place.It allows you to <strong>watch free movies</strong> online for free. No registration is required,fast streaming servers,update daily. <br /> We're confident fbox.to is the <strong> best free movies streaming website</strong> in the space that you can't simply miss! <br /> The biggest motivation to help us make the site better is sharing the site with friends Thanks!</p>
        <div className="share-socials">
            <button className="facebook"><FaFacebookF className="social-icon"/> Facebook</button>
            <button className="twitter"><FaTwitter className="social-icon"/> Twitter</button>
            <button className="email"><FaEnvelope className="social-icon"/> Email</button>
            <button className="pinterest"><FaPinterestP className="social-icon"/> Pinterest</button>
            <button className="whatsapp"><FaWhatsapp className="social-icon"/> Whatsapp</button>
            <button className="telegram"><FaTelegram className="social-icon"/> Telegram</button>
        </div>
    </div>
    );
};

export default About;