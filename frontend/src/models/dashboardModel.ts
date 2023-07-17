

export interface DashboardModel {
    barchart: {
        company: string,
        projectCount: number
    }[],
    totalNumberUsers: number
    totalNumberActiveUsers: number
    roleDistribution: {
        ROLE_MEMBRE: number
        ROLE_ADMIN: number
        ROLE_GESTIONNAIRE: number
        ROLE_CLIENT: number
        Autres: number
    }
    totalNumberProjects: number
    totalNumberCompletedProjects: number
    averageTicketsPerProject: number
    totalNumberTickets: number
    totalNumberOpenTicket: number
    totalNumberClosedTicket: number
    ticketDistribution: {
        high: number
        low: number
        medium: number
    }
}