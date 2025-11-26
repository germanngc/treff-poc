import BaseApi from "./BaseApi";
import { trackPromise } from "react-promise-tracker";

const PROJECT_ENDPOINT = "/Project";

class ProjectApi extends BaseApi {
  async createService(project) {
    try {
      const data = await trackPromise(this.post(PROJECT_ENDPOINT, project));
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProjectById(id) {
    try {
      const data = await trackPromise(this.get(PROJECT_ENDPOINT + "/" + id));
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProjectsGroupedByUserId(freelancerId) {
    try {
      const data = await trackPromise(this.get(PROJECT_ENDPOINT + `/${freelancerId}/grouped-by-user`));
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProjectsByFreelancerId(freelancerId, status) {
    const request = {
      id: freelancerId,
      status
    }
    try {
      const data = await trackPromise(this.post(PROJECT_ENDPOINT + "/freelancer", request));
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getProjectsByUserId(userId, status) {
    const request = {
      id: userId,
      status
    }
    try {
      const data = await trackPromise(this.post(PROJECT_ENDPOINT + "/user", request));
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getProjectViewsGroupedByUserId(freelancerId) {
    try {
      const data = await trackPromise(this.get(PROJECT_ENDPOINT + `/${freelancerId}/views-by-user`));
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new ProjectApi();
