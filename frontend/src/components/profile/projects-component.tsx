import { useState, useEffect } from "react";
import { useAuthUser } from "react-auth-kit";
import { Link } from "react-router-dom";
import { fetchProjects } from "../../fetchers/project-fetcher";
import { ProjectModel } from "../../models/ProjectModel";
import Projectitem from "../projects/project-item";




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

export default Projects



















function auth() {
    throw new Error('Function not implemented.');
}

