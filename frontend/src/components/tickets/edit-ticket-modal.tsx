import { useEffect, useState } from "react"
import { TicketModel } from "../../models/TicketModel"
import ProfileAvatar from "../profile-avatar"
import { PaginatedUsers } from "../../models/PaginatedUsers"
import { INIT_PAGINATED_USERS, INIT_PROJECT, getRandomInt } from "../../config"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { fetchPaginatedUsers } from "../../fetchers/user-fetcher"
import { useAuthUser } from "react-auth-kit"
import Loader from "../Loader"
import { UserModel } from "../../models/UserModel"
import { assignTicket } from "../../fetchers/ticket-fetcher"
import TicketColumn from "../../models/TicketColumn"
import ReactPaginate from "react-paginate"
import { addComment, fetchComments } from "../../fetchers/comment-fetcher"
import { CommentModel } from "../../models/CommentModel"

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommentItem from "./comment-item"
import CommentLoader from "./comment-loader"
import AttachmentItem from "./attachment-item"


import { fetchPaginatedUsersAddedToProject } from "../../fetchers/project-fetcher"
import { ProjectModel } from "../../models/ProjectModel"

interface EditTicketModalProps {
    isOpen: boolean
    toggle: () => void
    selectedTicket: TicketModel
    updateSelectedTicket: (updatedTicket: TicketModel) => void
    columns: TicketColumn
    updateColumns: (updatedColumns: TicketColumn) => void
}

function EditTicketModal({ isOpen, toggle, selectedTicket, updateSelectedTicket, columns, updateColumns }: EditTicketModalProps) {
    //constants
    const PER_PAGE = 5;

    //state management
    const [membersSection, setMembersSection] = useState(false);
    const toggleMembersSection = () => setMembersSection(!membersSection);
    const [paginatedMembers, setPaginatedMembers] = useState<PaginatedUsers>(INIT_PAGINATED_USERS);
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedComments, setSelectedComments] = useState<CommentModel[]>([])
    const [commentContent, setCommentContent] = useState<string>("")
    const [commentType, setCommentType] = useState<string>('text');

    const [isCommentsLoading, setIsCommentsLoading] = useState(false)
    //custom hooks
    const [searchParams] = useSearchParams()
    const auth = useAuthUser()
    //ticket description
    const plainText = selectedTicket.description.replace(/(<([^>]+)>|&nbsp;)+/gi, '');
    const shortText = plainText.slice(0, 40) + '...';


    useEffect(() => {
        fetchData()



    }, [])
    const { id } = useParams(); //projectId

    const fetchData = async () => {
        var initPage = 1
        if (searchParams.get("page") && Number(searchParams.get("page")!)) {
            setCurrentPage(Number(searchParams.get("page")!))
            initPage = Number(searchParams.get("page")!)
        }
        ///const paginatedResponse = await fetchPaginatedUsers(auth()!.token, PER_PAGE, initPage);
        const paginatedResponse: PaginatedUsers = await fetchPaginatedUsersAddedToProject(id!, auth()!.token, PER_PAGE, initPage)
        setPaginatedMembers(paginatedResponse)
    }

    const changeAssignedTo = async (member: UserModel) => {
        const response = await assignTicket(selectedTicket.id, member.id, auth()!.token)
        if (response.status === "success") {
            updateSelectedTicket({
                ...selectedTicket,
                assignedTo: member
            })


            const updatedColumns = { ...columns };
            const currentColumn = updatedColumns[selectedTicket.status]
            const currentItems = currentColumn.items.slice();
            const index = currentItems.findIndex((item) => item.id === selectedTicket.id);

            if (index >= 0) {
                // Replace the old ticket object with the updated one
                const updatedItems = [...currentItems]
                updatedItems[index] = { ...currentItems[index], assignedTo: member }
                const updatedColumn = { ...currentColumn, items: updatedItems, }
                updatedColumns[currentColumn.name] = updatedColumn;
                updateColumns(updatedColumns)
            }

        }
    }

    const loadComments = async (item: TicketModel) => {
        setIsCommentsLoading(true)
        const response = await fetchComments(item.id, auth()!.token)
        setIsCommentsLoading(false)
        setSelectedComments(response)
    }

    const changePage = async (index: number) => {
        setPaginatedMembers({ ...paginatedMembers, docs: [], isLoadingAccounts: true })
        const response = await fetchPaginatedUsers(auth()!.token, PER_PAGE, index + 1);
        setPaginatedMembers(response)
        setCurrentPage(index + 1)
    }


    /*const handleSubmitComment = async (e: any) => {
        e.preventDefault();
        let newCommentContent = commentContent;

        if (Comment.type === "script") {
            newCommentContent = `$${commentContent}`;
        } else if (Comment.type === "commit") {
            newCommentContent = `commit: ${commentContent}`;
        }
        const newComment = await addComment(selectedTicket.id, commentType, commentContent, auth()!.id, auth()!.token);
        setSelectedComments((oldArray) => [...oldArray, newComment])
        setCommentContent("");
        setCommentType("")
    }*/
    const handleSubmitComment = async (e: any) => {
        e.preventDefault();
        // let newCommentContent = commentContent;


        // if (commentType === "script") {

        //     const scriptComment = document.createElement("div");
        //     scriptComment.className = "comment script-comment";
        //     scriptComment.style.background = "#263238";
        //     scriptComment.style.color = "#eeffff";
        //     scriptComment.style.outline = "#50646D";
        //     scriptComment.innerHTML = `<p>script SQL :$ ${commentContent}</p>`;
        //     newCommentContent = scriptComment.outerHTML;

        // }

        // else if (commentType === "commit") {
        //     newCommentContent = `commit id : ${commentContent}`;
        // }

        const newComment = await addComment(
            selectedTicket.id,
            commentType,
            commentContent,
            auth()!.id,
            auth()!.token
        );

        setSelectedComments((oldArray) => [...oldArray, newComment]);
        setCommentContent("");
        setCommentType("text");
    }





    return (
        <>
            <div style={{ width: "490px" }} className={(isOpen) ? "offcanvas offcanvas-end show" : "offcanvas offcanvas-end"} tabIndex={-1} id="offcanvasEnd" aria-labelledby="offcanvasEndLabel" aria-modal="true" role="dialog">
                <div className="offcanvas-header">
                    <h5 id="offcanvasEndLabel" className="offcanvas-title">Ticket Details</h5>
                    <button onClick={toggle} type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body pt-4">
                    <ul className="nav nav-pills tabs-line justify-content-center">
                        <li className="nav-item d-inline-block">
                            <button style={{ marginRight: '9px' }} className="nav-link active btn-sm shadow-none" data-bs-toggle="tab" data-bs-target="#tab-update" aria-selected="true" role="tab">
                                <i className="bx bx-info-square me-2"></i>
                                <span className="align-middle text-uppercase">Details</span>
                            </button>
                        </li>
                        <li className="nav-item d-inline-block">
                            <button onClick={async () => await loadComments(selectedTicket)} className="nav-link btn-sm shadow-none" data-bs-toggle="tab" data-bs-target="#tab-comments" aria-selected="false" tabIndex={-1} role="tab">
                                <i className="bx bx-comment-detail me-2"></i>
                                <span className="align-middle text-uppercase">Comments</span>
                            </button>
                        </li>
                        <li className="nav-item d-inline-block">
                            <button style={{ marginLeft: '-6px' }} className="nav-link btn-sm shadow-none" data-bs-toggle="tab" data-bs-target="#tab-activity" aria-selected="false" tabIndex={-1} role="tab">
                                <i className="bx bx-bar-chart me-2"></i>
                                <span className="align-middle text-uppercase">Activity</span>
                            </button>
                        </li>
                    </ul>



                    <div className="tab-content px-0 pb-0 border-0">
                        {/* Update item/tasks */}
                        <div className="tab-pane fade show active" id="tab-update" role="tabpanel">

                            <div className="mb-3">
                                TITLE :   <h6 className="badge bg-label-info ms-auto" > {selectedTicket.title}</h6>

                            </div>
                            <div className="d-flex align-items-center mb-3" >
                                <h6>STATE :   {selectedTicket.status} </h6>
                                <div className="d-flex align-items-center mb-3">
                                    {selectedTicket.priority === "low" && (
                                        <span style={{ marginRight: '-80px' }} className="badge bg-label-success ms-auto">{selectedTicket.priority}</span>
                                    )}
                                    {selectedTicket.priority === "medium" && (
                                        <span style={{ marginRight: '-80px' }} className="badge bg-label-warning ms-auto">{selectedTicket.priority}</span>
                                    )}
                                    {selectedTicket.priority === "high" && (
                                        <span style={{ marginRight: '-80px' }} className="badge bg-label-danger ms-auto">{selectedTicket.priority}</span>
                                    )}
                                </div>
                            </div>
                            <p className="mb-1">DESCRIPTION : <br></br> {plainText}</p>
                            <br></br>

                            <div className='mb-3'>
                                <label className="form-label">Attachments</label>

                                <Swiper
                                    slidesPerView={3}
                                    spaceBetween={3}
                                    pagination={true}
                                    modules={[Pagination]}
                                    className="mySwiper">
                                    {selectedTicket.attachments?.map((attachment, index) => <SwiperSlide key={index}>
                                        <AttachmentItem attachment={attachment} />
                                    </SwiperSlide>)}
                                </Swiper>
                            </div>



                            <div className="mb-3">
                                <label className="form-label">Assigned</label>
                                <div className="assigned d-flex flex-wrap avatar-group">
                                    {(selectedTicket.assignedTo) && <div className="avatar avatar-sm me-0" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Bruce" data-bs-original-title="Bruce">
                                        <ProfileAvatar
                                            firstName={selectedTicket.assignedTo.firstname}
                                            lastName={selectedTicket.assignedTo.lastname}
                                            radius={28}
                                        />
                                    </div>}

                                    <div className="avatar avatar-sm">

                                        <button type='button' onClick={toggleMembersSection} className="avatar-initial rounded-circle bg-label-secondary">
                                            {(membersSection === false)
                                                ? <i className='bx bx-plus'></i>
                                                : <i className='bx bx-x'></i>
                                            }
                                        </button>
                                    </div></div>
                            </div>

                            {(membersSection) && <div className='mb-3'>
                                <div className="table-responsive text-nowrap">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>User informations</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-border-bottom-0">
                                            {paginatedMembers.docs.map((member) => {
                                                return (
                                                    <tr key={member.id} className="odd">
                                                        <td>{member.id}</td>
                                                        <td className="sorting_1">
                                                            <div className="d-flex justify-content-left align-items-center">
                                                                <div className="avatar-wrapper">
                                                                    <div className="avatar avatar-sm me-3">
                                                                        <ProfileAvatar
                                                                            firstName={member.firstname}
                                                                            lastName={member.lastname}
                                                                            radius={32}
                                                                        />
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

                                                        <td>
                                                            {(selectedTicket.assignedTo?.id !== member.id) &&
                                                                <button onClick={() => changeAssignedTo(member)} className='btn btn-outline-primary'>
                                                                    <i className='bx bx-revision'></i>
                                                                </button>}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                    </table>
                                    {paginatedMembers.isLoadingAccounts === true && <Loader />}
                                    {(paginatedMembers.docs.length === 0 && paginatedMembers.isLoadingAccounts === false)
                                        ? <div className="nodata">
                                            <img src={'./assets/img/empty-box.png'} />
                                            <div>no members</div>
                                        </div>
                                        : <div></div>}
                                </div>

                                <div style={{ position: "relative" }} className="pagination-component">
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
                                        pageCount={paginatedMembers.pagination.total_pages}
                                        forcePage={currentPage - 1}
                                    />
                                </div>
                            </div>}







                        </div>

                        {/* Comments */}
                        <div className="tab-pane fade" id="tab-comments" role="tabpanel">




                            {isCommentsLoading ? (
                                Array(getRandomInt(5, 10))
                                    .fill(null)
                                    .map((item, index) => <CommentLoader key={index} />)
                            ) : (
                                <div style={{ height: '491px', overflow: 'auto' }}>
                                    {selectedComments.map((item: CommentModel, index: number) => {
                                        return <CommentItem key={index} comment={item} ticket={selectedTicket} />;
                                    })}
                                </div>





                            )}


                            {/* {selectedComments.map((item: CommentModel, index: number) => {
                                return <CommentItem key={index} comment={item} />;
                            })} */}

                            <div style={{ background: 'white', width: '100%', position: 'absolute', bottom: 0, paddingRight: ' 48px', paddingBottom: '20px' }}>
                                <form onSubmit={handleSubmitComment}>
                                    <div className="mb-3">
                                        <label className="form-label">Add comment</label>

                                        <div style={{ display: 'flex', justifyContent: "flex-end", marginBottom: '5px' }}>
                                            <select
                                                style={{ width: "30%" }}
                                                className="form-select"
                                                value={commentType}
                                                onChange={(event) => setCommentType(event.target.value)} >
                                                <option value="text">Text</option>
                                                <option value="script">Script</option>
                                                <option value="commit">Commit</option>
                                            </select>
                                        </div>


                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={commentContent}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setCommentContent(data);
                                            }}
                                        />


                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex flex-wrap">
                                            <button type="submit" className="btn btn-primary me-3">
                                                Save
                                            </button>
                                            <button type="button" className="btn btn-label-secondary">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                            {/* <div>
                                
                            </div> */}
                        </div>
                        {/* Activities */}
                        <div className="tab-pane fade" id="tab-activity" role="tabpanel">
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <span className="avatar-initial bg-label-success rounded-circle">HJ</span>
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Jordan</span> Left the board.
                                    </p>
                                    <small className="text-muted">Today 11:00 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <img src="./assets/img/avatars/1.png" alt="Avatar" className="rounded-circle" />
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Dianna</span> mentioned
                                        <span className="fw-semibold text-primary">@bruce</span> in
                                        a comment.
                                    </p>
                                    <small className="text-muted">Today 10:20 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <img src="./assets/img/avatars/2.png" alt="Avatar" className="rounded-circle" />
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Martian</span> added moved
                                        Charts &amp; Maps task to the done board.
                                    </p>
                                    <small className="text-muted">Today 10:00 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <img src="./assets/img/avatars/1.png" alt="Avatar" className="rounded-circle" />
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Barry</span> Commented on App
                                        review task.
                                    </p>
                                    <small className="text-muted">Today 8:32 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <span className="avatar-initial bg-label-dark rounded-circle">BW</span>
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Bruce</span> was assigned
                                        task of code review.
                                    </p>
                                    <small className="text-muted">Today 8:30 PM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <span className="avatar-initial bg-label-danger rounded-circle">CK</span>
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Clark</span> assigned task UX
                                        Research to
                                        <span className="fw-semibold text-primary">@martian</span>
                                    </p>
                                    <small className="text-muted">Today 8:00 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <img src="./assets/img/avatars/4.png" alt="Avatar" className="rounded-circle" />
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Ray</span> Added moved
                                        <span className="fw-semibold">Forms &amp; Tables</span> task
                                        from in progress to done.
                                    </p>
                                    <small className="text-muted">Today 7:45 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <img src="./assets/img/avatars/1.png" alt="Avatar" className="rounded-circle" />
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Barry</span> Complete all the
                                        tasks assigned to him.
                                    </p>
                                    <small className="text-muted">Today 7:17 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <span className="avatar-initial bg-label-success rounded-circle">HJ</span>
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Jordan</span> added task to
                                        update new images.
                                    </p>
                                    <small className="text-muted">Today 7:00 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <img src="./assets/img/avatars/3.png" alt="Avatar" className="rounded-circle" />
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Dianna</span> moved task
                                        <span className="fw-semibold">FAQ UX</span> from in
                                        progress to done board.
                                    </p>
                                    <small className="text-muted">Today 7:00 AM</small>
                                </div>
                            </div>
                            <div className="media mb-4 d-flex align-items-start">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <span className="avatar-initial bg-label-danger rounded-circle">CK</span>
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Clark</span> added new board
                                        with name <span className="fw-semibold">Done</span>.
                                    </p>
                                    <small className="text-muted">Yesterday 3:00 PM</small>
                                </div>
                            </div>
                            <div className="media d-flex align-items-center">
                                <div className="avatar avatar-sm me-2 flex-shrink-0 mt-1">
                                    <span className="avatar-initial bg-label-dark rounded-circle">BW</span>
                                </div>
                                <div className="media-body">
                                    <p className="mb-0">
                                        <span className="fw-semibold">Bruce</span> added new task
                                        in progress board.
                                    </p>
                                    <small className="text-muted">Yesterday 12:00 PM</small>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
            {(isOpen) && <div onClick={toggle} className={"offcanvas-backdrop fade show"}></div>}
        </>
    )
}

export default EditTicketModal