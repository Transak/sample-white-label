import { ApiClient } from './ApiClient.js';
import { PublicAPIService } from './services/PublicAPIService.js';
import { UserService } from './services/UserService.js';
import { OrderService } from './services/OrderService.js';
import ApiSpecs from './constants/apiSpecs/index.js';
class TransakAPI {
  constructor(config) {
    this.client = new ApiClient(config);
    this.user = new UserService(this.client);
    this.public = new PublicAPIService(this.client);
    this.order = new OrderService(this.client);
  }

  async verifyAndSetAccessToken(token) {
    const userData = await this.user.getUser();
    if (userData && userData.id) {
      this.client.setAccessToken(token);
      this.client.setUserData(userData);
      return true;
    } else throw new Error('Invalid access token');
  }

  async isAccessTokenValid(token) {
    try {
      return await this.verifyAndSetAccessToken(token);
    } catch (e) {
      return false;
    }
  }
}

export { TransakAPI,  ApiSpecs };
