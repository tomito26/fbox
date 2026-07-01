import { FaExclamationCircle } from "react-icons/fa";

const ErrorMessage = ({ message }) => (
    <div className="error-message">
        <FaExclamationCircle style={{marginRight:"5px",marginBottom:"3px",fontSize:"20px"}}/>
        {message}
    </div>
);

export default ErrorMessage;
