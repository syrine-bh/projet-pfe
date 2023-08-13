import React from 'react'
import { Link } from 'react-router-dom';
import { UserModel } from '../../models/UserModel'
import ProfileAvatar from '../profile-avatar';
interface UserItemProps {
    user: UserModel;
    index: number;
    onclickUpdate: () => void
    onClickStatus: () => void
}

function renderRole(role: string): JSX.Element {
    switch (role) {
        case "ADMIN":
            return <span className="badge badge-center rounded-pill bg-label-success w-px-30 h-px-30 me-2">
                <i className="bx bx-font-color bx-xs"></i>
            </span>
        case "USER":
            return <span className="badge badge-center rounded-pill bg-label-primary w-px-30 h-px-30 me-2">
                <i className="bx bx-user-circle'bx-xs"></i>
            </span>
        case "CLIENT":
            return <span className="badge badge-center rounded-pill bg-label-warning w-px-30 h-px-30 me-2">
                <i className="bx bx-user bx-xs"></i></span>
        case "GESTIONNAIRE":
            return <span className="badge badge-center rounded-pill bg-label-info w-px-30 h-px-30 me-2">
                <i className="bx bx-user-voice bx-xs"></i></span>
        default:
            return <span className="badge badge-center rounded-pill bg-label-primary w-px-30 h-px-30 me-2">
                <i className="bx bxs-user-circle bx-xs"></i>
            </span>
    }
}

function UserItem({ index, user, onclickUpdate, onClickStatus }: UserItemProps) {

    return (
        <tr key={index} className="odd">
            <td className="  control" tabIndex={0} style={{ display: "none" }}>
            </td>
            <td className="sorting_1">
                <div className="d-flex justify-content-left align-items-center">
                    <div className="avatar-wrapper">
                        <div className="avatar avatar-sm me-3">
                        <ProfileAvatar
                  firstName={user.firstname}
                  lastName={user.lastname}
                  radius={40}
                />                          </div>
                    </div>
                    <div className="d-flex flex-column">
                            <span className="fw-semibold">{user.firstname} {user.lastname}</span>
                        <small className="text-muted">{user.email}</small>
                    </div>
                </div>
            </td>
            <td>
                <span style={{ textTransform: 'capitalize' }} className="text-truncate d-flex align-items-center">

                    <div>
                        <ul style={{ listStyleType: "none" }}>
                            {user.roles.map((role, index) => (role!=="ROLE_USER") && <li style={{ marginBottom: "5px" }} key={index}>
                                {renderRole(role.split("_")[1])}
                                {role.split("_")[1].toLowerCase()}
                            </li>)}
                        </ul>

                    </div>
                </span>
            </td>
            <td>
                {(user.isActive === 1)
                    ? <span className="badge bg-label-success">Active</span>
                    : <span className="badge bg-label-danger">Inactive</span>}
            </td>
            <td>
                <div className="d-inline-block text-nowrap">
                    <button onClick={onclickUpdate} className="btn btn-sm btn-icon"><i className="bx bx-edit"></i></button>
                    <button className="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end m-0">
                        <Link to={`/profile/${user.id}`} className="dropdown-item">Voir profil</Link>
                        <button onClick={onClickStatus} className="dropdown-item">{(user.isActive === 1) ? "Desactiver" : "Activer"}</button>
                    </div>
                </div>
            </td>
        </tr>
    )
}

export default UserItem