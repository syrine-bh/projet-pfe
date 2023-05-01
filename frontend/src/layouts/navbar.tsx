import { useEffect, useState } from 'react'
import { useAuthUser, useSignOut } from 'react-auth-kit'

import { Link, useNavigate } from "react-router-dom";
import NotificationPanel from '../components/layouts/notification-panel';
import { fetchNotifications } from '../fetchers/notification-fetcher';
import { NotificationModel } from '../models/NotificationModel';



//stylesheets
import '../stylesheets/navbar.css'
import ProfileAvatar from '../components/profile-avatar';


function Navbar() {

  //navigation
  const navigate = useNavigate();

  //connected user
  const auth = useAuthUser();
  const signOut = useSignOut();

  const [notifications, setNotifications] = useState<NotificationModel[]>([])

  const handleMenu = () => {
    window.Helpers.toggleCollapsed();
  }

  const logout = () => {
    if (signOut() == true) {
      navigate("/login")
    }
  }


  const fetchData = async () => {
    if (auth()!.roles.includes("ROLE_ADMIN")) {
      const response = await fetchNotifications(auth()!.token)
      setNotifications(response)
    }

  }

  useEffect(() => {
    fetchData()
  }, [])



  return (
    <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
      <div onClick={handleMenu} className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <div className="nav-item nav-link px-0 me-xl-4">
          <i className="bx bx-menu bx-sm"></i>
        </div>
      </div>

      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">

        <div className="navbar-nav align-items-center">
          <div className="nav-item d-flex align-items-center">
            <i className="bx bx-search fs-4 lh-0"></i>
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search..."
              aria-label="Search..."
            />
          </div>
        </div>


        <ul className="navbar-nav flex-row align-items-center ms-auto">

          <li className="nav-item me-2 me-xl-0">
            {/* <div onClick={handleToggle} className="nav-link style-switcher-toggle hide-arrow">
              {(theme === 'light')
                ? <i className="bx bx-sm bx-moon"></i>
                : <i className="bx bx-sm bx-sun"></i>
              }
            </div> */}
          </li>

          <li className="nav-item dropdown-language dropdown me-2 me-xl-0">
            <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown" aria-expanded="false">
              ENG
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item selected" href="#" data-language="en">
                  <i className="fi fi-us fis rounded-circle fs-4 me-1"></i>
                  <span className="align-middle">English</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" data-language="fr">
                  <i className="fi fi-fr fis rounded-circle fs-4 me-1"></i>
                  <span className="align-middle">France</span>
                </a>
              </li>
            </ul>
          </li>






          {(auth()!.roles.includes("ROLE_ADMIN")) && <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-1">
            <button id='toggleNotification' style={{
              background: "none",
              border: "none"
            }} className="nav-link dropdown-toggle hide-arrow" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
              <i className="bx bx-bell bx-sm"></i>
              <span className="badge bg-danger rounded-pill badge-notifications">{notifications.filter((item) => item.vu === 0).length}</span>
            </button>
            <NotificationPanel notifications={notifications} />
          </li>}



          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <div className="nav-link dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
              <div className="avatar avatar-online">

                <ProfileAvatar
                  firstName={auth()!.firstname}
                  lastName={auth()!.lastname}
                  radius={40}
                />    
                 </div>
            </div>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <div className="dropdown-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                      <ProfileAvatar
                  firstName={auth()!.firstname}
                  lastName={auth()!.lastname}
                  radius={40}
                />                       </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-semibold d-block">{auth()!.firstname + " " + auth()!.lastname}</span>
                      <small style={{ textTransform: 'capitalize' }} className="text-muted">{auth()!.roles[0].split("_")[1].toLowerCase()}</small>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <div className="dropdown-item">
                  <Link style={{ color: "#5f6e7f" }} to={`/profile/${auth()!.id}`}>
                    <i className="bx bx-user me-2"></i>
                    <span className="align-middle">My Profile</span>
                  </Link>

                </div>
              </li>
              <li>
                <div className="dropdown-item">
                  <Link style={{ color: "#5f6e7f" }} to={`/UpdatePassword`}>
                    <i className="bx bx-cog me-2"></i>
                    <span className="align-middle">Settings</span>
                  </Link>
                </div>
              </li>
              {/*<li>
                <div className="dropdown-item">
                  <span className="d-flex align-items-center align-middle">
                    <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                    <span className="flex-grow-1 align-middle">Billing</span>
                    <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                  </span>
                </div>
          </li> */}

              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <div onClick={logout} className="dropdown-item">
                  <i className="bx bx-power-off me-2"></i>
                  <span className="align-middle">Log Out</span>
                </div>
              </li>
            </ul>
          </li>

        </ul>




      </div>


    </nav >
  )
}

export default Navbar