import { PublicUser, FriendshipStatus } from '../../types';

export interface IFriendService {
  getFriends(): Promise<PublicUser[]>;
  getIncomingRequests(): Promise<PublicUser[]>;
  sendRequest(userId: string): Promise<void>;
  acceptRequest(userId: string): Promise<void>;
  removeFriend(userId: string): Promise<void>;
  getFriendshipStatus(userId: string): Promise<FriendshipStatus>;
  searchUsers(username: string): Promise<PublicUser[]>;
  getUserProfile(userId: string): Promise<PublicUser>;
}
