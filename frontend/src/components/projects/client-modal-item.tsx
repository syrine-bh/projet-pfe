import React from 'react'
import { UserModel } from '../../models/UserModel'
import ProfileAvatar from '../profile-avatar'

interface ClientModalItemProps {
    client: UserModel
    onSelectUser: () => void
    onDeleteUser: () => void
    isSelected:boolean
}

function ClientModalItem({ client, isSelected,onSelectUser, onDeleteUser }: ClientModalItemProps) {
    return (
        <tr key={client.id} className="odd">
            <td className="  control" tabIndex={0} style={{ display: "none" }}>
            </td>
            <td className="sorting_1">
                <div className="d-flex justify-content-left align-items-center">
                    <div className="avatar-wrapper">
                    <div className="avatar avatar-sm me-3">
                        <ProfileAvatar
                  firstName={client.firstname}
                  lastName={client.lastname}
                  radius={40}
                />                          </div>
                    </div>
                    <div className="d-flex flex-column">
                            <span className="fw-semibold">{client.firstname} {client.lastname}</span>
                        <small className="text-muted">{client.email}</small>
                    </div>
                </div>
            </td>
            <td><span className="fw-semibold">{client.company}</span></td>
            <td>
                {(isSelected)?
                <button onClick={onDeleteUser} className='btn btn-outline-danger'>
                    <i className='bx bx-trash'></i>
                </button>
                :<button onClick={onSelectUser} className='btn btn-outline-primary'>
                <i className='bx bx-plus'></i>
            </button>}
            </td>
        </tr>
    )
}

export default ClientModalItem