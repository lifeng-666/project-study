export interface Course {
  name: string;
  teacher: string;
  cover: string;
  id: number;
  token: string;
}

export interface Document {
  name: string; //文件名
  path: string; //文件路径
  id: number;
  createTime: string;
}

export interface Video {
  name: string;
  path: string;
  id: number;
  completed: boolean;
  process: number;
}

export type AddFile = {
  name: string;
  path: string;
  courseId: number;
};
export type AddDocument = AddFile;
export type AddVideo = AddFile;

export type Process = ({ process }: { process: number }) => void;
