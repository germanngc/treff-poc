import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login";
import { FreelancerApi } from "../api";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userReducer";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const SocialLogin = (props) => {
  const dispatch = useDispatch();
  const toast = useRef(null);

  const responseFacebook = async (response) => {
    const data = response.data;
    const request = {
      mail: data.email,
      name: data.name,
      photo: data.picture.data.url,
      facebookId: data.id,
    };
    var userResponse = await FreelancerApi.loginThirdParty(request);
    dispatch(addUser(userResponse));
    toast.current.show({
      severity: "success",
      summary: "Bienvenido",
      detail: userResponse.name,
    });
    props.onClose();
  };

  const responseGoogle = async (response) => {
    const data = response.data;
    const request = {
      mail: data.email,
      name: data.name,
      photo: data.picture,
      facebookId: data.sub,
    };
    var userResponse = await FreelancerApi.loginThirdParty(request);
    dispatch(addUser(userResponse));
    toast.current.show({
      severity: "success",
      summary: "Bienvenido",
      detail: userResponse.name,
    });
    props.onClose();
  };
  return (
    <>
      <LoginSocialFacebook
        appId={process.env.REACT_APP_FB_APP_ID || ""}
        onResolve={(response) => {
          console.log(response);
          responseFacebook(response);
        }}
        onReject={(error) => {
          console.log(error);
        }}
      >
        <FacebookLoginButton />
      </LoginSocialFacebook>

      <LoginSocialGoogle
        client_id={process.env.REACT_APP_GG_APP_ID || ""}
        scope="openid profile email"
        // discoveryDocs="claims_supported"
        // access_type="offline"
        onResolve={(response) => {
          console.log(response);
          responseGoogle(response);
        }}
        onReject={(error) => {
          console.log(error);
        }}
      >
        <GoogleLoginButton />
      </LoginSocialGoogle>
      <Toast ref={toast}></Toast>
    </>
  );
};

export default SocialLogin;
