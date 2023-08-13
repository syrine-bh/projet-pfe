import { useEffect, useState } from "react"
import '../stylesheets/dashboard.css'

import { useAuthUser } from "react-auth-kit"
import DashboardForAdmin from "../components/dashboard/dashboard-for-admin"
import { Navigate } from "react-router"
import DashboardForClient from "../components/dashboard/dashboard-for-client"
import DashboardForMember from "../components/dashboard/dashboard-for-member"
function Dashboard() {

    const auth = useAuthUser()

    const handleView = () => {
        if(auth()!.roles.includes("ROLE_ADMIN")){
            return <DashboardForAdmin />
        }
        if(auth()!.roles.includes("ROLE_CLIENT")){
            return <DashboardForClient />
        }
        if(auth()!.roles.includes("ROLE_MEMBRE")){
            return <DashboardForMember />
        }
        return <Navigate to={"/notifications"} />
    }

    return (
        handleView()
    )
}

export default Dashboard