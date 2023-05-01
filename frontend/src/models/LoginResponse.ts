import { UserModel } from "./UserModel";

export interface LoginResponse {
    status:string;
    message: string;
    user?:UserModel;
}