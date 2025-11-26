export const statusEnum = {
    INPROGRESS: 1,
    CANCELLEDBYUSER: 2,
    CANCELLEDBYFREELANCER: 3,
    FINISHED: 4,
};

export const statusData = {
  INPROGRESS: { text: "En progreso", value: statusEnum.INPROGRESS },
  CANCELLEDBYUSER: { text: "Cancelado por el usuario", value: statusEnum.CANCELLEDBYUSER },
  CANCELLEDBYFREELANCER: { text: "Cancelado por el freelancer", value: statusEnum.CANCELLEDBYFREELANCER },
  FINISHED: { text: "Terminado", value: statusEnum.FINISHED },
};

export const getStatusValue = (statusNumber) => {
  switch (statusNumber) {
    case statusData.INPROGRESS.value:
      return statusData.INPROGRESS;
    case statusData.CANCELLEDBYUSER.value:
      return statusData.CANCELLEDBYUSER;
    case statusData.CANCELLEDBYFREELANCER.value:
      return statusData.CANCELLEDBYFREELANCER;
    case statusData.FINISHED.value:
      return statusData.FINISHED;
    default:
      return statusData.INPROGRESS;
  }
};
