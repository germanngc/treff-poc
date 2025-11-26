import { Avatar } from "primereact/avatar";
import { Card } from "react-bulma-components";
import { Link } from "react-router-dom";
import { routes } from "../../../routes";
import { setDateString } from "../../../utils/dates";
import { getURLImage } from "../../../utils/images";

const ProjectListByStatus = (props) => {
  return (
    <>
      {props.projects.length > 0 ? (
        <div>
          {props.projects.map((p, i) => (
            <div className="mt-2" key={i}>
              <Card className="pl-1 pr-2">
                <div className="columns is-vcentered">
                  <div className="column is-1">
                    <img
                      alt="Ver proyecto"
                      src={getURLImage(p.service?.category?.image)}
                    />
                  </div>
                  <div className="column is-3">
                    <b>{p.service?.category?.name}</b>
                  </div>
                  <div className="column is-2">
                    {setDateString(p.creationDate)}
                  </div>
                  <div className="column is-2">
                    {setDateString(p.calculatedFinishDate)}
                  </div>
                  <div className="column is-2">
                    <p className="p-blue-weigth">${p.package?.cost} MXN</p>
                  </div>
                  <div className="column has-text-right">
                    {p.freelancer?.photo && (
                      <Avatar
                        className="ml-3 mt-2"
                        image={getURLImage(p.user?.photo)}
                        size="large"
                        shape="circle"
                      />
                    )}
                  </div>
                  <div className="column has-text-right">
                    <Link
                      to={
                        "/" +
                        routes.DASHBOARD_FREELANCER_PROJECTS_DETAIL.replace(
                          ":id",
                          p.id
                        )
                      }
                    >
                      <img
                        width={23}
                        alt="Ver proyecto"
                        src={getURLImage("images/eye.png", true)}
                        style={{
                          minWidth: "23px",
                        }}
                      />
                    </Link>
                  </div>
                </div>
              </Card>
              <br />
            </div>
          ))}
        </div>
      ) : (
        <div className="has-text-centered mt-6 pt-6 pb-6">
          <p className="text-dark">
            Parece que no hay proyectos que mostrar.
          </p>
        </div>
      )}
    </>
  );
};

export default ProjectListByStatus;
