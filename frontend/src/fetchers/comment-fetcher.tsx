import { INIT_COMMENT, INIT_PROJECT, apiClient } from "../config";
import { BackendResponse } from "../models/BackendResponse";
import { ProjectModel } from "../models/ProjectModel";
import { UserModel } from "../models/UserModel";
import { TicketModel } from "../models/TicketModel";
import TicketColumn from "../models/TicketColumn";
import { CommentModel } from "../models/CommentModel";


export const addComment = async (ticketId: number,type:string, content: string, addedById: number, token: string) => {
    try {
        const response = await apiClient.post<CommentModel>(`/ticket/${ticketId}/comment/add`, {
            addedById: addedById,
            type: type,
            content: content
        }, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.status === 200) {
            return response.data;
        }
        return INIT_COMMENT;

    } catch (error: any) {
        return INIT_COMMENT;
    }
}
export const fetchComments = async (ticketId: number, token: string): Promise<CommentModel[]> => {
    try {
        const response = await apiClient.get<CommentModel[]>(`/tickets/${ticketId}/comments/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }
        return []
    } catch (error: any) {
        return [];
    }
}