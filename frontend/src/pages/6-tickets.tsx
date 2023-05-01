import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, DropResult, Droppable } from "react-beautiful-dnd";

import '../stylesheets/app-kanban.css';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { fetchTicketById, fetchTickets, saveChanges } from '../fetchers/ticket-fetcher';

import { INIT_TICKET } from '../config';
import { useAuthUser } from 'react-auth-kit';
import { BackendResponse } from '../models/BackendResponse';
import { TicketModel } from '../models/TicketModel';
import TicketColumn from '../models/TicketColumn';






import '../stylesheets/table.css';
import '../stylesheets/pagination.css'
import ProfileAvatar from '../components/profile-avatar';








import EditTicketModal from '../components/tickets/edit-ticket-modal';
import AddTicketModal from '../components/tickets/add-ticket-modal';

import '../stylesheets/tickets.css'
function Tickets() {

    const [selectedTicket, setSelectedTicket] = useState<TicketModel>(INIT_TICKET)



    const { id } = useParams(); //projectId
    const auth = useAuthUser();



    const [addTicketsModal, setAddTicketModal] = useState(false);
    const toggleAddTicketsModal = () => {
        fetchData(); //reload tickets
        setAddTicketModal(!addTicketsModal);
    }

    const [editTicketModal, setEditTicketModal] = useState(false)
    const toggleEditTicketModal = () => setEditTicketModal(!editTicketModal);



    const [updateStatusErrorMessage, setUpdateStatusErrorMessage] = useState<BackendResponse>({ status: "", message: "" })
    const [updateStatusLoading, setUpdateStatusLoading] = useState(false);


//desc
const plainText = selectedTicket.description.replace(/(<([^>]+)>|&nbsp;)+/gi, '');
const shortText = plainText.slice(0, 40) + '...';









    const [columns, setColumns] = useState<TicketColumn>({
        "Requested": {
            name: "Requested",
            displayName: "Requested",
            items: []
        },
        "Todo": {
            name: "Todo",
            displayName: "To do",
            items: []
        },
        "InProgress": {
            name: "InProgress",
            displayName: "In Progress",
            items: []
        },
        "Done": {
            name: "Done",
            displayName: "Done",
            items: []
        }
    });




    useEffect(() => {
        fetchData()
    }, [])



    const fetchData = async () => {
        const ticketsResponse: TicketModel[] = await fetchTickets(id!, auth()!.token);
        setColumns({
            "Requested": {
                name: "Requested",
                displayName: "Requested",
                items: ticketsResponse.filter((item) => item.status === "Requested")
            },
            "Todo": {
                name: "Todo",
                displayName: "To do",
                items: ticketsResponse.filter((item) => item.status === "Todo")
            },
            "InProgress": {
                name: "InProgress",
                displayName: "In Progress",
                items: ticketsResponse.filter((item) => item.status === "InProgress")
            },
            "Done": {
                name: "Done",
                displayName: "Done",
                items: ticketsResponse.filter((item) => item.status === "Done")
            }
        })


    }



    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    const handleSave = async () => {
        setUpdateStatusLoading(true)
        const response = await saveChanges(id!, columns, auth()!.token)
        setUpdateStatusLoading(false)
        setUpdateStatusErrorMessage(response)
        setTimeout(() => setUpdateStatusErrorMessage({ status: "", message: "" }), 3000);
    }



    const handlePriority = (priority: string) => {
        if (priority === "high") {
            return "badge rounded-pill bg-label-danger";
        }
        if (priority === "medium") {
            return "badge rounded-pill bg-label-warning";
        }
        if (priority === "low") {
            return "badge rounded-pill bg-label-success";
        }

        return "badge rounded-pill bg-label-info";
    }

    const handleClickTicket = async (clickedTicket: TicketModel) => {

        setSelectedTicket(clickedTicket)
        toggleEditTicketModal()
        const ticket = await fetchTicketById(clickedTicket.id, auth()!.token)
        console.log(ticket)
        setSelectedTicket(ticket)
        await saveChanges(id!, columns, auth()!.token);

    }



    return (
        <>

            <div className="container-xxl flex-grow-1 container-p-y">
                <div className='py-3 mb-4' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ marginBottom: 0 }} className="fw-bold">
                        <span className="text-muted fw-light"> Project / tickets </span>
                    </h4>

                    <div style={{ display: "flex", alignItems: "center" }}>


                        {(updateStatusErrorMessage.message !== "") && <div style={{ marginRight: "5px" }} className={(updateStatusErrorMessage.status === "success" ? "alert alert-success mt-3" : "alert alert-danger mt-3")} role="alert">
                            {updateStatusErrorMessage.message}
                        </div>}

                        <button disabled={updateStatusLoading} style={{ marginRight: "5px" }} type='button' onClick={handleSave} className='btn btn-primary'>
                            {(updateStatusLoading)
                                ? <span style={{ marginTop: "3px", marginBottom: "3px" }} className="spinner-grow" role="status" aria-hidden="true"></span>
                                : <i className='bx bx-save'></i>}
                        </button>

                        <button type='button' onClick={toggleAddTicketsModal} className='btn btn-primary'>
                            <i className='bx bx-plus'></i>
                        </button>
                    </div>
                </div>








                <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
                    <DragDropContext
                        onDragEnd={result => onDragEnd(result)}>

                        {Object.entries(columns).map(([columnId, column], index) => {
                            return (
                                <div key={columnId} style={{ display: "flex", flexDirection: "column" }}>

                                    <h2
                                        style={{
                                            fontSize: "1.35rem",
                                            maxWidth: "13rem",
                                            fontWeight: 600,
                                            whiteSpace: "nowrap",
                                            padding: 9,
                                            width: "80%",
                                            minHeight: 50,
                                            overflow: "hidden",
                                            marginLeft: "10px",
                                            //backgroundColor: columnColors[index % columnColors.length],
                                            borderRadius: "0.25em",
                                        }}>
                                        {column.displayName}
                                    </h2>
                                    <div style={{ margin: 8 }}>
                                        <Droppable droppableId={columnId} key={columnId}>
                                            {(provided, snapshot) => {
                                                return (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            background: snapshot.isDraggingOver
                                                                ? "#e8e8ee5e"
                                                                : "transparent",
                                                            padding: 4,
                                                            width: 250,
                                                            minHeight: 500,

                                                        }}
                                                    >
                                                        {column.items.map((item, index) => {
                                                            return (
                                                                <Draggable
                                                                    key={item.id}
                                                                    draggableId={item.id.toString()}
                                                                    index={index}>
                                                                    {(provided, snapshot) => {
                                                                        return (
                                                                            <div
                                                                                className={`ticket-item ${(snapshot.isDragging) ? 'isDragging' : ''}`}
                                                                                id={`ticket-${item.id}`}
                                                                                onMouseEnter={() => document.getElementById(`ticket-${item.id}`)!.style.boxShadow = "0 2px 20px 0 rgba(67, 89, 113, .12)"}
                                                                                onMouseLeave={() => document.getElementById(`ticket-${item.id}`)!.style.boxShadow = "0 2px 6px 0 rgba(67, 89, 113, .12)"}
                                                                                onClick={async () => handleClickTicket(item)}
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={{ ...provided.draggableProps.style }}>
                                                                                <div className='d-flex justify-content-between flex-wrap align-items-center mb-2 pb-1'>
                                                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }} className="item-badges">
                                                                                        <div className={handlePriority(item.priority)}> {item.title} </div>
                                                                                        <div style={{ textTransform: "capitalize" }}>{item.priority}</div>
                                                                                    </div>
                                                                                </div>
                                                                                {/*<span className="kanban-text">{item.description}</span>*/}
                                                                                <div dangerouslySetInnerHTML={{ __html: item.description.length <= 50 ? item.description : item.description.substring(0, 50) + "..." }} />
                                                                                


                                                                                <div className="d-flex justify-content-between align-items-center flex-wrap mt-2 pt-1">
                                                                                    <div className="d-flex">
                                                                                        {(item.nbrAttachements !== 0) && <span className="d-flex align-items-center me-2">
                                                                                            <i className="bx bx-paperclip me-1"></i>
                                                                                            <span className="attachments">{item.nbrAttachements}</span>
                                                                                        </span>}
                                                                                        {(item.nbrComments !== 0) && <span className="d-flex align-items-center">
                                                                                            <i className="bx bx-chat me-1"></i><span> {item.nbrComments} </span>
                                                                                        </span>}
                                                                                    </div>
                                                                                    <div className="avatar-group d-flex align-items-center assigned-avatar">
                                                                                        <div className="avatar avatar-xs" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Laurel" data-bs-original-title="Laurel">
                                                                                            {(item.assignedTo) && <ProfileAvatar firstName={item.assignedTo.firstname} lastName={item.assignedTo.lastname} radius={27} />}
                                                                                        </div>
                                                                                    </div></div>

                                                                            </div>


                                                                        );
                                                                    }}
                                                                </Draggable>
                                                            );
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                );
                                            }}
                                        </Droppable>
                                    </div>
                                </div>
                            );
                        })}
                    </DragDropContext >

                </div >
            </div >





            <AddTicketModal
                projectId={id!}
                isOpen={addTicketsModal}
                toggle={toggleAddTicketsModal}
            />


            <EditTicketModal
                isOpen={editTicketModal}
                toggle={toggleEditTicketModal}
                columns={columns}
                selectedTicket={selectedTicket}
                updateColumns={(updatedColumns) => setColumns(updatedColumns)}
                updateSelectedTicket={(updatedTicket) => setSelectedTicket(updatedTicket)}
            />

        </>





    )
}

export default Tickets