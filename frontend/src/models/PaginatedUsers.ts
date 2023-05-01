import { UserModel } from "./UserModel"

export interface PaginatedUsers {
    pagination: {
        page: number,
        per_page: number,
        total_pages: number,
        total_users: number,
        offset: number
    },
    docs: UserModel[],
    isLoadingAccounts: boolean
}