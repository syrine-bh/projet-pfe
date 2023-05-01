import { useState } from "react";
import { Link } from "react-router-dom";
import ChangePassword from "../components/reset-password/change-password";
import SendCode from "../components/reset-password/send-code";
import VerifyCode from "../components/reset-password/verify-code";
import { sendVerificationCode } from "../fetchers/user-fetcher";
import "../stylesheets/login.css"


function VerifyCodeToReset() {

  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState("")
  /*const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showNewPasswordInput, setShowNewPasswordInput] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);*/


  const [progress, setProgress] = useState<string>("sendCode")


  /*const handleVerificationCodeSubmit = async (e: any) => {
    e.preventDefault();

    if (email === "") {
      setMessage("Please provide your email address");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:8000/sendVerificationCode', {
        method: 'PUT',
      });

      if (response.ok) {
        setShowNewPasswordInput(true);
        setMessage("");
      } else {
        setMessage("An error occurred while sending verification code");
      }
    } catch (error) {
      setMessage("An error occurred while sending verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: any) => {
    e.preventDefault();

    if (newPassword === "") {
      setMessage("Please provide a new password");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/resetPassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, newPassword, verificationCode })
      });

      if (response.ok) {
        setMessage("Password reset successfully");
        setEmail("");
        setVerificationCode("");
        setNewPassword("");
        setShowNewPasswordInput(false);
      }
      else {
        setMessage("An error occurred while resetting your password");
      }
    }
    catch (error) {
      setMessage("An error occurred while resetting your password");
    }
  };*/



  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">

          {(progress === "sendCode") &&
            <SendCode
              navigateToVerifyCode={() => setProgress("VerifyCode")}
              email={email}
              onChangeEmail={(e: any) => setEmail(e.target.value)}
            />
          }


          {(progress === "VerifyCode") &&
            <VerifyCode
              email={email}
              updateCode={(code:string)=> setCode(code)}
              navigateToResetPassword={() => setProgress("changePassword")}
            />}

          {(progress === "changePassword") &&
            <ChangePassword 
            email={email}
            code={code}
             />}



          {/* <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <a href="index.html" className="app-brand-link gap-2">
                  <span className="app-brand-logo demo">
                    <img width={90} src="/assets/img/logo.jpg" alt="logo" />
                  </span>
                  <span className="app-brand-text demo text-body fw-bolder"></span>
                </a>
              </div>
              <h4 className="mb-2"> reset password</h4>
              <form
                onSubmit={showNewPasswordInput ? handleNewPasswordSubmit : handleVerificationCodeSubmit}
                id="formAuthentication"
                className="mb-3"
                method="POST"
              >
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email "
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    autoFocus={true}
                  />
                </div>
                {showNewPasswordInput ? (
                  <>
                    <div className="mb-3">
                      <label htmlFor="verificationCode" className="form-label">
                        Verification Code{" "}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="verificationCode"
                        name="verificationCode"
                        placeholder="Enter your verification code"
                        value={verificationCode}
                        onChange={(e: any) => setVerificationCode(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label">
                        New Password{" "}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e: any) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary d-grid w-100"
                        onClick={handleNewPasswordSubmit}
                      >
                        Reset Password
                      </button>
                    </div>
                  </>
                ) : null}
                {message && (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default VerifyCodeToReset;




