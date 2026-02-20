import { AxiosInstance } from 'axios';
import { IFriendService } from '../interfaces/friendService';
import { PublicUser, FriendshipStatus } from '../../types';

export class RealFriendService implements IFriendService {
  constructor(private client: AxiosInstance) {}

  async getFriends(): Promise<PublicUser[]> {
    const { data } = await this.client.get('/friends');
    return data;
  }

  async getIncomingRequests(): Promise<PublicUser[]> {
    const { data } = await this.client.get('/friends/requests');
    return data;
  }

  async sendRequest(userId: string): Promise<void> {
    await this.client.post(`/friends/request/${userId}`);
  }

  async acceptRequest(userId: string): Promise<void> {
    await this.client.post(`/friends/accept/${userId}`);
  }

  async removeFriend(userId: string): Promise<void> {
    await this.client.delete(`/friends/${userId}`);
  }

  async getFriendshipStatus(userId: string): Promise<FriendshipStatus> {
    const { data } = await this.client.get(`/friends/status/${userId}`);
    return data.status as FriendshipStatus;
  }

  async searchUsers(username: string): Promise<PublicUser[]> {
    const { data } = await this.client.get('/users/search', { params: { username } });
    return data;
  }

  async getUserProfile(userId: string): Promise<PublicUser> {
    const { data } = await this.client.get(`/users/${userId}/profile`);
    return data;
  }
}
