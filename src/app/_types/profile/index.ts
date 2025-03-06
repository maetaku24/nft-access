export interface Profile {
  id: number;
  name: string;
  email: string;
  walletAddress?: string;
  iconKey?: string;
}

export interface ProfileIndexResponse {
  status: number;
  data: Profile;
}
