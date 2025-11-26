import { Menubar } from "primereact/menubar";
import { useSelector } from "react-redux";

const Messages = () => {
  const userRedux = useSelector((state) => state.user.value);
  const items = [
    {
      label: "Disputas",
      command: (e) => {
        // highlightElement(e, routes.DASHBOARD_FREELANCER_PROJECTS_CONTRACTED);
      },
      className: "gray-back",
    },
    {
      label: "Mensajes",
      command: (e) => {
        // highlightElement(e, routes.DASHBOARD_FREELANCER_PROJECTS_INPROGRESS);
      },
    },
    {
      label: "Verificaciones",
      command: (e) => {
        // highlightElement(e, routes.DASHBOARD_FREELANCER_PROJECTS_FINISHED);
      },
    },
  ];
  return (
    <div>
      <div className="gray">
        <Menubar
          model={items.filter(
            (i) =>
              i.isFreelancer === userRedux?.isFreelancer ||
              i.isFreelancer === undefined
          )}
        />
      </div>
      <h1>Messages</h1>
    </div>
  );
};

export default Messages;
