
import { useNavigate} from 'react-router-dom'
function Button({type, className = "",  path ,onClick,children}) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        if (onClick) {
            onClick(); // Call the onClick function passed as prop to execute custom lo   
        }
        if (path) {
            navigate(path); // Navigate to the given path after clicking the button
        }
    };
    return (
    <button  type={type} onClick={handleClick} className={className}>{children}</button>
    )
}
export default Button;