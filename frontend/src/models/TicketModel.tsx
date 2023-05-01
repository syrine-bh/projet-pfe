import { AttachmentModel } from "./AttachmentModel";
import { CommentModel } from "./CommentModel";
import { ProjectModel } from "./ProjectModel";
import { UserModel } from "./UserModel";

export interface TicketModel {
    id: number,
    title: string,
    description: string,
    status: string,
    priority: string,
    assignedTo?: UserModel,
    createdBy: UserModel,
    project: ProjectModel,
    comments?: CommentModel[]
    attachments?: AttachmentModel[]
    nbrComments: number
    nbrAttachements: number
}