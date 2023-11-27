import { JwtPayload } from 'jsonwebtoken';
import { IPatient } from './IPatient.interface';
import { IPsychologist } from './IPsychologist.interface';
import { IRole } from './IRole.interface';

export interface IUser {
  id: number;
  username: string | null;
  email: string | null;
  phone: string | null;
  password: string;
  refreshToken: string;
  isActivated: boolean;
  roles?: IRole[];
  patient?: IPatient | null;
  psychologist?: IPsychologist | null;
}

export interface IUserTokenData extends IUser {
  refreshToken: string;
  accessToken: string;
}

export interface IUserJwtPayload extends Partial<Pick<IUser, 'id'>>, JwtPayload {}
