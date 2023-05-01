import { useState } from "react";
import "../stylesheets/login.css"


import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { register } from "../fetchers/user-fetcher";

function Register() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");


    const [errorMessage, setErrorMessage] = useState<string>("")
    const [loading, setLoading] = useState(false)


    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (email === "") {
            console.log("please provide email")
            setErrorMessage("Please provide email")
            return;
        }
        if (firstname === "") {
            console.log("please provide firstname")
            setErrorMessage("Please provide firstname")
            return;
        }
        if (lastname === "") {
            console.log("please provide lastname")
            setErrorMessage("Please provide lastname")
            return;
        }
        // if (password === "") {
        //     console.log("please provide password")
        //     setErrorMessage("Please provide password")
        //     return;
        // }

        if (phoneNumber === "") {
            console.log("please provide phoneNumber")
            setErrorMessage("Please provide phoneNumber")
            return;
        }

        setLoading(true)
        const res = await register(email, password, firstname, lastname, phoneNumber);
        setLoading(false)

        if (res.status === 'error') {
            console.log(res.message);
            setErrorMessage(res.message)
            return;
        }

        navigate('/login')
    }







    return (
        <div className="container-xxl">
            <div className="authentication-wrapper authentication-basic container-p-y">
                <div className="authentication-inner">

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

                            <h5 className="mb-2"> Please register as a Wevioo member👋</h5>
                            <br/>
                            <form onSubmit={handleSubmit} id="formAuthentication" className="mb-3" method="POST">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email </label>


                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email "
                                        value={email}
                                        onChange={(e: any) => setEmail(e.target.value)}
                                        autoFocus={true}
                                    />
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="firstname" className="form-label">firstname</label>


                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstname"
                                        name="firstname"
                                        placeholder="Enter your firstname "
                                        value={firstname}
                                        onChange={(e: any) => setFirstname(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lastname" className="form-label">lastname</label>


                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastname"
                                        name="lastname"
                                        placeholder="Enter your lastname "
                                        value={lastname}
                                        onChange={(e: any) => setLastname(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phoneNumber" className="form-label">phone number</label>


                                    <input
                                        type="text"
                                        className="form-control"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        minLength={6}

                                        placeholder="Enter your phoneNumber "
                                        value={phoneNumber}
                                        onChange={(e: any) => setPhoneNumber(e.target.value)}
                                    />
                                </div>



                                {/* <div className="mb-3 form-password-toggle">
                                    <div className="d-flex justify-content-between">
                                        <label className="form-label" htmlFor="password">Password</label>

                                    </div>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            name="password"
                                            minLength={6}
                                            value={password}
                                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                            aria-describedby="password"
                                            onChange={(e: any) => setPassword(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                    </div>
                                </div> */}






                                <div className="mb-3">
                                    <button disabled={loading} className="btn btn-primary w-100" type="submit">
                                        {(loading) && <span className="spinner-grow me-1" role="status" aria-hidden="true"></span>}
                                        Register
                                    </button>
                                    <p style={{ marginTop: "1rem" }} className="text-center"><span> </span><Link to={"/RegisterClient"}><span>Create an account as Wevioo client here </span></Link></p>
                                </div>
                                {(errorMessage !== "") && <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>}
                            </form>


                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register

