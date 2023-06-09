import { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import { INIT_PROJECT } from "../config";
import { fetchProjectById } from "../fetchers/project-fetcher";
import { ProjectModel } from "../models/ProjectModel";

import { Link, useParams } from "react-router-dom";

function ProjectDetails() {
  const { projectId } = useParams()

  const [project, setProject] = useState<ProjectModel>({
    ...INIT_PROJECT,
    id: Number(projectId) ? Number(projectId) : 0
  });
  const auth = useAuthUser();


  useEffect(() => {
    fetchData()
  }, [])


  const fetchData = async () => {
    const fetchProject = await fetchProjectById(project.id, auth()!.token);
    setProject(fetchProject);
  }
  return (
    <div className="content-wrapper">

      {/* Content */}

      <div className="container-xxl flex-grow-1 container-p-y">


        <h4 className="fw-bold py-3 mb-4">
          <span className="text-muted fw-light">project / details / {project.title} </span>
        </h4>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-1">
                <div className="mb-4">
                  <h4 className="fw-semibold mb-2">{project.title}</h4>
                </div>
                <div>
                  <h6 className="fw-semibold mb-2">git link</h6>
                  <p className="fw-semibold mb-2"><a href={project.gitRepo}>{project.gitRepo}</a></p>
                </div>
                <div className="mb-4">
                  <h6 className="fw-semibold mb-2">created by </h6>
                  <p>{project.gestionnaire?.email}</p>
                </div>

                <div className="mb-4">
                  <h6 className="fw-semibold mb-2">start date</h6>
                  <p>{new Date(project.startdate).toLocaleDateString()}</p>
                </div>
                <div className="mb-4">
                  <h6 className="fw-semibold mb-2">deadline</h6>
                  <p>{new Date(project.deadline).toLocaleDateString()}</p>
                </div>

              </div>
              <div className="col-md-6 mb-1">
                <div className="alert alert-warning mb-4" role="alert">
                  <h6 className="alert-heading fw-bold mb-1">Description</h6>
                  <span>{project.description}</span>
                </div>

                <div className="plan-statistics">
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold mb-2">Days</span>
                    <span className="fw-semibold mb-2">24 of 30 Days</span>
                  </div>
                  <div className="progress mb-3" style={{ height: "8px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuemax={100}
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <p className="mt-1 mb-0">6 days remaining until your plan requires update</p>
                </div>
              </div>

            </div>
          </div>

        </div>
        <h6><span className="text-muted fw-light">Clients table </span></h6>
        <div className="card mb-4">
          <br></br>
          <div className="row mx-2"><div className="col-md-2"><div className="me-3">
            <div className="dataTables_length" id="DataTables_Table_0_length"><label>
              <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></label></div></div></div>
            <div className="col-md-10"><div className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"><div id="DataTables_Table_0_filter" className="dataTables_filter"><label><input type="search" className="form-control" placeholder="Search.." aria-controls="DataTables_Table_0" /></label></div><div className="dt-buttons btn-group flex-wrap"> <div className="btn-group">

            </div>

            </div></div></div></div>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>User informations</th>
                <th>Company</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {project.clients.map((client) => {
                return <tr key={client.id} className="odd">
                  <td>{client.id}</td>
                  <td className="  control" tabIndex={0} style={{ display: "none" }}>
                  </td>
                  <td className="sorting_1">
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="avatar-wrapper">
                        <div className="avatar avatar-sm me-3">
                          <img src="./assets/img/avatars/2.png" alt="Avatar" className="rounded-circle" />
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <a href="app-user-view-account.html" className="text-body text-truncate">
                          <span className="fw-semibold">{client.firstname} {client.lastname}</span>
                        </a>
                        <small className="text-muted">{client.email}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="fw-semibold">{client.company}</span></td>
                  <td></td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
        <br></br>

        <h6><span className="text-muted fw-light">members table </span></h6>
        <div className="card mb-4">
          <br></br>
          <div className="row mx-2"><div className="col-md-2"><div className="me-3">
            <div className="dataTables_length" id="DataTables_Table_0_length"><label>
              <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></label></div></div></div>
            <div className="col-md-10"><div className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0"><div id="DataTables_Table_0_filter" className="dataTables_filter"><label><input type="search" className="form-control" placeholder="Search.." aria-controls="DataTables_Table_0" /></label></div><div className="dt-buttons btn-group flex-wrap"> <div className="btn-group">

            </div>

            </div></div></div></div>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>User informations</th>
                <th>equipe</th>

              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {project.members.map((member) => {
                return <tr key={member.id} className="odd">
                  <td>{member.id}</td>
                  <td className="  control" tabIndex={0} style={{ display: "none" }}>
                  </td>
                  <td className="sorting_1">
                    <div className="d-flex justify-content-left align-items-center">
                      <div className="avatar-wrapper">
                        <div className="avatar avatar-sm me-3">
                          <img src="./assets/img/avatars/2.png" alt="Avatar" className="rounded-circle" />
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <a href="app-user-view-account.html" className="text-body text-truncate">
                          <span className="fw-semibold">{member.firstname} {member.lastname}</span>
                        </a>
                        <small className="text-muted">{member.email}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="fw-semibold">{member.company}</span></td>

                  <td>

                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>




      </div>
    </div>
  );
}

export default ProjectDetails;
