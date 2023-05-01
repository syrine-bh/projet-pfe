import { useState } from "react";
import "../stylesheets/login.css"


import { Link, useNavigate } from "react-router-dom";

import { UserModel } from "../models/UserModel";
import { login, loginAvance } from "../fetchers/user-fetcher";
import { LoginResponse } from "../models/LoginResponse";

import { useSignIn } from 'react-auth-kit';
import Loader from "../components/Loader";

function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const signIn = useSignIn()

    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrorMessage("")
        if (email === "") {
            console.log("please provide email")
            setErrorMessage("Please provide email")
            return;
        }

        if (password === "") {
            console.log("please provide password")
            setErrorMessage("Please provide password")
            return;
        }

        setLoading(true)
        const response: LoginResponse = await loginAvance(email, password);
        setLoading(false)
        if (response.status === "error") {
            console.log(response.message)
            setErrorMessage(response.message)
            return;
        }

        const logged = signIn({ token: response.user?.token!, expiresIn: 120, tokenType: "Bearer", authState: response.user! });
        if (logged) {
            navigate('/dashboard')
        }

    }
    // async function fetchData() {
    //     try {

    //        // const response = await axios.post<UserModel[]>('http://localhost:8000/api/login_check',

    //       //);
    //       //  if (response.status === 200) {setUsers(response.data) } else { console.log(" sthg is wrong")}

    //       const response = await axios.post('http://localhost:8000/api/login_check', {email: email, password: password, });
    //       const token = response.data.token;
    //       localStorage.setItem('token', token); // Store the token in localStorage
    //       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set default Authorization header for subsequent requests
    //     } 

    //     catch (error) {
    //         console.log("error catched", error)

    //     }

    // }






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

                            <h4 className="mb-2">Welcome  👋</h4>

                            <form onSubmit={handleSubmit} id="formAuthentication" className="mb-3" method="POST">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email or Username</label>


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
                                <div className="mb-3 form-password-toggle">
                                    <div className="d-flex justify-content-between">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <Link to={'/reset-password'}>
                                            <small>Forgot Password?</small>
                                        </Link>
                                    </div>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="password"
                                            id="password"
                                            className="form-control"
                                            name="password"
                                            value={password}
                                            placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                            aria-describedby="password"
                                            onChange={(e: any) => setPassword(e.target.value)}
                                        />
                                        <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="remember-me" />
                                        <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <button disabled={loading} className="btn btn-primary w-100" type="submit">
                                        {(loading) && <span className="spinner-grow me-1" role="status" aria-hidden="true"></span>}
                                        Sign in
                                    </button>
                                </div>
                                {(errorMessage !== "") && <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>}
                            </form>

                            <div className="text-center">
                                <span>New on our platform?</span>
                                <br />
                                {/* <div>
                                <Link to="/register">
                                    <span>member👋</span>
                                    <p style={{ marginTop: "1rem" }} className="text-center"><span> </span><Link to={"/RegisterClient"}><span> client 👋</span></Link>
                                    </p>

                                </Link>
                                </div>*/}
                                <div>
                                    <Link to="/register">
                                        <span style={{ display: "inline-block" }}>member 👋</span>
                                    </Link>

                                    <Link style={{ marginLeft: "1rem" }} to="/RegisterClient">
                                        <span style={{ display: "inline-block" }}>client 👋</span>
                                    </Link>


                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login

function setUsers(data: UserModel[]) {
    throw new Error("Function not implemented.");
}
