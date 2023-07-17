import React from 'react'
import { useAuthUser } from 'react-auth-kit';
import { UserModel } from '../../models/UserModel';

interface ProfileComponentProps{
  user:UserModel
}


function ProfileComponent({user}:ProfileComponentProps) {


  return (


      <div className='col-xl-4 col-lg-5 col-md-5'>
        <div className="card mb-4">
          <div className="card-body">
            <small className="text-muted text-uppercase">About</small>
            <ul className="list-unstyled mb-4 mt-3">
              <li className="d-flex align-items-center mb-3"><i className="bx bx-user"></i><span className="fw-semibold mx-2">Full Name:</span> <span>{`${user.firstname} ${user.lastname}`}</span></li>
              <li className="d-flex align-items-center mb-3"><i className="bx bx-check"></i><span className="fw-semibold mx-2">Status:</span> <span>Active</span></li>
              <li className="d-flex align-items-center mb-3"><i className="bx bx-star"></i><span className="fw-semibold mx-2">Role:</span> <span style={{textTransform:'capitalize'}}>{user.roles[0].split("_")[1].toLowerCase()}</span></li>
              <li className="d-flex align-items-center mb-3"><i className="bx bx-flag"></i><span className="fw-semibold mx-2">Country:</span> <span>Tunisie</span></li>
            </ul>
            <small className="text-muted text-uppercase">Contacts</small>
            <ul className="list-unstyled mb-4 mt-3">
              <li className="d-flex align-items-center mb-3"><i className="bx bx-phone"></i><span className="fw-semibold mx-2">Contact:</span> <span>{user.phoneNumber}</span></li>
              <li className="d-flex align-items-center mb-3"><i className="bx bx-envelope"></i><span className="fw-semibold mx-2">Email:</span> <span>{user.email}</span></li>
            </ul>
            
          </div>
        </div>


      </div>



  )
}

export default ProfileComponent