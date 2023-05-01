import React, { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit';
import { ProjectModel } from '../../models/ProjectModel';
import { fetchProjects } from '../../fetchers/project-fetcher';
import Projectitem from '../projects/project-item';
import { Link } from 'react-router-dom';

function ProjectsComponent() {
  const auth = useAuthUser();

  const [projects, setProjects] = useState<ProjectModel[]>([])


  const fetchDatau = async () => {
      const response = await fetchProjects(auth()!.id,auth()!.token)
      setProjects(response)
  }


  useEffect(() => {
    fetchData()
  }, [])
  
  function fetchData() {
    
  }
  return (
    <>
            <div className="content-wrapper">
                <div className="container-xxl flex-grow-1 container-p-y">


                    <h4 style={{ display: "flex", justifyContent: "space-between" }} className="fw-bold py-3 mb-4">
                        <span className="text-muted fw-light"> All the Projets </span>
                    </h4>




                    <div className="row g-4">
                        {projects.map((item, index) => {
                            return <Projectitem key={index}
                                project={item}
                            />
                        })}
                    </div>
                </div>
            </div>



        </>
  )
}

export default ProjectsComponent