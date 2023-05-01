import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TicketModel } from "../models/TicketModel";
import { fetchTicketById } from "../fetchers/ticket-fetcher";
import { useAuthUser } from "react-auth-kit";
import { INIT_TICKET } from "../config";
import '../stylesheets/comments.css'

function TicketDetails() {
  const { TicketId } = useParams()

  const [ticket, setTicket] = useState<TicketModel>({
    ...INIT_TICKET,
    id: Number(TicketId) ? Number(TicketId) : 0
  });
  const auth = useAuthUser();


  useEffect(() => {
    fetchData()
  }, [])


  const fetchData = async () => {
    const fetchTicket = await fetchTicketById(ticket.id, auth()!.token);
    setTicket(fetchTicket);
  }

  return (
    <div className="content-wrapper">

      <div className="container-xxl flex-grow-1 container-p-y">

        <div className="row invoice-preview">

          <div className="col-xl-9 col-md-8 col-12 mb-md-0 mb-4">
            <div className="card invoice-preview-card">
              <div className="card-body">
                <div className="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column p-sm-3 p-0">
                  <div className="mb-xl-0 mb-4">
                    <div className="d-flex svg-illustration mb-3 gap-2">

                      <div className="d-flex align-items-center mb-3">
                        <span className="badge bg-label-info ms-auto">{ticket.title}</span>


                      </div>

                    </div>

                    <p className="mb-1">{ticket.description}</p>

                  </div>
                  <div>
                    <div className="d-flex align-items-center mb-3" > <h4>{ticket.status} </h4>
                      <div className="d-flex align-items-center mb-3">
                        {ticket.priority === "low" && (
                          <span style={{ marginRight: '-55px' }} className="badge bg-label-success ms-auto">{ticket.priority}</span>
                        )}
                        {ticket.priority === "medium" && (
                          <span style={{ marginRight: '-55px' }} className="badge bg-label-warning ms-auto">{ticket.priority}</span>
                        )}
                        {ticket.priority === "high" && (
                          <span style={{ marginRight: '-55px' }} className="badge bg-label-danger ms-auto">{ticket.priority}</span>
                        )}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="me-1">Date Issues:</span>
                      <span className="fw-semibold">25/08/2020</span>
                    </div>
                    <div>
                      <span className="me-1">Date Due:</span>
                      <span className="fw-semibold">29/08/2020</span>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <div className="row p-sm-3 p-0">
                  <div className="col-xl-6 col-md-12 col-sm-5 col-12 mb-xl-0 mb-md-4 mb-sm-0 mb-4">
                    <h6 className="pb-2">created by:</h6>
                    <p className="mb-1">cyrine@gmail.com</p>

                  </div>
                  <div className="col-xl-6 col-md-12 col-sm-5 col-12 mb-xl-0 mb-md-4 mb-sm-0 mb-4">
                    <h6 className="pb-2">assigned To:</h6>
                    <p className="mb-1">john.doe@gmail.com</p>

                  </div>

                </div>
              </div>


            <div>
              
              <h6 className="pb-2">dispay screeshots here</h6>
            </div>
            ////
            
            ////
            <div className="comments-container">
		<h6>User Comments</h6>

		<ul id="comments-list" className="comments-list">
			<li>
				<div className="comment-main-level">
					<div className="comment-avatar"><img  src="./assets/img/avatars/1.png" alt=""/></div>
					<div className="comment-box">
						<div className="comment-head">
							<h6 className="comment-name by-author"><a href="#">User Name</a></h6>
							<span className="posted-time">Posted on 10-FEB-2015 12:00</span>
							<i className="fa fa-reply"></i>
							<i className="fa fa-heart"></i>
						</div>
						<div className="comment-content">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit omnis animi et iure laudantium vitae, praesentium optio, sapiente distinctio illo?
							<div className="comment-open">
								<a className="btn-reply">
									<i className="fa fa-reply"></i>
								</a>
							</div>
						</div>
						<div className="comment-footer">
							<div className="comment-form">
								<textarea className="form-control" name="" id=""></textarea>
								<div className="pull-right send-button">
									<a className="btn-send">send</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<ul className="comments-list reply-list">
					<li>

						<div className="comment-avatar"><img  src="./assets/img/avatars/2.png" alt=""/></div>

						<div className="comment-box">
							<div className="comment-head">
								<h6 className="comment-name"><a href="#">Lorena Rojero</a></h6>
								<span className="posted-time">Posted on DD-MM-YYYY HH:MM</span>
								<i className="fa fa-reply"></i>
								<i className="fa fa-heart"></i>
							</div>
							<div className="comment-content">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit omnis animi et iure laudantium vitae, praesentium optio, sapiente distinctio illo?
								<div className="comment-open">
									<a className="btn-reply">
										<i className="fa fa-reply"></i>
									</a>
								</div>
							</div>
							<div className="comment-footer">
							<div className="comment-form">
								<textarea className="form-control" name="" id=""></textarea>
								<div className="pull-right send-button">
									<a className="btn-send">send</a>
								</div>
							</div>
						</div>
						</div>
					</li>

					<li>

						<div className="comment-avatar"><img src="./assets/img/avatars/3.png" alt=""/></div>

						<div className="comment-box">
							<div className="comment-head">
								<h6 className="comment-name by-author"><a href="#">User Name</a></h6>
								<span className="posted-time">Posted on DD-MM-YYYY HH:MM</span>
								<i className="fa fa-reply"></i>
								<i className="fa fa-heart"></i>
							</div>
							<div className="comment-content">
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit omnis animi et iure laudantium vitae, praesentium optio, sapiente distinctio illo?
								<div className="comment-open">
									<a className="btn-reply">
										<i className="fa fa-reply"></i>
									</a>
								</div>
							</div>
							<div className="comment-footer">
							<div className="comment-form">
								<textarea className="form-control" name="" id=""></textarea>
								<div className="pull-right send-button">
									<a className="btn-send">send</a>
								</div>
							</div>
						</div>
						</div>
					</li>
				</ul>
			</li>

			<li>
				<div className="comment-main-level">

					<div className="comment-avatar"><img src="./assets/img/avatars/4.png" alt=""/></div>

					<div className="comment-box">
						<div className="comment-head">
							<h6 className="comment-name"><a href="#">Lorena Rojero</a></h6>
							<span className="posted-time">Posted on DD-MM-YYYY HH:MM</span>
							<i className="fa fa-reply"></i>
							<i className="fa fa-heart"></i>
						</div>
						<div className="comment-content">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit omnis animi et iure laudantium vitae, praesentium optio, sapiente distinctio illo?
							<div className="comment-open">
								<a className="btn-reply">
									<i className="fa fa-reply"></i>
								</a>
							</div>
						</div>
						<div className="comment-footer">
							<div className="comment-form">
								<textarea className="form-control" name="" id=""></textarea>
								<div className="pull-right send-button">
									<a className="btn-send">send</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>

           
            </div>
          </div>

          <div className="col-xl-3 col-md-4 col-12 invoice-actions">
            <div className="card">
              <div className="card-body">
                <button className="btn btn-primary d-grid w-100 mb-3" data-bs-toggle="offcanvas" data-bs-target="#sendInvoiceOffcanvas">
                  <span className="d-flex align-items-center justify-content-center text-nowrap"><i className="bx bx-paper-plane bx-xs me-1"></i>Send mail</span>
                </button>
                <button className="btn btn-label-secondary d-grid w-100 mb-3">
                  Download
                </button>
                <a className="btn btn-label-secondary d-grid w-100 mb-3" target="_blank" href="./app-invoice-print.html">
                  Print
                </a>

              </div>
            </div>
          </div>
        </div>


        <div className="offcanvas offcanvas-end" id="sendInvoiceOffcanvas" aria-hidden="true">
          <div className="offcanvas-header mb-3">
            <h5 className="offcanvas-title">Send mail </h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body flex-grow-1">
            <form>
              <div className="mb-3">
                <label htmlFor="invoice-from" className="form-label">From</label>
                <input type="text" className="form-control" id="invoice-from" value="shelbyComapny@email.com" placeholder="company@email.com" />
              </div>
              <div className="mb-3">
                <label htmlFor="invoice-to" className="form-label">To</label>
                <input type="text" className="form-control" id="invoice-to" value="qConsolidated@email.com" placeholder="company@email.com" />
              </div>
              <div className="mb-3">
                <label htmlFor="invoice-subject" className="form-label">Subject</label>
                <input type="text" className="form-control" id="invoice-subject" value="Invoice of purchased Admin Templates" placeholder="Invoice regarding goods" />
              </div>
              <div className="mb-3">
                <label htmlFor="invoice-message" className="form-label">Message</label>
                <textarea className="form-control" name="invoice-message" id="invoice-message" cols={3} rows={8}>Dear Queen Consolidated,
                  Thank you for your business, always a pleasure to work with you!
                  We have generated a new invoice in the amount of $95.59
                  We would appreciate payment of this invoice by 05/11/2021</textarea>
              </div>
              <div className="mb-4">
                <span className="badge bg-label-primary">
                  <i className="bx bx-link bx-xs"></i>
                  <span className="align-middle">Invoice Attached</span>
                </span>
              </div>
              <div className="mb-3 d-flex flex-wrap">
                <button type="button" className="btn btn-primary me-3" data-bs-dismiss="offcanvas">Send</button>
                <button type="button" className="btn btn-label-secondary" data-bs-dismiss="offcanvas">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <div className="offcanvas offcanvas-end" id="addPaymentOffcanvas" aria-hidden="true">
          <div className="offcanvas-header mb-3">
            <h5 className="offcanvas-title">Add Payment</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body flex-grow-1">
            <div className="d-flex justify-content-between bg-lighter p-2 mb-3">
              <p className="mb-0">Invoice Balance:</p>
              <p className="fw-bold mb-0">$5000.00</p>
            </div>
            <form>
              <div className="mb-3">
                <label className="form-label" htmlFor="invoiceAmount">Payment Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input type="text" id="invoiceAmount" name="invoiceAmount" className="form-control invoice-amount" placeholder="100" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="payment-date">Payment Date</label>
                <input id="payment-date" className="form-control invoice-date flatpickr-input" type="text" readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="payment-method">Payment Method</label>
                <select className="form-select" id="payment-method">
                  <option value="" selected disabled >Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Paypal">Paypal</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label" htmlFor="payment-note">Internal Payment Note</label>
                <textarea className="form-control" id="payment-note" rows={2}></textarea>
              </div>
              <div className="mb-3 d-flex flex-wrap">
                <button type="button" className="btn btn-primary me-3" data-bs-dismiss="offcanvas">Send</button>
                <button type="button" className="btn btn-label-secondary" data-bs-dismiss="offcanvas">Cancel</button>
              </div>
            </form>
          </div>
        </div>



      </div>




      <div className="content-backdrop fade"></div>
    </div>

  );
};

export default TicketDetails;
