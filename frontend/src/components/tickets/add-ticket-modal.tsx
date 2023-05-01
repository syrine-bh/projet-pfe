import { useState } from 'react'
import { BackendResponse } from '../../models/BackendResponse';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { addTicket, uploadTicketAttachements } from '../../fetchers/ticket-fetcher';
import { useAuthUser } from 'react-auth-kit';

import Dropzone from 'react-dropzone'

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import { INIT_TICKET } from '../../config';

interface AddTicketModalProps {
  projectId: string
  isOpen: boolean
  toggle: () => void
}

function AddTicketModal({ projectId, isOpen, toggle }: AddTicketModalProps) {
  const [addErrorMessage, setAddErrorMessage] = useState<BackendResponse>({ status: "", message: "" })
  const [addLoading, setAddLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const [ticket, setTicket] = useState(INIT_TICKET)

  const auth = useAuthUser()




  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setAddErrorMessage({ status: "", message: "" })

    if (!ticket.title) { //if title is not ok
      setAddErrorMessage({ status: "error", message: "Please provide title" })
      return;
    }

    if (!ticket.description) {
      setAddErrorMessage({ status: "error", message: "Please provide description" })
      return;
    }

    if (selectedFiles.length === 0) {
      setAddErrorMessage({ status: "error", message: "Please provide attachments" })
      return;
    }



    setAddLoading(true)
    const responseAdd = await addTicket(projectId, ticket.title, ticket.description, ticket.priority, auth()!.id, auth()!.token);
    if (responseAdd.status === 'success') {
      const responseUpload = await uploadTicketAttachements(responseAdd.message, selectedFiles, auth()!.token);
      setAddLoading(false)
      setAddErrorMessage(responseUpload)
    }



  }

  const manageFileImage = (fileType: string) => {
    const type = fileType.split('/')[0]
    const subType = fileType.split('/')[1];

    if (type === "image") {
      return "./assets/img/attachements/image.png";
    }

    if (type === "application" && subType.includes("word")) {
      return "./assets/img/attachements/docx.png"
    }

    if (type === "application" && subType.includes("json")) {
      return "./assets/img/attachements/json.png"
    }

    if (type === "application" && subType.includes("zip")) {
      return "./assets/img/attachements/zip.png"
    }

    if (type === "application" && subType.includes("pdf")) {
      return "./assets/img/attachements/pdf.png"
    }

    if (type === "application" && subType.includes("excel")) {
      return "./assets/img/attachements/csv.png"
    }

    return "./assets/img/attachements/txt.png"
  }


  const displayFiles = (files: File[]) => {
    return <Swiper
      slidesPerView={3}
      pagination={true}
      modules={[Pagination]}
      className="mySwiper">
      {files.map((file, index) => <SwiperSlide key={index}>
        <div style={{ display: 'grid', justifyItems: 'center', marginBottom: "30px" }}>
          <img width={48} height={48} src={manageFileImage(file.type)} alt="code" />
          <div style={{ width: "140px", maxHeight: "45px" }}>
            <p style={{
              margin: 0,
              textAlign: 'center',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{file.name}</p>
          </div>

          <small className="text-muted">
            {new Date(file.lastModified).toDateString()}
          </small>
          <small>
            {file.type.split('/')[0]}
          </small>
        </div>
      </SwiperSlide>)
      }
    </Swiper >
  }

  return (
    <Modal size="md" isOpen={isOpen} toggle={toggle}>
      <form className="modal-content" onSubmit={handleSubmit}>

        <ModalHeader toggle={toggle}>
          Ticket
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input onChange={(event) => setTicket({ ...ticket, title: event.target.value })} value={ticket.title} type="text" id="title" className="form-control" placeholder="Enter Title" />
            </div>
          </div>

          <div className="row g-2">
            <div className="col mb-0">
              <label htmlFor="emailBasic" className="form-label">Description</label>
             {/* <textarea value={ticket.description} onChange={(event) => setTicket({ ...ticket, description: event.target.value })} className="form-control" name="description" id="description" rows={3}>
              </textarea> */}


              <CKEditor
                editor={ClassicEditor}
                data={ticket.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setTicket({ ...ticket, description: data });
                }}
              />
            </div>
          </div>

          <div className='row g-2 mt-2'>
            <div className="col-12">

              <Dropzone onDrop={(acceptedFiles) => setSelectedFiles(acceptedFiles)}>
                {({ getRootProps, getInputProps, isDragActive, acceptedFiles }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div style={{
                        width: "100%",
                        position: "relative",
                        padding: "1.5rem",
                        cursor: "pointer",
                        borderRadius: "0.5rem",
                        border: "2px dashed #d9dee3"
                      }}>
                        <div style={{
                          margin: "2rem 0",
                        }}>
                          {acceptedFiles.length !== 0
                            ? displayFiles(acceptedFiles)
                            : isDragActive
                              ? <p style={{ fontWeight: 500, textAlign: "center", fontSize: "1.625rem" }}>
                                Drop the files here ...
                              </p>
                              : <p style={{ fontWeight: 500, textAlign: "center", fontSize: "1.625rem" }} className='mb-0'>
                                Drop files here or click to upload
                              </p>}
                        </div>
                      </div>

                    </div>
                  </section>
                )}
              </Dropzone>



            </div>
          </div>


          <div className="row g-2 mt-2">
            <div className="col mb-0">

              <div className="row">
                <div className="col-md mb-md-0 mb-2">
                  <div className={(ticket.priority == "low" ? "form-check custom-option custom-option-icon checked" : "form-check custom-option custom-option-icon")}>
                    <label className="form-check-label custom-option-content" htmlFor="customRadioIcon3">
                      <span className="custom-option-body">
                        <i className="bx bx-time"></i>
                        <span className="custom-option-title"> Low </span>
                        <small>those tasks that can be postponed  without affecting the final product.</small>
                      </span>
                      <input onChange={(event) => setTicket({ ...ticket, priority: event.target.value })} name="customRadioIcon" className="form-check-input" type="radio" value="low" id="customRadioIcon3" checked={ticket.priority == "low"} />
                    </label>
                  </div>
                </div>
                <div className="col-md mb-md-0 mb-2">
                  <div className={(ticket.priority == "medium" ? "form-check custom-option custom-option-icon checked" : "form-check custom-option custom-option-icon")}>
                    <label className="form-check-label custom-option-content" htmlFor="customRadioIcon2">
                      <span className="custom-option-body">
                        <i className="bx bx-alarm"></i>
                        <span className="custom-option-title"> Medium </span>
                        <small>  can be fixed in the upcoming release do not require immediate attention. </small>
                      </span>
                      <input onChange={(event) => setTicket({ ...ticket, priority: event.target.value })} name="customRadioIcon" className="form-check-input" type="radio" value="medium" id="customRadioIcon2" checked={ticket.priority == "medium"} />
                    </label>
                  </div>
                </div>
                <div className="col-md">
                  <div className={(ticket.priority == "high" ? "form-check custom-option custom-option-icon checked" : "form-check custom-option custom-option-icon")}>
                    <label className="form-check-label custom-option-content" htmlFor="customRadioIcon1">
                      <span className="custom-option-body">
                        <i className="bx bx-alarm-exclamation"></i>
                        <span className="custom-option-title">High</span>
                        <small>   you may need to interrupt low-priority tasks for urgent must-dos             . </small>
                      </span>
                      <input onChange={(event) => setTicket({ ...ticket, priority: event.target.value })} name="customRadioIcon" className="form-check-input" type="radio" value="high" id="customRadioIcon1" checked={ticket.priority == "high"} />
                    </label>
                  </div>
                </div>
              </div>
              {(addErrorMessage.message !== "") && <div className={(addErrorMessage.status === "success" ? "alert alert-success mt-3" : "alert alert-danger mt-3")} role="alert">
                {addErrorMessage.message}
              </div>}



            </div>
          </div>


        </ModalBody>
        <ModalFooter>
          <button onClick={toggle} className="btn btn-outline-primary" type="button">
            Close
          </button>
          <button disabled={addLoading} className="btn btn-primary" type="submit">
            {(addLoading) && <span className="spinner-grow me-1" role="status" aria-hidden="true"></span>}
            save
          </button>

        </ModalFooter>
      </form>
    </Modal >
  )
}

export default AddTicketModal