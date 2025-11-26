import { usePromiseTracker } from "react-promise-tracker";
// import Loader from 'react-loader-spinner';
import {BallTriangle} from 'react-loader-spinner';
import { getURLImage } from "./utils/images";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        promiseInProgress &&
        <div className="overlay">
            {/* <BallTriangle
            type="TailSpin"
            color="#FFF"
            background="rgba(63, 81, 181, 0.7)"
            fullscreen={true}
            dismissible={true}
            show={true}
        /> */}
        <img src={getURLImage("images/spinner2.gif", true)} width={100} alt="loading" />
        </div>
    );
}

export default LoadingIndicator;