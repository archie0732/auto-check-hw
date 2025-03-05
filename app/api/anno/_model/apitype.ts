export interface GitHubFileResponse {
  sha: string;
  content: string;
}

export interface Annonument {
  annonument:
  {
    title: string;
    in_link: string;
    out_link: string;
    description: string;
    time: string;
  }[];
}

export interface AnnoGetAPI {
  yanami:
  {
    title: string;
    in_link: string;
    out_link: string;
    description: string;
    time: string;
  }[];
}
