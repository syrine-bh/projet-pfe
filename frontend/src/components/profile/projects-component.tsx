import { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import { fetchProjects } from "../../fetchers/project-fetcher";
import { ProjectModel } from "../../models/ProjectModel";
import ProfileAvatar from "../profile-avatar";




function Projects() {

    const auth = useAuthUser();

    const [projects, setProjects] = useState<ProjectModel[]>([])


    const fetchData = async () => {
        const response = await fetchProjects(auth()!.id, auth()!.token)
        setProjects(response)
    }




    useEffect(() => {
        fetchData()
    }, [])


    return (
        <div className="col-xl-8 col-lg-7 col-md-7">
            <div className="content-wrapper">


        




                    <div className="row g-4">
                        {projects.map((item, index) => {
                            return <ProjectItem key={index} {...item}/>
                        })}
                    </div>
                </div>



        </div>


    )
}

function ProjectItem(project: ProjectModel) {
    const startdate = new Date(project.startdate)
    const deadline = new Date(project.deadline)
  
  
    function dateDiffInDays(date1: Date, date2: Date) {
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
      const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
  
    const diffInDays = dateDiffInDays(startdate, deadline)
    // Génère l'icône à partir des deux premières lettres du titre
  
    const renderDateDifference = () => {
      if (diffInDays < 5) {
        return <span className="badge bg-label-danger ms-auto">{diffInDays} Days left</span>
      } else if (diffInDays <= 10) {
        return <span className="badge bg-label-warning ms-auto">{diffInDays} Days left</span>
      } else {
        return <span className="badge bg-label-success ms-auto">{diffInDays} Days left</span>
      }
    }
    return (
      <div className="col-xl-6 col-lg-6 col-md-6">
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-start">
              <div className="d-flex align-items-start">
                <div className="avatar me-3">
                  <ProfileAvatar
                    firstName={project.title}
                    radius={38}
                  />
                </div>
                <div className="me-2">
                  <h5 className="mb-1">{project.title}</h5>
                  <div className="client-info d-flex align-items-center">
                    <h6 className="mb-0 me-1">Client:</h6><span>{project.clients[0].company}</span>
                  </div>
                </div>
              </div>
              <div className="ms-auto">
                <div className="dropdown zindex-2">
                  <button type="button" className="btn dropdown-toggle hide-arrow p-0" data-bs-toggle="dropdown" aria-expanded="false"><i className="bx bx-dots-vertical-rounded"></i></button>
                  <ul className="dropdown-menu dropdown-menu-end" >
                    <li><Link className="dropdown-item" to={`/updateProject/${project.id}`}>update  project</Link></li>
                    <Link to={`/projectDetails/${project.id}`} className="dropdown-item">project details</Link>
                    <li><Link className="dropdown-item" to={`/projects/${project.id}/tickets`}>tickets</Link></li>
  
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item text-danger" href="#">Leave Project</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex flex-wrap mb-3">
              <div className="rounded me-auto">
                {renderDateDifference()}
              </div>
              <div className="text-end">
                <h6 className="mb-1">Start Date: <span className="text-body fw-normal"> {new Date(project.startdate).toLocaleDateString()}</span></h6>
                <h6 className="mb-1">Deadline: <span className="text-body fw-normal">{new Date(project.deadline).toLocaleDateString()}</span></h6>
              </div>
            </div>
            <p className="mb-0">{project.description}</p>
          </div>
          <div className="card-body border-top">
  
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small>Task: {project.nbrTicketDone}/{project.nbrTicketsTotal}</small>
              {(project.nbrTicketsTotal !== 0)
                ? <small>{((project.nbrTicketDone / project.nbrTicketsTotal) * 100).toFixed(2)}% Completed</small>
  
                : <small>0% Completed</small>}
            </div>
            <div className="progress mb-3" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemax={100}
                style={{ width: `${(project.nbrTicketDone / project.nbrTicketsTotal) * 100}%` }}
              ></div>
            </div>
  
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <ul className="list-unstyled d-flex align-items-center avatar-group mb-0 zindex-2">
                  {(project.members.map((member, index) => 
                    (index < 4) &&
                    <li
                      key={index}
                      data-bs-toggle="tooltip"
                      data-popup="tooltip-custom"
                      data-bs-placement="top"
                      className="avatar avatar-sm pull-up me-2"
                      aria-label={member.firstname + " " + member.lastname}
                      data-bs-original-title={member.firstname + " " + member.lastname}>
                      <ProfileAvatar
                        firstName={member.firstname}
                        lastName={member.lastname}
                        radius={33}
                      />                   </li>
                  ))}
                  {(project.members.length > 4) && <li>
                    <small className="text-muted ms-1">+{project.members.length - 4}</small>
                  </li>}
                </ul>
              </div>
              <div className="ms-auto">
                {(project.nbrComments !== 0) && <><i className="bx bx-chat"></i> {project.nbrComments}</>}
              </div>
            </div>
          </div>
        </div>
      </div>
  
  
  
    )
  }


export default Projects




















