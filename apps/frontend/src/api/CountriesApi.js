// https://api.first.org/data/v1/countries
import BaseApi from "./BaseApi";
import { trackPromise } from 'react-promise-tracker';

const COUNTRY_ENDPOINT = "https://api.first.org/data/v1/countries";

class CountriesApi extends BaseApi {
    async getCountries(){
        try{
            const data = await trackPromise(this.getWithoutUrlParent(COUNTRY_ENDPOINT));
            return data.data;
        } catch (error){
            throw new Error(error);
        }
    }

}

export default new CountriesApi();