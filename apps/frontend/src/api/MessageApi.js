import BaseApi from "./BaseApi";

const MESSAGE_ENDPOINT = "/Message";

class MessageApi extends BaseApi {
  async getUsers(userId) {
    try {
      const data = await this.get(`${MESSAGE_ENDPOINT}/users/${userId}`);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMessagesUsers(userId, otherUserId) {
    try {
      const data = await this.get(`${MESSAGE_ENDPOINT}/between/${userId}/${otherUserId}`);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendMessage(request) {
    try {
      const data = await this.post(`${MESSAGE_ENDPOINT}`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendMail(request) {
    try {
      const data = await this.post(`${MESSAGE_ENDPOINT}/help`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new MessageApi();
