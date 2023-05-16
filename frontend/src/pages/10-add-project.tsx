import { useState, useEffect } from 'react'
import { Modal, Button, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { UserModel } from '../models/UserModel';

import '../stylesheets/add-project.css'
import { fetchPaginatedClients, fetchPaginatedMembersGestionnaires, fetchUsers } from '../fetchers/user-fetcher';
import { useAuthUser } from 'react-auth-kit';
import ClientFormItem from '../components/projects/client-form-item';
import ClientModalItem from '../components/projects/client-modal-item';
import { addProject } from '../fetchers/project-fetcher';
import { INIT_PAGINATED_USERS, INIT_USER } from '../config';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PaginatedUsers } from '../models/PaginatedUsers';
import ReactPaginate from "react-paginate"

function AddProject() {
    const [clientsModal, setclientsModal] = useState(false);
    const [membersModal, setMembersModal] = useState(false);
    const toggleClientsModal = () => setclientsModal(!clientsModal);
    const toggleMembersModal = () => setMembersModal(!membersModal);

    const [clients, setClients] = useState<UserModel[]>([])
    const [selectedClients, setSelectedClients] = useState<UserModel[]>([])
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [gitRepo, setgitRepo] = useState<string>("");
    const [startdate, setStartdate] = useState<string>("");
    const [deadline, setDeadline] = useState<string>("");
    const [members, setMembers] = useState<UserModel[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<UserModel[]>([]);

    const [errorMessage, setErrorMessage] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [paginatedUsers, setPaginatedUsers] = useState<PaginatedUsers>(INIT_PAGINATED_USERS)
    const [paginatedClients, setPaginatedClients] = useState<PaginatedUsers>(INIT_PAGINATED_USERS)
    const [PaginatedMembersGestionnaires, setPaginatedMembersGestionnaires] = useState<PaginatedUsers>(INIT_PAGINATED_USERS)


    const [perPage, setPerPage] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState(1)

    const auth = useAuthUser();
    const [searchParams] = useSearchParams();


    useEffect(() => {
        fetchClients()
        fetchMembers()
    }, [])


    /*const fetchClients = async () => {
        const response = await AllPaginatedClients(auth()!.token)
        setClients(response)
    }*/
    ///

    const fetchClients = async () => {
        var initPage = 1
        var initPerPage = 10

        if (searchParams.get("page") && Number(searchParams.get("page")!)) {
            setCurrentPage(Number(searchParams.get("page")!))
            initPage = Number(searchParams.get("page")!)
        }

        if (searchParams.get("perPage") && Number(searchParams.get("perPage")!)) {
            setPerPage(Number(searchParams.get("perPage")!))
            initPerPage = Number(searchParams.get("perPage")!)
        }

        const response = await fetchPaginatedClients(auth()!.token, initPerPage, initPage)
        setPaginatedClients(response)
    }



    const changePage = async (value: number) => {
        setPaginatedUsers({ ...paginatedUsers, docs: [], isLoadingAccounts: true })
        const response = await fetchPaginatedClients(auth()!.token, value, 1);
        setPaginatedClients(response)
        setPerPage(value)
        setCurrentPage(1)
        navigate(`/users?perPage=${value}&page=1`);
    }

    //

    /*const fetchMembers = async () => {
        const response = await fetchUsers(auth()!.token)
        setMembers(response)
    }*/
    const fetchMembers = async () => {
        var initPage = 1
        var initPerPage = 10

        if (searchParams.get("page") && Number(searchParams.get("page")!)) {
            setCurrentPage(Number(searchParams.get("page")!))
            initPage = Number(searchParams.get("page")!)
        }

        if (searchParams.get("perPage") && Number(searchParams.get("perPage")!)) {
            setPerPage(Number(searchParams.get("perPage")!))
            initPerPage = Number(searchParams.get("perPage")!)
        }

        const response = await fetchPaginatedMembersGestionnaires(auth()!.token, initPerPage, initPage)
        setPaginatedMembersGestionnaires(response)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!title) { //if title is not ok
            console.log("please provide title")
            setErrorMessage("Please provide title")
            return;
        }

        if (!startdate) {
            console.log("please provide startdate")
            setErrorMessage("Please provide startdate")
            return;
        }


        if (!deadline) {
            console.log("please provide deadLine")
            setErrorMessage("Please provide deadLine")
            return;
        }

        if (!description) {
            console.log("please provide description")
            setErrorMessage("Please provide description")
            return;
        }

        if (selectedClients.length === 0) {
            console.log("Please provide at least one client");
            setErrorMessage("Please provide at least one client");
            return;
        }
        if (selectedMembers.length === 0) {
            console.log("Please provide at least one member");
            setErrorMessage("Please provide at least one member");
            return;
        }

        setLoading(true)
        const res = await addProject(title, description,gitRepo, startdate, deadline, auth()!.id, selectedClients, selectedMembers);
        setLoading(false)

        if (res.status === 'error') {
            console.log(res.message);
            setErrorMessage(res.message)
            return;
        }



        navigate(`/projects`)

    }


    return (
        <>
            <div className="content-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="container-xxl flex-grow-1 container-p-y">
                        {/* Project details */}
                        <div className="row">

                            <div className="col-12">
                                <div className="card">
                                    <h5 className="card-header">Add a new project</h5>
                                    <div className="card-body">



                                        <div className="col-12">
                                            <h6 className="fw-semibold">1. Project Details</h6>
                                            <hr className="mt-0" />
                                        </div>

                                        <div className='row'>
                                            <div className="col-4 fv-plugins-icon-container">
                                                <label className="form-label" htmlFor="formValidationName">title</label>
                                                <input type="text" id="title" className="form-control" placeholder="" name="title"
                                                    value={title}
                                                    onChange={(e: any) => setTitle(e.target.value)}
                                                    autoFocus={true} />
                                                <div className="fv-plugins-message-container invalid-feedback"></div>
                                            </div>
                                            <div className="col-4 fv-plugins-icon-container">
                                                <label className="form-label" htmlFor="formValidationEmail">Start date</label>
                                                <input className="form-control" type="date" id="formValidationEmail" name="formValidationEmail" placeholder=""
                                                    value={startdate}
                                                    onChange={(e: any) => setStartdate(e.target.value)}
                                                    autoFocus={true} />
                                                <div className="fv-plugins-message-container invalid-feedback"></div>
                                            </div>
                                            <div className="col-4 fv-plugins-icon-container">
                                                <label className="form-label" htmlFor="formValidationEmail">Deadline</label>
                                                <input className="form-control" type="date" id="deadLine" name="deadLine" placeholder=""
                                                    value={deadline}
                                                    onChange={(e: any) => setDeadline(e.target.value)}
                                                    autoFocus={true} />
                                                <div className="fv-plugins-message-container invalid-feedback"></div>
                                            </div>
                                        </div>






                                        {/* Personal Info */}


                                        <div style={{ marginTop: "15px" }} className="col-md-12 fv-plugins-icon-container">
                                            <label htmlFor="formValidationFile" className="form-label">Description</label>
                                            <textarea className="form-control" id="formValidationBio" name="formValidationBio" rows={3}
                                                value={description}
                                                onChange={(e: any) => setDescription(e.target.value)}
                                                autoFocus={true}></textarea>
                                            <div className="fv-plugins-message-container invalid-feedback"></div>
                                        </div>

                                        <div className="col-12 fv-plugins-icon-container">
                                                <label className="form-label" htmlFor="formValidationName">git link</label>
                                                <input type="text" id="title" className="form-control" placeholder="" name="title"
                                                    value={gitRepo}
                                                    onChange={(e: any) => setgitRepo(e.target.value)}
                                                    autoFocus={true} />
                                                <div className="fv-plugins-message-container invalid-feedback"></div>
                                            </div>





                                    </div>
                                </div>
                                {/* /FormValidation */}
                            </div>
                        </div>

                        {/* Clients section */}
                        <div style={{ marginTop: "15px" }} className="row">
                            {/* FormValidation */}
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">

                                        <div className="col-12">
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <h6 className="fw-semibold">2. Clients</h6>
                                                <button type='button' onClick={toggleClientsModal} className='btn btn-primary'>
                                                    <i className='bx bx-plus'></i>
                                                </button>
                                            </div>
                                            <hr className="mt-0" />
                                        </div>

                                        <div className="table-responsive text-nowrap">
                                            <br></br>
                                            <div className="row mx-2"><div className="col-md-2"><div className="me-3">
                                                <div className="dataTables_length" id="DataTables_Table_0_length"><label>
                                                    <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></label></div></div></div>
                                                <div className="col-md-10"><div className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0">
                                                    <div id="DataTables_Table_0_filter" className="dataTables_filter">
                                                        <label><input type="search" className="form-control" placeholder="Search.." aria-controls="DataTables_Table_0" /></label></div><div className="dt-buttons btn-group flex-wrap"> <div className="btn-group">

                                                        </div>

                                                    </div></div></div></div>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>User informations</th>
                                                        <th>Company</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-border-bottom-0">
                                                    {selectedClients.map((client) => {
                                                        return <ClientFormItem
                                                            key={client.id}
                                                            client={client}
                                                            onDelete={() => {
                                                                setSelectedClients(selectedClients.filter(item => item.id != client.id))
                                                            }} />
                                                    })}
                                                </tbody>
                                            </table>
                                            {selectedClients.length === 0
                                                ? <div className="nodata">
                                                    <img src={'./assets/img/empty-box.png'} />
                                                    <div>no clients</div>
                                                </div>
                                                : <div></div>}
                                        </div>





                                    </div>
                                </div>
                                {/* /FormValidation */}
                            </div>
                        </div>

                        {/* Members section */}
                        <div style={{ marginTop: "15px" }} className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">

                                        <div className="col-12">
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <h6 className="fw-semibold">3. Members</h6>
                                                <button type='button' onClick={toggleMembersModal} className='btn btn-primary'>
                                                    <i className='bx bx-plus'></i>
                                                </button>
                                            </div>
                                            <hr className="mt-0" />
                                        </div>

                                        <div className="table-responsive text-nowrap">
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
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="table-border-bottom-0">
                                                    {selectedMembers.map((member) => {
                                                        return <ClientFormItem
                                                            key={member.id}
                                                            client={member}
                                                            onDelete={
                                                                () => setSelectedMembers(selectedMembers.filter(item => item.id != member.id))
                                                            } />
                                                    })}
                                                </tbody>
                                            </table>
                                            {selectedMembers.length === 0
                                                ? <div className="nodata">
                                                    <img src={'./assets/img/empty-box.png'} />
                                                    <div>no members</div>
                                                </div>
                                                : <div></div>}
                                        </div>





                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: "15px" }} className="row">
                            <div style={{ textAlign: 'right' }} className="col-12">
                                <button disabled={loading} className="btn btn-primary" type="submit">
                                    {(loading) && <span className="spinner-grow me-1" role="status" aria-hidden="true"></span>}
                                    save
                                </button>
                            </div>

                        </div>
                    </div>


                </form>

            </div>



            {/* Client modal */}
            <Modal size="lg" isOpen={clientsModal} toggle={toggleClientsModal}>
                <ModalHeader toggle={toggleClientsModal}>Clients</ModalHeader>
                <ModalBody>
                    <div className="table-responsive text-nowrap">
                        {paginatedClients.docs.length === 0 ? (
                            <div className="nodata">
                                <img src={"./assets/img/empty-box.png"} />
                                <div>no clients</div>
                            </div>
                        ) : (
                            <>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>User informations</th>
                                            <th>Company</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-border-bottom-0">
                                        {paginatedClients.docs.map((client) => {
                                            return (
                                                <ClientModalItem
                                                    key={client.id}
                                                    client={client}
                                                    isSelected={selectedClients.includes(client)}
                                                    onDeleteUser={() => {
                                                        setSelectedClients((oldArray) =>
                                                            oldArray.filter((item) => item.id !== client.id)
                                                        );
                                                    }}
                                                    onSelectUser={() => {
                                                        setSelectedClients((oldArray) => [...oldArray, client]);
                                                    }}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div style={{ position: "relative" }} className="pagination-component">
                                    <ReactPaginate
                                        previousLabel={
                                            <div className="pagination-controls">
                                                <i className="bx bx-chevron-left"></i>
                                            </div>
                                        }
                                        nextLabel={
                                            <div className="pagination-controls">
                                                <i className="bx bx-chevron-right"></i>
                                            </div>
                                        }
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        onPageChange={(event) => changePage(event.selected)}
                                        pageRangeDisplayed={3}
                                        marginPagesDisplayed={2}
                                        pageCount={paginatedClients.pagination.total_pages}
                                        forcePage={currentPage - 1}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </ModalBody>


                <ModalFooter>
                    <Button onClick={toggleClientsModal} color="primary">
                        Close
                    </Button>

                </ModalFooter>
            </Modal>

            {/* member modal */}
            <Modal size="lg" isOpen={membersModal} toggle={toggleMembersModal}>
                <ModalHeader toggle={toggleMembersModal}>Members</ModalHeader>
                <ModalBody>
                <div className="table-responsive text-nowrap">
                        {paginatedClients.docs.length === 0 ? (
                            <div className="nodata">
                                <img src={"./assets/img/empty-box.png"} />
                                <div>no clients</div>
                            </div>
                        ) : (
                            <>                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User informations</th>
                                    <th>Company</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                {PaginatedMembersGestionnaires.docs.map((member) => {
                                    return <ClientModalItem
                                        key={member.id}
                                        client={member}
                                        isSelected={selectedMembers.includes(member)}
                                        onDeleteUser={() => {
                                            setSelectedMembers(oldArray => oldArray.filter(item => item.id != member.id));
                                        }}
                                        onSelectUser={() => {
                                            setSelectedMembers(oldArray => [...oldArray, member]);
                                        }} />
                                })}
                            </tbody>
                        </table>
                        <div style={{ position: "relative" }} className="pagination-component">
                                    <ReactPaginate
                                        previousLabel={
                                            <div className="pagination-controls">
                                                <i className="bx bx-chevron-left"></i>
                                            </div>
                                        }
                                        nextLabel={
                                            <div className="pagination-controls">
                                                <i className="bx bx-chevron-right"></i>
                                            </div>
                                        }
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        onPageChange={(event) => changePage(event.selected)}
                                        pageRangeDisplayed={3}
                                        marginPagesDisplayed={2}
                                        pageCount={paginatedClients.pagination.total_pages}
                                        forcePage={currentPage - 1}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggleMembersModal} color="primary">
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </>

    )
}

export default AddProject


