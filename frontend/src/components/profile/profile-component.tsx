import React from 'react'
import { useAuthUser } from 'react-auth-kit';
import { UserModel } from '../../models/UserModel';

interface ProfileComponentProps{
  user:UserModel
}


function ProfileComponent({user}:ProfileComponentProps) {


  return (
    <div className='row'>

      {/* About User */}
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
            <small className="text-muted text-uppercase">Teams</small>
            <ul className="list-unstyled mt-3 mb-0">
              <li className="d-flex align-items-center mb-3"><i className="bx bxl-github text-primary me-2"></i>
                <div className="d-flex flex-wrap"><span className="fw-semibold me-2">Backend Developer</span><span>(126 Members)</span></div>
              </li>
              <li className="d-flex align-items-center"><i className="bx bxl-react text-info me-2"></i>
                <div className="d-flex flex-wrap"><span className="fw-semibold me-2">React Developer</span><span>(98 Members)</span></div>
              </li>
            </ul>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <small className="text-muted text-uppercase">Overview</small>
            <ul className="list-unstyled mt-3 mb-0">
              <li className="d-flex align-items-center mb-3"><i className="bx bx-check"></i><span className="fw-semibold mx-2">Task Compiled:</span> <span>13.5k</span></li>
              <li className="d-flex align-items-center mb-3"><i className="bx bx-customize"></i><span className="fw-semibold mx-2">Projects Compiled:</span> <span>146</span></li>
              <li className="d-flex align-items-center"><i className="bx bx-user"></i><span className="fw-semibold mx-2">Connections:</span> <span>897</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className='col-xl-8 col-lg-7 col-md-7'>
        {/* Timeline */}
        <div className="card card-action mb-4">
          <div className="card-header align-items-center">
            <h5 className="card-action-title mb-0"><i className="bx bx-list-ul me-2"></i>Activity Timeline</h5>
            <div className="card-action-element">
              <div className="dropdown">
                <button type="button" className="btn dropdown-toggle hide-arrow p-0" data-bs-toggle="dropdown" aria-expanded="false"><i className="bx bx-dots-vertical-rounded"></i></button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#;">Share timeline</a></li>
                  <li><a className="dropdown-item" href="#;">Suggest edits</a></li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li><a className="dropdown-item" href="#;">Report bug</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body">
            <ul className="timeline ms-2">
              <li className="timeline-item timeline-item-transparent">
                <span className="timeline-point timeline-point-warning"></span>
                <div className="timeline-event">
                  <div className="timeline-header mb-1">
                    <h6 className="mb-0">Client Meeting</h6>
                    <small className="text-muted">Today</small>
                  </div>
                  <p className="mb-2">Project meeting with john @10:15am</p>
                  <div className="d-flex flex-wrap">
                    <div className="avatar me-3">
                      <img src="./assets/img/avatars/3.png" alt="Avatar" className="rounded-circle" />
                    </div>
                    <div>
                      <h6 className="mb-0">Lester McCarthy (Client)</h6>
                      <span>CEO of Infibeam</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="timeline-item timeline-item-transparent">
                <span className="timeline-point timeline-point-info"></span>
                <div className="timeline-event">
                  <div className="timeline-header mb-1">
                    <h6 className="mb-0">Create a new project for client</h6>
                    <small className="text-muted">2 Day Ago</small>
                  </div>
                  <p className="mb-0">Add files to new design folder</p>
                </div>
              </li>
              <li className="timeline-item timeline-item-transparent">
                <span className="timeline-point timeline-point-primary"></span>
                <div className="timeline-event">
                  <div className="timeline-header mb-1">
                    <h6 className="mb-0">Shared 2 New Project Files</h6>
                    <small className="text-muted">6 Day Ago</small>
                  </div>
                  <p className="mb-2">Sent by Mollie Dixon <img src="./assets/img/avatars/4.png" className="rounded-circle ms-3" alt="avatar" height="20" width="20" /></p>
                  <div className="d-flex flex-wrap gap-2">
                    <a href="#" className="me-3">
                      <img src="./assets/img/icons/pdf.png" alt="Document image" width="20" className="me-2" />
                      <span className="h6">App Guidelines</span>
                    </a>
                    <a href="#">
                      <img src="./assets/img/icons/doc.png" alt="Excel image" width="20" className="me-2" />
                      <span className="h6">Testing Results</span>
                    </a>
                  </div>
                </div>
              </li>
              <li className="timeline-item timeline-item-transparent">
                <span className="timeline-point timeline-point-success"></span>
                <div className="timeline-event pb-0">
                  <div className="timeline-header mb-1">
                    <h6 className="mb-0">Project status updated</h6>
                    <small className="text-muted">10 Day Ago</small>
                  </div>
                  <p className="mb-0">Woocommerce iOS App Completed</p>
                </div>
              </li>
              <li className="timeline-end-indicator">
                <i className="bx bx-check-circle"></i>
              </li>
            </ul>
          </div>
        </div>
      
      </div>


    </div>
  )
}

export default ProfileComponent