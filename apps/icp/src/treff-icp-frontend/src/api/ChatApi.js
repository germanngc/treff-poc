import BaseApi from "./BaseApi";

const CHAT_ENDPOINT = "/Chat";

class ChatApi extends BaseApi {
  async getChat(request) {
    try {
      const data = await this.post(`${CHAT_ENDPOINT}/getChat`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new ChatApi();
