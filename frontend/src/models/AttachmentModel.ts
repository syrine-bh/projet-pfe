import { TicketModel } from "./TicketModel"
import { UserModel } from "./UserModel"

export interface AttachmentModel {
    id: number,
    ticket: TicketModel,
    uploadedBy: UserModel,
    name: string,
    displayName: string
    mimeType: string
    createdAt: string
}