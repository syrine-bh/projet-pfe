import { useState, ChangeEvent } from 'react'
import { useAuthUser } from 'react-auth-kit';

import { validateUser } from '../fetchers/notification-fetcher';
import { fetchUserById, fetchmodifyPassword } from '../fetchers/user-fetcher';


function UpdatePassword() {



    const auth = useAuthUser();


    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)





    const handleSubmit = async (event: any) => {
        event.preventDefault()


        document.getElementById('oldPassword')!.style.borderColor = "#d9dee3"
        document.getElementById('oldPasswordShow')!.style.borderColor = "#d9dee3"

        document.getElementById('newPassword')!.style.borderColor = "#d9dee3"
        document.getElementById('newPasswordShow')!.style.borderColor = "#d9dee3"

        document.getElementById('confirmPassword')!.style.borderColor = "#d9dee3"
        document.getElementById('confirmPasswordShow')!.style.borderColor = "#d9dee3"


        if (!oldPassword) {
            console.log("please provide the old password")
            document.getElementById('oldPassword')!.style.borderColor = "#d9dee3"
            document.getElementById('oldPasswordShow')!.style.borderColor = "#d9dee3"
            return;
        }
        if (!password) {
            console.log("please provide password")
            document.getElementById('newPassword')!.style.borderColor = "#ff3e1d"
            document.getElementById('newPasswordShow')!.style.borderColor = "#ff3e1d"
            return;
        }

        if (!confirmPassword) {
            console.log("please confirm your password")
            document.getElementById('confirmPassword')!.style.borderColor = "#ff3e1d"
            document.getElementById('confirmPasswordShow')!.style.borderColor = "#ff3e1d"
            return;
        }

        if (password !== confirmPassword) {
            console.log("password don't match")
            document.getElementById('newPassword')!.style.borderColor = "#ff3e1d"
            document.getElementById('newPasswordShow')!.style.borderColor = "#ff3e1d"
            document.getElementById('confirmPassword')!.style.borderColor = "#ff3e1d"
            document.getElementById('confirmPasswordShow')!.style.borderColor = "#ff3e1d"
            setShowPassword(true)
            return;
        }

        setLoading(true);
        const response = await fetchmodifyPassword(auth()!.id, oldPassword, password, confirmPassword, auth()!.token)
        setLoading(false);

        console.log(response.message);




    }




    return (
        <div className="content-wrapper">


            <div className="container-xxl flex-grow-1 container-p-y" >
                <h4 className="fw-bold py-3 mb-4">
                    <span className="text-muted fw-light">User /</span> Settings
                </h4>

                <div style={{ display: "flex", justifyContent: "center" }} className='row'>
                    <div className='col-md-7 order-0 order-md-1'>
                        <div className="card mb-4">
                            <h5 className="card-header">Change Password</h5>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} id="formChangePassword" className="fv-plugins-bootstrap5 fv-plugins-framework">
                                    <div className="alert alert-warning" role="alert">
                                        <h6 className="alert-heading fw-bold mb-1">Ensure that these requirements are met</h6>
                                        <span>Minimum 8 characters long, uppercase &amp; symbol</span>
                                    </div>
                                    <div className="mb-3 col-12 form-password-toggle fv-plugins-icon-container">
                                        <label className="form-label" htmlFor="newPassword">old Password</label>
                                        <div className="input-group input-group-merge has-validation">
                                            <input
                                                id="oldPassword"
                                                name="oldPassword"
                                                className="form-control"
                                                type={(showPassword) ? "text" : "password"}
                                                placeholder="············"
                                                onChange={(event: ChangeEvent<HTMLInputElement>) => setOldPassword(event.target.value)}
                                                value={oldPassword} />

                                            <span id='oldPasswordShow' onClick={() => setShowPassword(!showPassword)} className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                        </div><div className="fv-plugins-message-container invalid-feedback"></div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-12 form-password-toggle fv-plugins-icon-container">
                                            <label className="form-label" htmlFor="newPassword">New Password</label>
                                            <div className="input-group input-group-merge has-validation">
                                                <input
                                                    id="newPassword"
                                                    name="newPassword"
                                                    className="form-control"
                                                    type={(showPassword) ? "text" : "password"}
                                                    placeholder="············"
                                                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                                                    value={password} />

                                                <span id='newPasswordShow' onClick={() => setShowPassword(!showPassword)} className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                            </div><div className="fv-plugins-message-container invalid-feedback"></div>
                                        </div>

                                        <div className="mb-3 col-12 form-password-toggle fv-plugins-icon-container">
                                            <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                                            <div className="input-group input-group-merge has-validation">
                                                <input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    className="form-control"
                                                    type={(showPassword) ? "text" : "password"}
                                                    placeholder="············"
                                                    onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
                                                    value={confirmPassword}
                                                />
                                                <span id='confirmPasswordShow' onClick={() => setShowPassword(!showPassword)} className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                            </div><div className="fv-plugins-message-container invalid-feedback"></div>
                                        </div>
                                        <div style={{textAlign: "right"}}>

                                            <button disabled={loading} type="submit" className="btn btn-primary me-2">
                                                {(loading) && <span className="spinner-grow me-1" role="status" aria-hidden="true"></span>}
                                                save
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>



















        </div>)
}
export default UpdatePassword