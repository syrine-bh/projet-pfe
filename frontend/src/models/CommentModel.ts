import { ProjectModel } from "./ProjectModel";
import { TicketModel } from "./TicketModel";
import { UserModel } from "./UserModel";

export interface CommentModel {
    id: number,
    type:string
    content:string,
    createdAt:string,
    ticket:TicketModel,
    addedBy:UserModel
}