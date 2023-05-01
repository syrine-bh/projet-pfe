import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resetPassword } from '../../fetchers/user-fetcher'

interface ChangePasswordProps {
  email: string,
  code: string
}

function ChangePassword({ email,code }: ChangePasswordProps) {

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()
  async function handleSubmit(e: any) {
    e.preventDefault()
    if(password===""){
      console.log("enter password")
      return
    }

    if(confirmPassword===""){
      console.log("confirm Password")
      return
    }

    if(password !== confirmPassword){
      console.log("Password dont match")
      return
    }

    const response = await resetPassword(email,password,code)
    if(response.status=="error"){
      console.log(response.message)
      return
    }

    navigate("/login")



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

        <h4 className="mb-2">Reset Password 🔒</h4>
        <p className="mb-4">for <span className="fw-bold">{email}</span></p>
        <form onSubmit={handleSubmit} id="formAuthentication" className="mb-3 fv-plugins-bootstrap5 fv-plugins-framework" noValidate>
          <div className="mb-3 form-password-toggle fv-plugins-icon-container">
            <label className="form-label" htmlFor="password">New Password</label>
            <div className="input-group input-group-merge has-validation">
              <input onChange={(e: any) => setPassword(e.target.value)} type="password" id="password" className="form-control" name="password" placeholder="············" aria-describedby="password" />
              <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
            </div><div className="fv-plugins-message-container invalid-feedback"></div>
          </div>
          <div className="mb-3 form-password-toggle fv-plugins-icon-container">
            <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
            <div className="input-group input-group-merge has-validation">
              <input onChange={(e: any) => setConfirmPassword(e.target.value)} type="password" id="confirm-password" className="form-control" name="confirm-password" placeholder="············" aria-describedby="password" />
              <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
            </div><div className="fv-plugins-message-container invalid-feedback"></div>
          </div>
          <button type='submit' className="btn btn-primary d-grid w-100 mb-3">
            Set new password
          </button>
          <div className="text-center">
            <Link to="/login">
              <i className="bx bx-chevron-left scaleX-n1-rtl bx-sm"></i>
              Back to login
            </Link>
          </div>
          <input type="hidden" /></form>
      </div>
    </div>
  )
}

export default ChangePassword