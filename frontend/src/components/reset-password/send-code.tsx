import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendVerificationCode } from '../../fetchers/user-fetcher';
interface SendCodeProps {
    navigateToVerifyCode: () => void,
    email: string
    onChangeEmail: (e: any) => void
}


function SendCode({ navigateToVerifyCode, email, onChangeEmail }: SendCodeProps) {



    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (email === "") {
            console.log("enter email")
            return;
        }

        const response = await sendVerificationCode(email)

        if (response.status === "error") {
            console.log(response.message)
            return;
        }
        

        navigateToVerifyCode()
    }
    return (
        <div className="card">
            <div className="card-body">
                <div className="app-brand justify-content-center">
                    <a href="index.html" className="app-brand-link gap-2">
                        <span className="app-brand-logo demo">
                            <img width={90} src="/assets/img/logo.jpg" alt="logo" />
                        </span>
                        <span className="app-brand-text demo text-body fw-bolder"></span>
                    </a>
                </div>

                <h4 className="mb-2">Forgot Password? 🔒</h4>
                <p className="mb-4">Enter your email and we'll send you instructions to reset your password</p>
                <form onSubmit={handleSubmit} className="mb-3 fv-plugins-bootstrap5 fv-plugins-framework" noValidate>
                    <div className="mb-3 fv-plugins-icon-container">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input onChange={onChangeEmail} type="text" className="form-control" id="email" name="email" placeholder="Enter your email" autoFocus={true} />
                        <div className="fv-plugins-message-container invalid-feedback"></div></div>
                    <button type='submit' className="btn btn-primary d-grid w-100">Send Reset Code</button>
                    <input type="hidden" />
                </form>
                <div className="text-center">
                    <Link to={'/login'} className="d-flex align-items-center justify-content-center">
                        <i className="bx bx-chevron-left scaleX-n1-rtl bx-sm"></i>
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SendCode