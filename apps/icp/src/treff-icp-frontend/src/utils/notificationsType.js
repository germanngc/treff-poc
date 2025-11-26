import { routes } from "../routes";

export const notificationsEnum = {
  NEWPROJECT: 1,
  CANCELLEDPROJECT: 2,
  MESSAGE: 3,
};

export const statusData = {
  NEWPROJECT: {
    text: "quiere contratar contigo",
    value: notificationsEnum.NEWPROJECT,
    url: routes.DASHBOARD_FREELANCER_PROJECTS_DETAIL,
  },
  CANCELLEDPROJECT: {
    text: "ha cancelado el proyecto",
    value: notificationsEnum.CANCELLEDPROJECT,
    url: routes.DASHBOARD_FREELANCER_PROJECTS_DETAIL,
  },
  MESSAGE: {
    text: "te ha enviado un mensaje",
    value: notificationsEnum.MESSAGE,
    url: routes.DASHBOARD_FREELANCER_PROJECTS_DETAIL,
  },
};

export const getNotificationValue = (notificationTypeNumber) => {
  switch (notificationTypeNumber) {
    case statusData.NEWPROJECT.value:
      return statusData.NEWPROJECT;
    case statusData.CANCELLEDPROJECT.value:
      return statusData.CANCELLEDPROJECT;
    case statusData.MESSAGE.value:
      return statusData.MESSAGE;
    default:
      return statusData.NEWPROJECT;
  }
};
