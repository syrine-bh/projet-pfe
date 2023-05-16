import { UserModel } from "./UserModel";

export interface ProjectModel {
    id: number,
    title: string,
    description: string,
    gitRepo: string,
    startdate: string,
    deadline: string,
    gestionnaire: UserModel
    clients: UserModel[]
    members: UserModel[]
    nbrTicketDone: number,
    nbrTicketsTotal: number,
    nbrComments:number,
}