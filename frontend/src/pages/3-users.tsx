import { useEffect, useState, ChangeEvent } from "react"
import { useAuthUser } from "react-auth-kit"
import { Navigate, useNavigate, useSearchParams } from "react-router-dom"
import {
    Modal, Button,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap"

import Loader from "../components/Loader"
import RoleCard from "../components/users/role-card"
import UserItem from "../components/users/user-item"
import { INIT_PAGINATED_USERS, INIT_USER } from "../config"
import { fetchPaginatedUsers, updateUser } from "../fetchers/user-fetcher"
import { UserModel } from "../models/UserModel"

import Select from 'react-select';
import { PaginatedUsers } from "../models/PaginatedUsers"
import ReactPaginate from "react-paginate"


import '../stylesheets/pagination.css'


function Users() {
    const ROLES_LIST = [
        { value: 'ROLE_USER', label: 'Membre' },
        { value: 'ROLE_ADMIN', label: 'Administrateur' },
        { value: 'ROLE_GESTIONNAIRE', label: 'Gestionnaire' },
        { value: 'ROLE_CLIENT', label: 'Client' }
    ];

    //state hooks
    const [modal, setModal] = useState(false);
    const toggleUpdateModal = () => setModal(!modal);
    const [selectedIndex, setselectedIndex] = useState<number>(-1)
    const [selectedUser, setselectedUser] = useState<UserModel>(INIT_USER)

    const [paginatedUsers, setPaginatedUsers] = useState<PaginatedUsers>(INIT_PAGINATED_USERS)
    const [perPage, setPerPage] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState("")
    //custom hooks
    const auth = useAuthUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const fetchData = async () => {
        var initPage = 1
        var initPerPage = 10
        var query = ""

        if (searchParams.get("page") && Number(searchParams.get("page")!)) {
            setCurrentPage(Number(searchParams.get("page")!))
            initPage = Number(searchParams.get("page")!)
        }

        if (searchParams.get("perPage") && Number(searchParams.get("perPage")!)) {
            setPerPage(Number(searchParams.get("perPage")!))
            initPerPage = Number(searchParams.get("perPage")!)
        }

        if (searchParams.get("query")) {
            setQuery(searchParams.get("query")!)
            query = searchParams.get("query")!
        }

        const response = await fetchPaginatedUsers(auth()!.token, initPerPage, initPage, query)
        setPaginatedUsers(response)
    }

    const changePage = async (index: number) => {
        setPaginatedUsers({ ...paginatedUsers, docs: [], isLoadingAccounts: true })
        const response = await fetchPaginatedUsers(auth()!.token, perPage, index + 1, query);
        setPaginatedUsers(response)
        setCurrentPage(index + 1)
        navigate(`/users?perPage=${perPage}&page=${index + 1}`);
    }

    const changePerPage = async (value: number) => {
        setPaginatedUsers({ ...paginatedUsers, docs: [], isLoadingAccounts: true })
        const response = await fetchPaginatedUsers(auth()!.token, value, 1, query);
        setPaginatedUsers(response)
        setPerPage(value)
        setCurrentPage(1)
        navigate(`/users?perPage=${value}&page=1`);
    }

    useEffect(() => {
        fetchData()
    }, [])



    const handleUpdateUser = async (e: any) => {
        e.preventDefault()

        const response = await updateUser(selectedUser, auth()!.token)
        if (response.status === "success") {
            //changes in ui immediatly
            setPaginatedUsers((oldValue) => {
                oldValue.docs[selectedIndex] = selectedUser
                return oldValue;
            })
            toggleUpdateModal() //close update modal
        } else {
            alert(response.message)
        }


    }

    const handleUpdateStatus = async (index: number) => {


        const updatedUser = paginatedUsers.docs[index]
        updatedUser.isActive = (updatedUser.isActive === 1) ? 0 : 1
        const res = await updateUser(updatedUser, auth()!.token)
        if (res.status === "success") {
            window.location.reload()
        }
    }

    const handleSearch = async (e: any) => {
        e.preventDefault()
        let searchQuery = (document.getElementById('searchInput') as HTMLInputElement).value
        if(searchQuery){
            setPaginatedUsers({ ...paginatedUsers, docs: [], isLoadingAccounts: true })
            const response = await fetchPaginatedUsers(auth()!.token, 10, 1, searchQuery);
            setPaginatedUsers(response)
            setQuery(searchQuery)
            setCurrentPage(1)
            navigate(`/users?perPage=${10}&page=1&query=${searchQuery}`);
        }

    }
    if (!auth()!.roles.includes("ROLE_ADMIN")) {//is not admin
        return <Navigate to={'/dashboard'} replace />
    }

    //pagination
    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">

                <div style={{ marginBottom: "20px" }} className="row">
                    <div className="col">

                    
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="row h-100">
                                <div className="col-sm-5">
                                    <div className="d-flex align-items-end h-100 justify-content-center mt-sm-0 mt-3">
                                        <img src="./assets/img/illustrations/sitting-girl-with-laptop-light.png"
                                            className="img-fluid" alt="Image" width="120"
                                            data-app-light-img="illustrations/sitting-girl-with-laptop-light.png"
                                            data-app-dark-img="illustrations/sitting-girl-with-laptop-dark.png" />
                                    </div>
                                </div>
                                <div className="col-sm-7">
                                    <div className="card-body text-sm-end text-center ps-sm-0">
                                        <p className="mb-0">administrator can have access to what user needs.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                <div className="row g-4">

                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <RoleCard
                            users={paginatedUsers.docs.filter((item) => item.roles.includes("ROLE_ADMIN"))}
                            title={"Administrator"}
                        />
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <RoleCard
                            users={paginatedUsers.docs.filter((item) => item.roles.includes("ROLE_GESTIONNAIRE"))}
                            title={"Manager "}
                        />
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <RoleCard
                            users={paginatedUsers.docs.filter((item) => item.roles.includes("ROLE_MEMBRE"))}
                            title={"Member"}
                        />
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-6">
                        <RoleCard
                            users={paginatedUsers.docs.filter((item) => item.roles.includes("ROLE_CLIENT"))}
                            title={"Customer"}
                        />
                    </div>



                    <div className="col-12">
                        <div className="card">
                            <div className="card-header border-bottom">

                                <div className="row mx-2"><div className="col-md-2"><div className="me-3">
                                    <div className="dataTables_length" id="DataTables_Table_0_length">
                                        <label>
                                            <select onChange={(event) => changePerPage(Number(event.target.value))} value={perPage} name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select">
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                </div>
                                    <div className="col-md-10">
                                        <div className="dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-3 mb-md-0">
                                            <div id="DataTables_Table_0_filter" className="dataTables_filter">
                                                <label>
                                                    <form onSubmit={handleSearch}>
                                                        <input id="searchInput" type="search" className="form-control" placeholder="Search.." aria-controls="DataTables_Table_0" />
                                                    </form>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 className="card-header">Users  </h5>
                            <div className="table-responsive text-nowrap">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Equipe</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-border-bottom-0">
                                        {paginatedUsers.docs.map((item, index) => {
                                            return <UserItem key={index}
                                                user={item}
                                                index={paginatedUsers.pagination.offset + index}
                                                onclickUpdate={() => {
                                                    setselectedIndex(index)
                                                    setselectedUser(item)
                                                    toggleUpdateModal()
                                                }}
                                                onClickStatus={() => handleUpdateStatus(index)}
                                            />
                                        })}

                                    </tbody>


                                </table>
                                {paginatedUsers.docs.length === 0 && <Loader />}
                            </div>
                        </div>

                        <div className={"pagination-component"}>
                            <ReactPaginate
                                previousLabel={<div className="pagination-controls"><i className='bx bx-chevron-left'></i></div>}
                                nextLabel={<div className="pagination-controls"><i className='bx bx-chevron-right'></i></div>}
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
                                pageCount={paginatedUsers.pagination.total_pages}
                                forcePage={currentPage - 1}
                            />
                        </div>

                    </div>
                </div>




            </div>


            {(selectedIndex != -1) && <Modal size="lg" isOpen={modal} toggle={toggleUpdateModal} >
                <form onSubmit={handleUpdateUser} id="formAccountSettings" className="fv-plugins-bootstrap5 fv-plugins-framework">
                    <ModalHeader toggle={toggleUpdateModal}>User Informations</ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="mb-3 col-md-6 fv-plugins-icon-container">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input onChange={(e: ChangeEvent<HTMLInputElement>) => setselectedUser({ ...selectedUser, firstname: e.target.value })} defaultValue={selectedUser.firstname} className="form-control" type="text" id="firstName" name="firstName" autoFocus />
                                <div className="fv-plugins-message-container invalid-feedback"></div></div>
                            <div className="mb-3 col-md-6 fv-plugins-icon-container">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input onChange={(e: ChangeEvent<HTMLInputElement>) => setselectedUser({ ...selectedUser, lastname: e.target.value })} defaultValue={selectedUser.lastname} className="form-control" type="text" name="lastName" id="lastName" />
                                <div className="fv-plugins-message-container invalid-feedback"></div></div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="email" className="form-label">E-mail</label>
                                <input onChange={(e: ChangeEvent<HTMLInputElement>) => setselectedUser({ ...selectedUser, email: e.target.value })} defaultValue={selectedUser.email} className="form-control" type="text" id="email" name="email" placeholder="cyrine.benhassine@gmail.com" />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="equipe" className="form-label">Equipe</label>
                                <input type="text" className="form-control" id="equipe" name="equipe" />
                            </div>
                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                                <div className="input-group input-group-merge">
                                    <span className="input-group-text">TN (+216)</span>
                                    <input onChange={(e: ChangeEvent<HTMLInputElement>) => setselectedUser({ ...selectedUser, phoneNumber: e.target.value })} defaultValue={selectedUser.phoneNumber} type="text" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="21 000 111" />
                                </div>
                            </div>
                            <div className="mb-3 col-md-6">
                                <label htmlFor="address" className="form-label">Role</label>
                                <Select
                                    isMulti
                                    defaultValue={selectedUser.roles.map((role) => {
                                        return {
                                            value: role,
                                            label: role.split("_")[1].toLowerCase()
                                        }
                                    })}
                                    onChange={(newValue) => setselectedUser({
                                        ...selectedUser, roles: newValue.map((val) => {
                                            return val.value
                                        })
                                    })}
                                    options={ROLES_LIST} />
                                {/* <select onChange={(e: ChangeEvent<HTMLSelectElement>) => setselectedUser({ ...selectedUser, roles: [e.target.value] })} defaultValue={selectedUser.roles[0]} className="form-control" id="role">
                                    <option value="ROLE_USER">Membre</option>
                                    <option value="ROLE_ADMIN">Administrateur</option>
                                    <option value="ROLE_GESTIONNAIRE">Gestionnaire</option>
                                    <option value="ROLE_CLIENT">Client</option>
                                </select> */}
                            </div>


                        </div>


                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" color="primary">
                            Save
                        </Button>{' '}
                        <Button color="secondary" onClick={toggleUpdateModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </form>
            </Modal >}
        </>

    )

}
export default Users