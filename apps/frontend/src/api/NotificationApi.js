import BaseApi from "./BaseApi";

const ENDPOINT = "/Notification";

class NotificationApi extends BaseApi {
  async getNotificationsByFreelancerId(freelancerId, onlyUnread) {
    const request = {
      freelancerId,
      onlyUnread,
    };

    try {
      const data = await this.post(`${ENDPOINT}/byFreelancer`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async clearNotificationsByFreelancerId(freelancerId) {
    const request = {
      freelancerId,
    };

    try {
      const data = await this.postSilently(`${ENDPOINT}/clearByFreelancer`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createNotification(userId, clientId, notificationType, idNotificationType) {
    const request = {
      userId,
      clientId,
      notificationType,
      idNotificationType
    };

    try {
      const data = await this.post(`${ENDPOINT}/add`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new NotificationApi();
