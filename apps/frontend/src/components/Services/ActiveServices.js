import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewService } from "../../redux/serviceReducer";
import { routes } from "../../routes";
import ActiveServicesByFreelancer from "./ActiveServicesByFreelancer";

const ActiveServices = () => {
  const userRedux = useSelector((state) => state.user.value);
  const [user] = useState(userRedux);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addNew = () => {
    // navigate("..");
    // navigate("/");
    dispatch(addNewService({}));
    navigate(
      "/" +
        routes.DASHBOARD_FREELANCER +
        "/" +
        routes.DASHBOARD_SERVICENEW +
        "/" +
        routes.DASHBOARD_SERVICENEW_TITLE
    );
  };

  const clickElement = (service) => {
    dispatch(addNewService(service));
    // navigate(
    //   "/" +
    //     routes.DASHBOARD_FREELANCER +
    //     "/" +
    //     routes.DASHBOARD_SERVICENEW +
    //     "/" +
    //     routes.DASHBOARD_SERVICENEW_TITLE
    // );
  };

  return (
    <>
      <div className="mb-4">
        <ActiveServicesByFreelancer
          freelancerId={user.id}
          addNew={addNew}
          clickElement={clickElement}
          redirectTo={
            "/" +
            routes.DASHBOARD_FREELANCER +
            "/" +
            routes.DASHBOARD_SERVICENEW +
            "/" +
            routes.DASHBOARD_SERVICENEW_TITLE
          }
        />
      </div>
    </>
  );
};

export default ActiveServices;
