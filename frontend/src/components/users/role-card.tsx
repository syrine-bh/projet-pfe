import React from 'react'
import { UserModel } from '../../models/UserModel'
import ProfileAvatar from '../profile-avatar'

interface RoleCardProps {
    users: UserModel[]
    title: string
}

function RoleCard({ title, users }: RoleCardProps) {
    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                    <h6 className="fw-normal">Total {users.length} users</h6>
                    <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">

                        {users.map((item, index) => {
                            return (index < 4) && 
                            <li key={index} data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top"
                                className="avatar avatar-sm pull-up" aria-label="Vinnie Mostowy"
                                data-bs-original-title="Vinnie Mostowy">
                                <ProfileAvatar
                                    firstName={item.firstname}
                                    lastName={item.lastname}
                                    radius={32}
                                />
                            </li>
                        })}
                        {(users.length > 4) && <li>
                            <small className="text-muted ms-1">+{users.length - 4}</small>
                        </li>}
                    </ul>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                    <div className="role-heading">
                        <h4 className="mb-1">{title}</h4>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#addRoleModal"
                            className="role-edit-modal"><small>Edit Role</small></a>
                    </div>
                    <a href="#" className="text-muted"><i className="bx bx-copy"></i></a>
                </div>
            </div>
        </div>
    )
}

export default RoleCard