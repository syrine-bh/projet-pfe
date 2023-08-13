import { useEffect, useState } from 'react'
import Projectitem from '../components/projects/project-item'
import { apiClient } from '../config';
import { useAuthUser } from "react-auth-kit"
import { ProjectModel } from '../models/ProjectModel';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../fetchers/project-fetcher';
import ProfileAvatar from '../components/profile-avatar';



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
        <>
            <div className="content-wrapper">
                <div className="container-xxl flex-grow-1 container-p-y">


                    <h4 style={{ display: "flex", justifyContent: "space-between" }} className="fw-bold py-3 mb-4">
                        <span className="text-muted fw-light"> Projects </span>





                        {auth && (auth()!.roles.includes('ROLE_GESTIONNAIRE') || auth()!.roles.includes('ROLE_ADMIN')) && (
                            <Link to={"/addProject"} className="btn btn-sm btn-iconbtn btn-primary text-nowrap">Add project</Link>
                        )}


                    </h4>




                    <div className="row g-4">
                        {projects.map((item, index) => {
                            return <Projectitem key={index}
                                project={item}
                                deleteProject={(project)=> setProjects(projects.filter((item)=>item.id!==project.id))}
                            />
                        })}
                    </div>
                </div>
            </div>



        </>


    )
}

export default Projects



















function auth() {
    throw new Error('Function not implemented.');
}

