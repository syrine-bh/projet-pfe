import { useEffect, useState } from "react"
import { NotificationModel } from "../models/NotificationModel"
import { fetchNotifications, updateNotification } from "../fetchers/notification-fetcher"
import { useAuthUser } from "react-auth-kit"
import { useNavigate } from "react-router-dom"

function Notifications() {
    const [notifications, setNotifications] = useState<NotificationModel[]>([])
    const auth = useAuthUser()
    const navigate = useNavigate()

    const fetchData = async () => {
        const response = await fetchNotifications(auth()!.id, auth()!.token)
        setNotifications(response)
    }

    const handleClick = async (notification: NotificationModel) => {
        const response = await updateNotification(notification.id, auth()!.token)

        if (response.status === "success") {
            //document.getElementById("toggleNotification")!.click()
            switch (notification.type) {
                case 'user':
                    navigate(`/validateUser/${notification.link}`)
                    break;
                case 'project':
                    navigate(`/projects`)
                    break;
                case 'ticket':
                    navigate(`/projects/${notification.link}/tickets`)
                    break;
                default:
                    console.log("error in navigation")
                    break;
            }
        }
    }


    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div style={{ padding: "6rem" }}>
            <ul style={{ background: 'white', boxShadow: "0 0.25rem 1rem rgba(161, 172, 184, .45)", listStyle: 'none', padding: 0, borderRadius: '7px' }} id='notificationPanel'>
                <li className="dropdown-menu-header border-bottom">
                    <div className="dropdown-header d-flex align-items-center py-3 px-3">
                        <h5 className="text-body mb-0 me-auto">Notification</h5>
                    </div>
                </li>
                <li className="dropdown-notifications-list scrollable-container ps" style={{ maxHeight: '400px', overflow: 'auto' }}>
                    <ul className="list-group list-group-flush" style={{ maxHeight: '400px', overflow: 'auto' }}>
                        {notifications.map((notification) => <li className="list-group-item list-group-item-action dropdown-notifications-item">
                            <div onClick={() => handleClick(notification)}>
                                <div className="d-flex">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar">
                                            <span className="avatar-initial rounded-circle bg-label-success"><i className="bx bx-user-plus"></i></span>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: notification.vu === 0 ? 'bold' : 'normal' }} className="flex-grow-1">
                                        
                                        {notification.vu === 0 && <h6 className="mb-1">Nouvelle notification ✉️ </h6>}
                                        <p className="mb-0">{notification.contenu}</p>
                                        <small className="text-muted"> {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}</small>
                                    </div>
                                    <div className="flex-shrink-0 dropdown-notifications-actions">
                                        {notification.vu == 0 && <button style={{ background: "none", border: "none" }} className="dropdown-notifications-read"><span className="badge badge-dot"></span></button>}
                                        <button style={{ background: "none", border: "none" }} className="dropdown-notifications-archive"><span className="bx bx-x"></span></button>
                                    </div>
                                </div>
                            </div>
                        </li>)}





                    </ul>
                    <div className="ps__rail-x" style={{ left: "0px", bottom: "0px" }}><div className="ps__thumb-x" tabIndex={0} style={{ left: "0px", width: "0px" }}></div></div><div className="ps__rail-y" style={{ top: "0px", right: "0px" }}><div className="ps__thumb-y" tabIndex={0} style={{ top: "0px", height: "0px" }}></div></div></li>
                <li className="dropdown-menu-footer border-top">
                    <a href="#" className="dropdown-item d-flex justify-content-center p-3">
                        View all notifications
                    </a>
                </li>
            </ul>
        </div>

    )
}

export default Notifications