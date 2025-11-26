import { useNavigate } from "react-router-dom";
import { routes } from "../routes";

const Logout = () =>{
    localStorage.clear();
    const navigate = useNavigate();
    navigate(routes.HOME);
}

export default Logout;
