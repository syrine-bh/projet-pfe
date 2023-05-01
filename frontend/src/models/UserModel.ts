
export interface UserModel {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    isActive: number;
    isVerified: number;
    roles: string[]
    token: string;
    company:string;
    errors?:{
        errorCode:number,
        errorMessage:string
    }
}
