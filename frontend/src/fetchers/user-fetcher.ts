import { apiClient, config, INIT_PAGINATED_USERS, INIT_USER } from "../config";
import { BackendResponse } from "../models/BackendResponse";
import { LoginResponse } from "../models/LoginResponse";
import { PaginatedUsers } from "../models/PaginatedUsers";
import { UserModel } from "../models/UserModel";

export const login = async (email: string, password: string): Promise<LoginResponse> => {

    /*try {
        const res= await fetch(
            `${config.baseUrl}/api/login_check`,
            {
                method: 'POST',
                body:JSON.stringify({ username: email, "password": password })
            }
        );
        console.log(res)
        if (!res.ok) {
            throw new Error("Bad response", {
                cause: {
                    res
                }
            });
        }
        const loginResponse = await res.json()
        return {
            status: "success",
            message: "User connected Successfully",
            user: loginResponse
        }


    } catch (error: any) {
        console.log(error)
        switch (error.cause.response?.status) {
            case 400:
                console.log("400")
                return {
                    status: "error",
                    message: "error occured, code 400"
                }
            case 401:
                console.log("unauthorized")
                return {
                    status: "error",
                    message: "unauthorized, code 401"
                }
            case 404:
                console.log("404 not found")
                return {
                    status: "error",
                    message: "404 not found, code 404"
                }
            case 500:

                console.log("internal server error")
                return {
                    status: "error",
                    message: "internal server error, code 500"
                }
            default:
                console.log("somthing went wrong")
                return {
                    status: "error",
                    message: "somthing went wrong"
                }
        }
    }*/



    try {
        const response = await apiClient.post('/api/login_check', { username: email, password: password });


        if (response.status === 200) {
            const loginResponse: LoginResponse = {
                status: "success",
                message: "User connected Successfully",
                user: response.data
            }
            return loginResponse;
        }

        const loginResponse: LoginResponse = { status: "error", message: "Internal server error " }
        return loginResponse;


    } catch (error: any) {

        if (error.response.status === 401) {
            const loginResponse: LoginResponse = { status: "error", message: "Invalid credentials" }
            return loginResponse;
        }

        const loginResponse: LoginResponse = { status: "error", message: "Internal server error" }
        return loginResponse;
    }

}

export const loginAvance = async (email: string, password: string): Promise<LoginResponse> => {



    try {
        const response = await apiClient.post<BackendResponse | UserModel>('/login', { email: email, password: password });

        if (response.status === 200) {
            const loginResponse: LoginResponse = {
                status: "success",
                message: "User connected Successfully",
                user: response.data as UserModel
            }
            return loginResponse;
        }

        const res = response.data as BackendResponse;
        const loginResponse: LoginResponse = { status: "error", message: res.message }
        return loginResponse;


    } catch (error: any) {

        const loginResponse: LoginResponse = { status: "error", message: "Internal server error" }
        return loginResponse;
    }

}


export const register = async (email: string, password: string, firstname: string, lastname: string, phoneNumber: string) => {
    try {
        const response = await apiClient.post<BackendResponse>('/register', { email: email, password: password, firstname: firstname, lastname: lastname, phoneNumber: phoneNumber });
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

export const registerClient = async (email: string, password: string, firstname: string, lastname: string, phoneNumber: string, company: string) => {
    try {
        const response = await apiClient.post<BackendResponse>('/register', {
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname,
            phoneNumber: phoneNumber,
            company: company
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




export const sendVerificationCode = async (email: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.put<BackendResponse>('/sendVerificationCode', { email: email });

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

export const verifyCode = async (email: string, code: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.post<BackendResponse>('/verifyCode', { email: email, code: code });

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


export const resetPassword = async (email: string, password: string, code: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.put<BackendResponse>('/resetPassword', { email: email, password: password, code: code });

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


export const updateUser = async (user: UserModel, token: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.put<BackendResponse>(`/api/users/update/${user.id}`, user, {
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

export const fetchUserById = async (id: number, token: string): Promise<UserModel> => {
    try {
        const response = await apiClient.get<UserModel>(`/api/user/${id}`, { headers: { "Authorization": `Bearer ${token}` } });

        if (response.status === 200) {
            return response.data;
        }

        if (response.status === 201) {
            return {
                ...INIT_USER, errors: {
                    errorCode: 201,
                    errorMessage: "User not found"
                }
            }
        }
        return {
            ...INIT_USER, errors: {
                errorCode: 404,
                errorMessage: "something went wrong"
            }
        }


    } catch (error: any) {
        return {
            ...INIT_USER, errors: {
                errorCode: 404,
                errorMessage: "something went wrong"
            }
        }
    }

}

export const fetchUsers = async (token: string): Promise<UserModel[]> => {
    try {
        const response = await apiClient.get<UserModel[]>(`/api/all/`, { headers: { "Authorization": `Bearer ${token}` } });

        if (response.status === 200) {
            return response.data;
        }
        return []


    } catch (error: any) {
        return []
    }
}


export const fetchPaginatedUsers = async (token: string, perPage: number, page: number): Promise<PaginatedUsers> => {
    try {
        const response = await apiClient.get<PaginatedUsers>(`/api/AllPaginated?page=${page}&perPage=${perPage}`, { headers: { "Authorization": `Bearer ${token}` } });

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





export const fetchmodifyPassword = async (userId: number, oldPassword: string, newPassword: string, confirmPassword: string, token: string): Promise<BackendResponse> => {
    try {
        const response = await apiClient.put<BackendResponse>(`/api/modifyPassword/${userId}`, {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        }, {
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



export const fetchPaginatedClients = async (token: string, perPage: number, page: number): Promise<PaginatedUsers> => {
    try {
        const response = await apiClient.get<PaginatedUsers>(`/api/AllPaginatedClients?page=${page}&perPage=${perPage}`, { headers: { "Authorization": `Bearer ${token}` } });

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


export const fetchPaginatedMembersGestionnaires = async (token: string, perPage: number, page: number): Promise<PaginatedUsers> => {
    try {
        const response = await apiClient.get<PaginatedUsers>(`/api/AllPaginatedMembersGestionnaires?page=${page}&perPage=${perPage}`, { headers: { "Authorization": `Bearer ${token}` } });

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

