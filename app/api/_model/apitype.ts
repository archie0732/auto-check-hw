export interface QuestionDetailAPI {
  name: string;
  slug: string;
  url: string;
  time: string;
  author: string;
  sample_input: string;
  sample_output: string;
  check_input: string;
  check_output: string;
  ans_link: string;
}

export interface QuestionDetailData {

  content: string;
  detail: {
    name: string;
    time: string;
    id: number;
    author: string;
    sample_input: string;
    sample_output: string;
    check_input: string;
    check_output: string;
    ans_link: string;
    slug: string;
    url: string;
  };
}

export interface CheckHWResultData {
  error?: string;
  userans?: string;
}

export interface AutoCheckAPI {
  annonument:
  {
    title: string;
    in_link: string;
    out_link: string;
    description: string;
    time: string;
  }[];
  test: string;
  student:
  {
    id: string;
    name: string;
    intro: string;
    avatar: string;
    hw: string[];
  }[];
}
