import React, { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ProfileComponent from '../components/profile/profile-component'
import ProjectsComponent from '../components/profile/projects-component'
import { INIT_USER } from '../config'
import { fetchUserById } from '../fetchers/user-fetcher'
import { UserModel } from '../models/UserModel'
import ProfileAvatar from '../components/profile-avatar'



function Profile() {
  //customs hooks
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  let { userId } = useParams();
  const auth = useAuthUser()

  //state hooks
  const [section, setSection] = useState<string>("profile")
  const [user, setUser] = useState<UserModel>(INIT_USER)
  //avatar




  //constant
  const sections = ["profile", "projects"]

  useEffect(() => {
    initPage()
  }, [])

  async function initPage() {

    if (!(userId && Number(userId))) {
      console.log("invalid params")
      return;
    }

    const fetchedUser = await fetchUserById(Number(userId), auth()!.token)
    if (fetchedUser.errors) {
      console.log(fetchedUser.errors.errorMessage)
      return;
    }
    setUser(fetchedUser)



    var initSection = "profile"
    if (searchParams.get("section")) {
      initSection = searchParams.get("section")!
    }
    setSection(initSection)
  }

  function handleSections(sec: string) {
    navigate(`/profile/${userId}?section=${sec}`, { preventScrollReset: true, replace: true });
    setSection(sec)
  }

  return (
    <div className="content-wrapper">

      {/* Content */}

      <div className="container-xxl flex-grow-1 container-p-y">


        <h4 className="fw-bold py-3 mb-4">
          <span className="text-muted fw-light">User Profile /</span> {section.toUpperCase()}
        </h4>



        {/* Header */}
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="user-profile-header-banner">
                <img style={{ width: "100%", objectFit: "cover", height: "250px" }} src="./assets/img/backgrounds/back.jpg" alt="Banner image" className="rounded-top" />
              </div>
              <div className="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center mb-4">
                <div className="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
                  <ProfileAvatar
                    style={{border: "5px solid",marginLeft: "1.5rem"}}
                    firstName={auth()!.firstname}
                    lastName={auth()!.lastname}
                    rounded={false}
                    radius={110}
                  />
                </div>
                <div className="flex-grow-1 mt-3">
                  <div className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-4 flex-md-row flex-column gap-4">
                    <div className="user-profile-info">
                      <h4>{`${user.firstname} ${user.lastname}`}</h4>
                      <ul className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-2">
                        <li style={{ textTransform: "capitalize" }} className="list-inline-item fw-semibold">
                          <i className="bx bx-pen"></i> {user.roles[0].split("_")[1].toLowerCase()}
                        </li>
                        <li className="list-inline-item fw-semibold">
                          <i className="bx bx-map"></i> Tunis
                        </li>
                        <li className="list-inline-item fw-semibold">
                          <i className="bx bx-calendar-alt"></i> Joined february 2023</li>
                      </ul>
                    </div>
                    {/*  <a href="#" className="btn btn-primary text-nowrap">
                      <i className="bx bx-user-check me-1"></i>Connected
  </a>*/}
                    <Link to="/Editprofile">

                      <button className="btn btn-sm btn-iconbtn btn-primary text-nowrap" ><i className="bx bx-edit"></i></button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*/ Header */}



        {/* Navbar pills */}
        <div className="row">
          <div className="col-md-12">
            <ul className="nav nav-pills flex-column flex-sm-row mb-4">
              {sections.map((sec, index) => {
                const isActive = (sec === section) ? 'active' : ''
                return (
                  <li key={index} className="nav-item">
                    <button onClick={() => handleSections(sec)} className={`nav-link ${isActive}`}>
                      <i className="bx bx-user me-1"></i> {sec}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div>

        </div>
        {/*/ Navbar pills */}

        {(section === "profile") && <ProfileComponent user={user} />}
        {(section === "projects") && <ProjectsComponent />}


      </div>
      {/* / Content */}







      <div className="content-backdrop fade"></div>
    </div>
  )
}

export default Profile