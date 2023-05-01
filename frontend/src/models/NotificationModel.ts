import { UserModel } from "./UserModel";

export interface NotificationModel {
    id: number,
    contenu: string,
    vu: number,
    createdAt: string,
    user: UserModel
}