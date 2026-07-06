import { FaEnvelope, FaFacebookF,FaPinterestP,FaTelegram,FaTwitter, FaWhatsapp } from "react-icons/fa"
import { shareTo } from "../utils/share";

const About = () =>{
    // Share the site the user is actually on, so the CTA works on any deployment.
    const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://fbox.to";
    const shareText = "Watch free movies & TV shows on fbox.to";

    const share = (network) => shareTo(network, { url: shareUrl, text: shareText });

    return(
    <div className="about">
        <h2>Watch Free  Movies Online</h2>
        <p>If you want to <strong>watch free movies online</strong> fbox.to is right place.It allows you to <strong>watch free movies</strong> online for free. No registration is required,fast streaming servers,update daily. <br /> We're confident fbox.to is the <strong> best free movies streaming website</strong> in the space that you can't simply miss! <br /> The biggest motivation to help us make the site better is sharing the site with friends Thanks!</p>
        <div className="share-socials">
            <button className="facebook" onClick={()=>share("facebook")}><FaFacebookF className="social-icon"/> Facebook</button>
            <button className="twitter" onClick={()=>share("twitter")}><FaTwitter className="social-icon"/> Twitter</button>
            <button className="email" onClick={()=>share("email")}><FaEnvelope className="social-icon"/> Email</button>
            <button className="pinterest" onClick={()=>share("pinterest")}><FaPinterestP className="social-icon"/> Pinterest</button>
            <button className="whatsapp" onClick={()=>share("whatsapp")}><FaWhatsapp className="social-icon"/> Whatsapp</button>
            <button className="telegram" onClick={()=>share("telegram")}><FaTelegram className="social-icon"/> Telegram</button>
        </div>
    </div>
    );
};

export default About;