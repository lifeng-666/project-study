export interface UpdatePwd {
  password: string;
  newPassword: string;
}

export interface Login {
  username: string;
  password: string;
}

export type Register = Login & UserInfo;

export enum Role {
  'Teacher' = 1,
  'Student' = 2,
}

export type UserInfo = {
  username: string;
  rid: Role.Teacher | Role.Student;
} & UserInfoWithOutRole;

export interface UserInfoWithOutRole {
  realname: string;
  sex: boolean;
  college: string;
  subject: string;
}
