export type CaseId = string;

export type Case = {
  title: string;
  meta: string;
  body: string;
  bodyDetail: string;
  eis: string;
};

export type CasePhotoPack = {
  folder: string;
  files: string[];
};

export type CasePhoto = {
  id: string;
  src: string;
  alt?: string;
};
