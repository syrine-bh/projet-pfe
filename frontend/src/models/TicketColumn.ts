import { TicketModel } from "./TicketModel";

export default interface TicketColumn {
    [key: string]: {
        name: string,
        displayName: string,
        items: TicketModel[]
    }

}