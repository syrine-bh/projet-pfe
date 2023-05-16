import { apiClient } from "../config";
import { BackendResponse } from "../models/BackendResponse";
import { NotificationModel } from "../models/NotificationModel";

export const fetchNotifications = async (id: number, token: string): Promise<NotificationModel[]> => {
    try {
        const response = await apiClient.get<NotificationModel[]>(`/api/notifications/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }
        return [];

    } catch (error: any) {
        return [];
    }

}


export const fetchNotificationsForPanel = async (id: number, token: string): Promise<NotificationModel[]> => {
    try {
        const response = await apiClient.get<NotificationModel[]>(`/api/notificationsForPanel/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }
        return [];

    } catch (error: any) {
        return [];
    }

}

export const validateUser = async (id: number, password: string, token: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.post<BackendResponse>(`/api/validateUser/${id}`, {
            password: password
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }
        return { status: "error", message: "something went wrong" };

    } catch (error: any) {
        return { status: "error", message: "internal server error" };
    }

}

export const updateNotification = async (id: number, token: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.get<BackendResponse>(`/api/notification/update/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }
        return { status: "error", message: "something went wrong" };

    } catch (error: any) {
        return { status: "error", message: "internal server error" };
    }

}


export const fetchNotificationAssignedUser = async (ticketId: string, token: string): Promise<NotificationModel[]> => {
    try {
        const response = await apiClient.get<NotificationModel[]>(`/getNotificationsForUser/${ticketId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }
        return [];

    } catch (error: any) {
        return [];
    }

}
