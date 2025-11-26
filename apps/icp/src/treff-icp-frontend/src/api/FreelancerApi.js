import BaseApi from "./BaseApi";

const FREELANCER_ENDPOINT = "/Freelancer";

class FreelancerApi extends BaseApi {
  async getFreelancerById(id) {
    try {
      const data = await this.get(`${FREELANCER_ENDPOINT}/${id}`);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFreelancerByPrincipal(principal) {
    try {
      const request = {
        principal,
      };
      const data = await this.post(`${FREELANCER_ENDPOINT}/loginByPrincipal`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getServicesByFreelancerId(id) {
    try {
      const data = await this.get(`${FREELANCER_ENDPOINT}/services/${id}`);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createFreelancer(request) {
    try {
      const data = await this.post(`${FREELANCER_ENDPOINT}`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateFreelancer(id, request) {
    try {
      const data = await this.put(
        `${FREELANCER_ENDPOINT}/Update?id=${id}`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateEducations(request) {
    try {
      const data = await this.post(
        `${FREELANCER_ENDPOINT}/educations`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateCertifications(request) {
    try {
      const data = await this.post(
        `${FREELANCER_ENDPOINT}/certifications`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
  async updateLanguages(request) {
    try {
      const data = await this.post(`${FREELANCER_ENDPOINT}/languages`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePhoto(request) {
    try {
      const data = await this.post(
        `${FREELANCER_ENDPOINT}/updatePhoto`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginFreelancer(request) {
    try {
      const data = await this.post(`${FREELANCER_ENDPOINT}/login`, request);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePassword(request) {
    try {
      const data = await this.post(
        `${FREELANCER_ENDPOINT}/updatePassword`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateNotificationId(freelancerId, notificationId) {
    const request = {
      id: freelancerId,
      notificationId,
    };
    try {
      const data = await this.postSilently(
        `${FREELANCER_ENDPOINT}/updateNotificationId`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateChatId(freelancerId, chatId) {
    const request = {
      id: freelancerId,
      messageId: chatId,
    };
    try {
      const data = await this.postSilently(
        `${FREELANCER_ENDPOINT}/updateChatId`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateSms(request) {
    try {
      const data = await this.post(
        `${FREELANCER_ENDPOINT}/validateSms`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateMail(request) {
    try {
      const data = await this.post(
        `${FREELANCER_ENDPOINT}/validateEmail`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateCode(request) {
    try {
      const data = await this.post(
        `${FREELANCER_ENDPOINT}/validateCode`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginThirdParty(request) {
    try {
      const data = await this.post(
        `${FREELANCER_ENDPOINT}/loginThirdParty`,
        request
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAdmins() {
    try {
      const data = await this.get(`${FREELANCER_ENDPOINT}/admin`);
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new FreelancerApi();
