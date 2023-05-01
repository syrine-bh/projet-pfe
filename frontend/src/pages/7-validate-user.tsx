import { useEffect, useState, ChangeEvent } from 'react'
import { useAuthUser } from 'react-auth-kit';
import { useParams } from 'react-router-dom'
import { INIT_USER } from '../config'
import { validateUser } from '../fetchers/notification-fetcher';
import { fetchUserById } from '../fetchers/user-fetcher';
import { UserModel } from '../models/UserModel';

function ValidateUser() {

    let { id } = useParams();
    const auth = useAuthUser();

    const [user, setUser] = useState<UserModel>(INIT_USER)

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        if (id && Number(id)) {
            const response = await fetchUserById(Number(id), auth()!.token)
            setUser(response)
        } else {
            console.log("id not specified or invalid format")
        }

    }

    const generateSecurepassword = () => {
        var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var passwordLength = 12;
        var generatedPassword = "";

        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            generatedPassword += chars.substring(randomNumber, randomNumber + 1);
        }
        setPassword(generatedPassword)
        setConfirmPassword(generatedPassword)
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault()

        document.getElementById('newPassword')!.style.borderColor = "#d9dee3"
        document.getElementById('newPasswordShow')!.style.borderColor = "#d9dee3"
        document.getElementById('confirmPassword')!.style.borderColor = "#d9dee3"
        document.getElementById('confirmPasswordShow')!.style.borderColor = "#d9dee3"

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
        const response = await validateUser(Number(id), password, auth()!.token);
        setLoading(false);

        console.log(response.message);




    }

    return (
        <div className="content-wrapper" >

            {/* Content */}

            <div className="container-xxl flex-grow-1 container-p-y" >
                <h4 className="fw-bold py-3 mb-4">
                    <span className="text-muted fw-light">User / View /</span> Details
                </h4>

                <div className='row'>
                    <div className="col-xl-4 col-lg-5 col-md-5 order-1 order-md-0">
                        {/* User Card */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="user-avatar-section">
                                    <div className=" d-flex align-items-center flex-column">
                                        <img className="img-fluid rounded my-4" src="./assets/img/avatars/4.png" height="110" width="110" alt="User avatar" />
                                        <div className="user-info text-center">
                                            <h4 className="mb-2">{user.firstname + " " + user.lastname}</h4>
                                            <span className="badge bg-label-secondary">{user.roles[0].split("_")[1]}</span>
                                        </div>
                                    </div>
                                </div>

                                <h5 className="pb-2 border-bottom mb-4">Details</h5>
                                <div className="info-container">
                                    <ul className="list-unstyled">

                                        <li className="mb-3">
                                            <span className="fw-bold me-2">Email:</span>
                                            <span>{user.email}</span>
                                        </li>
                                        <li className="mb-3">
                                            <span className="fw-bold me-2">Status:</span>
                                            {(user.isActive == 0)
                                                ? <span className="badge bg-label-danger">Inactive</span>
                                                : <span className="badge bg-label-success">Active</span>}
                                        </li>
                                        <li className="mb-3">
                                            <span className="fw-bold me-2">Role:</span>
                                            <span>{user.roles[0].split("_")[1]}</span>
                                        </li>
                                        <li className="mb-3">
                                            <span className="fw-bold me-2">Contact:</span>
                                            <span>{user.phoneNumber}</span>
                                        </li>
                                        {user.company !== "" &&
                                            <li className="mb-3">
                                                <span className="fw-bold me-2">Company:</span>
                                                <span>{user.company}</span>
                                            </li>
                                        }
                                    </ul>
                                    <div className="d-flex justify-content-center pt-3">
                                        <a href="#" className="btn btn-label-danger suspend-user">Suspend</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* /User Card */}
                    </div>
                    <div className='col-xl-8 col-lg-7 col-md-7 order-0 order-md-1'>
                        <div className="card mb-4">
                            <h5 className="card-header">Change Password</h5>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} id="formChangePassword" className="fv-plugins-bootstrap5 fv-plugins-framework">
                                    <div className="alert alert-warning" role="alert">
                                        <h6 className="alert-heading fw-bold mb-1">Ensure that these requirements are met</h6>
                                        <span>Minimum 8 characters long, uppercase &amp; symbol</span>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-12 col-sm-6 form-password-toggle fv-plugins-icon-container">
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

                                        <div className="mb-3 col-12 col-sm-6 form-password-toggle fv-plugins-icon-container">
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
                                        <div>
                                            <button onClick={generateSecurepassword} type="button" className="btn btn-outline-primary me-2">
                                                <i className='bx bx-key'></i>
                                                Autogenerate secure Password
                                            </button>
                                            <button disabled={loading} type="submit" className="btn btn-primary me-2">
                                                {(loading) && <span className="spinner-grow me-1" role="status" aria-hidden="true"></span>}
                                                Validate user
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default ValidateUser