import React from 'react'
import { useAuthUser } from 'react-auth-kit';
import { Link, useNavigate } from 'react-router-dom'
import { updateNotification } from '../../fetchers/notification-fetcher';
import { NotificationModel } from '../../models/NotificationModel'

interface NotificationPanelProps {
    notifications: NotificationModel[]
}

function NotificationPanel({ notifications }: NotificationPanelProps) {
    const navigate = useNavigate();
    const auth = useAuthUser();
    const handleClick = async (idNotification: number, idUser: number) => {
        const response = await updateNotification(idNotification,auth()!.token)

        if(response.status==="success"){
            document.getElementById("toggleNotification")!.click()
            navigate(`/validateUser/${idUser}`)
        }

        
    }

    return (
        <ul id='notificationPanel' className="dropdown-menu dropdown-menu-end py-0">
            <li className="dropdown-menu-header border-bottom">
                <div className="dropdown-header d-flex align-items-center py-3">
                    <h5 className="text-body mb-0 me-auto">Notification</h5>
                    <a href="#" className="dropdown-notifications-all text-body" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Mark all as read" data-bs-original-title="Mark all as read"><i className="bx fs-4 bx-envelope-open"></i></a>
                </div>
            </li>
            <li className="dropdown-notifications-list scrollable-container ps">
                <ul className="list-group list-group-flush">
                    {/* <li className="list-group-item list-group-item-action dropdown-notifications-item marked-as-read">
                        <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar">
                                    <img src="./assets/img/avatars/2.png" alt="" className="w-px-40 h-auto rounded-circle" />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="mb-1">New Message ✉️</h6>
                                <p className="mb-0">You have new message from Natalie</p>
                                <small className="text-muted">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                                <a href="#" className="dropdown-notifications-read"><span className="badge badge-dot"></span></a>
                                <a href="#" className="dropdown-notifications-archive"><span className="bx bx-x"></span></a>
                            </div>
                        </div>
                    </li> */}
                    {notifications.map((notification) => {
                        return <li key={notification.id} className="list-group-item list-group-item-action dropdown-notifications-item">
                            <div onClick={() => handleClick(notification.id, notification.user.id)}>
                                <div className="d-flex">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar">
                                            <span className="avatar-initial rounded-circle bg-label-success"><i className="bx bx-user-plus"></i></span>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">Nouvelle notification ✉️ </h6>
                                        <p className="mb-0">{notification.contenu}</p>
                                        <small className="text-muted"> {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}</small>
                                    </div>
                                    <div className="flex-shrink-0 dropdown-notifications-actions">
                                        {notification.vu == 0 && <button style={{ background: "none", border: "none" }} className="dropdown-notifications-read"><span className="badge badge-dot"></span></button>}
                                        <button style={{ background: "none", border: "none" }} className="dropdown-notifications-archive"><span className="bx bx-x"></span></button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    })}

                </ul>
                <div className="ps__rail-x" style={{ left: "0px", bottom: "0px" }}><div className="ps__thumb-x" tabIndex={0} style={{ left: "0px", width: "0px" }}></div></div><div className="ps__rail-y" style={{ top: "0px", right: "0px" }}><div className="ps__thumb-y" tabIndex={0} style={{ top: "0px", height: "0px" }}></div></div></li>
            <li className="dropdown-menu-footer border-top">
                <a href="#" className="dropdown-item d-flex justify-content-center p-3">
                    View all notifications
                </a>
            </li>
        </ul>
    )
}

export default NotificationPanel