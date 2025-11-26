import { useDispatch } from "react-redux";
import { FreelancerApi } from "../api";

// const addUser = (post) => {
//   return {
//     type: "ADD_USER",
//     payload: post,
//   };
// };

const GetUser = (id) => {
//   const dispatch = useDispatch();
  return async(dispatch) => {
    const user = await FreelancerApi.getFreelancerById(id);
    // .then((user) => {
      alert(5);
      // dispatch
      dispatch({
        type: "GET_USER",
        payload: user,
      });
    // });
  };

  // const user = await FreelancerApi.getFreelancerById(id);
  // return {
  //     type: "GET_USER",
  //     payload: user
  // };
};

// export {  GetUser };
