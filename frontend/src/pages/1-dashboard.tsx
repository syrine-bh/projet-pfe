import { useEffect, useState } from "react"
import '../stylesheets/dashboard.css'

import { useAuthUser } from "react-auth-kit"
import DashboardForAdmin from "../components/dashboard/dashboard-for-admin"
import { Navigate } from "react-router"
function Dashboard() {

    const auth = useAuthUser()

    const handleView = () => {
        if(auth()!.roles.includes("ROLE_ADMIN")){
            return <DashboardForAdmin />
        }
        return <Navigate to={"/notifications"} />
    }

    return (
        handleView()
    )
}

export default Dashboard