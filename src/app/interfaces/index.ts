export interface IUserResponse {
    items: IItem[];
    incomplete_results: boolean;
    total_count: number;
  }
  
  export interface IItem {
    id: number;
    following_url: string;
    events_url: string;
    avatar_url: string;
    followers_url: string;
    gravatar_id: string;
    gists_url: string;
    html_url: string;
    repos_url: string;
    organizations_url: string;
    login: string;
    received_events_url: string;
    site_admin: boolean;
    subscriptions_url: string;
    score: number;
    starred_url: string;
    type: string;
    url: string;
  }
  