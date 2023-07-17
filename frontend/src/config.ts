import axios from "axios";
import { UserModel } from "./models/UserModel";
import { ProjectModel } from "./models/ProjectModel";
import { PaginatedUsers } from "./models/PaginatedUsers";
import { TicketModel } from "./models/TicketModel";
import { CommentModel } from "./models/CommentModel";
import { DashboardModel } from "./models/dashboardModel";

export const config = {
  baseUrl: "http://localhost:8000",
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const INIT_USER: UserModel = { id: 0, email: "", firstname: "", lastname: "", isActive: 0, isVerified: 0, phoneNumber: "", roles: ["ROLE_MEMBRE"], token: "", company: "" }

export const INIT_PROJECT: ProjectModel = {
  id: 0, title: "", description: "", gitRepo: "", startdate: new Date().toISOString(), deadline: new Date().toISOString(), gestionnaire: INIT_USER, clients: [], members: [], nbrTicketDone: 0, nbrTicketsTotal: 0, nbrComments: 0
}

export const INIT_TICKET: TicketModel = {
  id: 0, title: "", description: "", status: "",
  priority: "low",
  assignedTo: INIT_USER,
  createdBy: INIT_USER,
  project: INIT_PROJECT,
  nbrComments: 0,
  nbrAttachements: 0
}

export const INIT_COMMENT: CommentModel = {
  id: 0,
  content: "",
  type: "",
  createdAt: "",
  ticket: INIT_TICKET,
  addedBy: INIT_USER,
}

export const INIT_PAGINATED_USERS: PaginatedUsers = {
  pagination: {
    page: 0,
    per_page: 0,
    total_pages: 0,
    total_users: 0,
    offset: 0
  },
  docs: [],
  isLoadingAccounts: true
}

export const INIT_DASHBOARD: DashboardModel = {
  barchart: [],
  totalNumberUsers: 0,
  totalNumberActiveUsers: 0,
  roleDistribution: {
    ROLE_ADMIN: 0,
    ROLE_CLIENT: 0,
    ROLE_GESTIONNAIRE: 0,
    ROLE_MEMBRE: 0,
    Autres: 0
  },
  totalNumberProjects: 0,
  totalNumberCompletedProjects: 0,
  averageTicketsPerProject: 0,
  totalNumberTickets: 0,
  totalNumberOpenTicket: 0,
  totalNumberClosedTicket: 0,
  ticketDistribution: {
    low: 0,
    medium: 0,
    high: 0
  },
}

export const apiClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    "Content-type": "application/json",
  }
});

