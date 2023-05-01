import { error } from "console";
import { INIT_PROJECT, apiClient } from "../config";
import { BackendResponse } from "../models/BackendResponse";
import { ProjectModel } from "../models/ProjectModel";
import { UserModel } from "../models/UserModel";
import { TicketModel } from "../models/TicketModel";
import TicketColumn from "../models/TicketColumn";


export const addTicket = async (projectId: string, title: string, description: string, priority: string, createdById: number, token: string) => {
    try {
        const response = await apiClient.post<BackendResponse>(`/projects/${projectId}/tickets/add`, {
            title: title,
            description: description,
            priority: priority,
            createdById: createdById,
        }, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.status === 200) {
            return response.data;
        }
        const backendResponse: BackendResponse = { status: "error", message: "Internal server error " }
        return backendResponse;

    } catch (error: any) {
        const backendResponse: BackendResponse = { status: "error", message: "Internal server error" }
        return backendResponse;
    }

}

export const uploadTicketAttachements = async (ticketId: string, files: File[], token: string) => {
    try {
        const formData = new FormData();
        files.forEach((file, index) => formData.append(`files[${index}]`, file));

        const response = await apiClient.post<BackendResponse>(`/api/projects/tickets/${ticketId}/uploadAttachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data;',
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            return response.data;
        }
        const backendResponse: BackendResponse = { status: "error", message: "Internal server error " }
        return backendResponse;

    } catch (error: any) {
        console.log(error)
        const backendResponse: BackendResponse = { status: "error", message: "Internal server error" }
        return backendResponse;
    }

}

export const saveChanges = async (projectId: string, columns: TicketColumn, token: string) => {
    let tickets: TicketModel[] = []

    let requested = columns["Requested"].items
    let todos = columns["Todo"].items
    let inProgress = columns["InProgress"].items
    let done = columns["Done"].items

    for (let i = 0; i < requested.length; i++) {
        requested[i].status = "Requested"
    }

    for (let i = 0; i < todos.length; i++) {
        todos[i].status = "Todo"
    }

    for (let i = 0; i < inProgress.length; i++) {
        inProgress[i].status = "InProgress"
    }

    for (let i = 0; i < done.length; i++) {
        done[i].status = "Done"
    }

    tickets = [...requested, ...todos, ...inProgress, ...done]




    try {
        const response = await apiClient.post<BackendResponse>(`/projects/${projectId}/tickets/updateStatus`, tickets, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.status === 200) {
            return response.data;
        }
        const backendResponse: BackendResponse = { status: "error", message: "Internal server error " }
        return backendResponse;

    } catch (error: any) {
        const backendResponse: BackendResponse = { status: "error", message: "Internal server error" }
        return backendResponse;
    }

}

export const fetchTickets = async (projectId: string, token: string): Promise<TicketModel[]> => {
    try {
        const response = await apiClient.get<TicketModel[]>(`/projects/${projectId}/tickets`, {
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

export const fetchTicketById = async (id: number, token: string): Promise<TicketModel> => {
    try {
        const response = await apiClient.get<TicketModel>(`/ticket/${id}`, { headers: { "Authorization": `Bearer ${token}` } });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch ticket by ID");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch ticket by ID");
    }
};


export const assignTicket = async (ticketId: number, memberId: number, token: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.put<BackendResponse>(`/projects/tickets/assign`, { ticketId, memberId }, { headers: { "Authorization": `Bearer ${token}` } });
        return response.data;

    } catch (error) {
        console.error(error);
        const backendResponse: BackendResponse = { status: "error", message: "Internal server error " }
        return backendResponse;
    }
};
