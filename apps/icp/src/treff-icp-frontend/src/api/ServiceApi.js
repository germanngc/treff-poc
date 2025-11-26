import BaseApi from "./BaseApi";
import { trackPromise } from "react-promise-tracker";

const CATEGORY_ENDPOINT = "/Service";

class ServiceApi extends BaseApi {
  async getServiceById(id) {
    try {
      const data = await trackPromise(this.get(CATEGORY_ENDPOINT + "/" + id));
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getHighlightServices(limit, byFreelancer) {
    try {
      const data = await trackPromise(
        this.post(CATEGORY_ENDPOINT + "/highlightLimit/", {
          limit,
          byFreelancer,
        })
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getServices(limit, byFreelancer) {
    try {
      const data = await trackPromise(
        this.post(CATEGORY_ENDPOINT + "/limit/", { limit, byFreelancer })
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getServicesByCategoryId(categoryId, byFreelancer) {
    try {
      const data = await trackPromise(
        this.post(CATEGORY_ENDPOINT + "/category/", {
          categoryId,
          byFreelancer,
        })
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getHighlightServicesByCategoryId(categoryId, byFreelancer) {
    try {
      const data = await trackPromise(
        this.post(CATEGORY_ENDPOINT + "/categoryPremium/", {
          categoryId,
          byFreelancer,
        })
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async uploadFilesServices(files) {
    try {
      const data = await trackPromise(
        this.post(CATEGORY_ENDPOINT + "/files/", files)
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createService(service) {
    try {
      const data = await trackPromise(this.post(CATEGORY_ENDPOINT, service));
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateService(id, service) {
    try {
      const data = await trackPromise(
        this.put(CATEGORY_ENDPOINT + "?id=" + id, service)
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateView(serviceId, userId) {
    const request = {
      id: serviceId,
      userId,
    };
    try {
      const data = await trackPromise(
        this.post(CATEGORY_ENDPOINT + "/views", request)
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async filterServices(serviceName, categoryId, byFreelancer, expressDelivery, filterOption, verified, invoice, byService) {
    const filter = {
      serviceName,
      categoryId,
      byFreelancer,
      expressDelivery,
      filterOption,
      verified,
      invoice,
      byService
    };
    try {
      const data = await trackPromise(
        this.post(CATEGORY_ENDPOINT + "/filter", filter)
      );
      return data.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new ServiceApi();
