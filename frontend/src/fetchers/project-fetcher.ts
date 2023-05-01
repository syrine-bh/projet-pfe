import { error } from "console";
import { INIT_PAGINATED_USERS, INIT_PROJECT, apiClient } from "../config";
import { BackendResponse } from "../models/BackendResponse";
import { ProjectModel } from "../models/ProjectModel";
import { UserModel } from "../models/UserModel";
import { PaginatedUsers } from "../models/PaginatedUsers";


export const fetchProjects = async (userId: string, token: string):Promise<ProjectModel[]> => {
    try {
        const response = await apiClient.get<ProjectModel[]>(`/projects/${userId}`, {
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

export const addProject = async (title: string, description: string, startdate: string, deadline: string, gestionnaireId: string, clients: UserModel[], members: UserModel[]) => {
    try {
        const response = await apiClient.post<BackendResponse>('/addProject', {
            title: title,
            description: description,
            startdate: startdate,
            deadline: deadline,
            gestionnaireId: gestionnaireId,
            clients: clients,
            members: members
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




export const updateProject = async (project: ProjectModel, gestionnaireId: string, token: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.put<BackendResponse>(`/updateProject/${project.id}`, { ...project, gestionnaireId: gestionnaireId }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }

        const backendResponse: BackendResponse = { status: "error", message: "something went wrong" }
        return backendResponse;


    } catch (error: any) {
        const backendResponse: BackendResponse = { status: "error", message: "something went wrong" }
        return backendResponse;
    }

}





export const fetchProjectById = async (id: number, token: string): Promise<ProjectModel> => {
    try {
        const response = await apiClient.get<ProjectModel>(`/project/${id}`, { headers: { "Authorization": `Bearer ${token}` } });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error("Failed to fetch project by ID");
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch project by ID");
    }
};









export const fetchPaginatedUsersAddedToProject = async (projectId: string,token: string, perPage: number, page: number): Promise<PaginatedUsers> => {
    try {
        const response = await apiClient.get<PaginatedUsers>(`/projects/${projectId}/members?page=${page}&perPage=${perPage}`, { headers: { "Authorization": `Bearer ${token}` } });

        if (response.status === 200) {
            return {
                ...response.data,
                isLoadingAccounts:false
            };
        }
        return {
            ...INIT_PAGINATED_USERS,
            isLoadingAccounts:false
        }


    } catch (error: any) {
        return {
            ...INIT_PAGINATED_USERS,
            isLoadingAccounts:false
        }
    }
}

