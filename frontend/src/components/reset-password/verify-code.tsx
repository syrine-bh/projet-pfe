import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { verifyCode } from '../../fetchers/user-fetcher';


interface verifyCodeProps{
  email:string
  navigateToResetPassword:() => void
  updateCode:(code:string) => void
}

function VerifyCode({email,navigateToResetPassword,updateCode}:verifyCodeProps) {

  async function handleSubmit(e: any) {
    e.preventDefault()
    const inputs = document.querySelectorAll(".auth-input")
    let otp = "";
    for (let i = 0; i < inputs.length; i++) {
      otp += (inputs[i] as HTMLInputElement).value
    }

    if(otp.length<6){
      console.log("code manquant")
      return;
    }
    updateCode(otp)
    const response = await verifyCode(email,otp)

    if(response.status==="error"){
      console.log(response.message)
      return;
    }

    navigateToResetPassword()
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
        <h4 className="mb-2">Two Step Verification 💬</h4>
        <p className="text-start mb-4">
          We sent a verification code to your mobile. Enter the code from the mobile in the field below.
          <span className="fw-bold d-block mt-2">******1234</span>
        </p>
        <p className="mb-0 fw-semibold">Type your 6 digit security code</p>
        <form onSubmit={handleSubmit} id="twoStepsForm" action="index.html" method="POST" className="fv-plugins-bootstrap5 fv-plugins-framework" noValidate>
          <div className="mb-3 fv-plugins-icon-container">
            <div className="auth-input-wrapper d-flex align-items-center justify-content-sm-between numeral-mask-wrapper">
              <input type="text" className="form-control auth-input h-px-50 text-center numeral-mask text-center h-px-50 mx-1 my-2" maxLength={1} autoFocus />
              <input type="text" className="form-control auth-input h-px-50 text-center numeral-mask text-center h-px-50 mx-1 my-2" maxLength={1} />
              <input type="text" className="form-control auth-input h-px-50 text-center numeral-mask text-center h-px-50 mx-1 my-2" maxLength={1} />
              <input type="text" className="form-control auth-input h-px-50 text-center numeral-mask text-center h-px-50 mx-1 my-2" maxLength={1} />
              <input type="text" className="form-control auth-input h-px-50 text-center numeral-mask text-center h-px-50 mx-1 my-2" maxLength={1} />
              <input type="text" className="form-control auth-input h-px-50 text-center numeral-mask text-center h-px-50 mx-1 my-2" maxLength={1} />
            </div>

            <input type="hidden" name="otp" value="124585" />
            <div className="fv-plugins-message-container invalid-feedback"></div></div>
          <button type='submit' className="btn btn-primary d-grid w-100 mb-3">
            Verify my account
          </button>
          <div className="text-center">Didn't get the code?
            <Link to={'reset-password'}>
              Resend
            </Link>
          </div>
          <input type="hidden" /></form>
      </div>
    </div>
  )
}

export default VerifyCode