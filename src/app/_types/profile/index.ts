export interface Profile {
  id: number;
  userId: string;
  name: string;
  email: string;
  walletAddress?: string;
  iconKey?: string;
}

export interface ProfileIndexResponse {
  status: number;
  data: Profile;
}
