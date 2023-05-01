import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthUser } from 'react-auth-kit'
import { UserModel } from '../models/UserModel';
import { INIT_USER } from '../config';
import { updateUser,fetchUserById } from '../fetchers/user-fetcher';

const Editprofile = () => {

  const [user, setUser] = useState<UserModel>(INIT_USER)
  const navigate = useNavigate()
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const response = await fetchUserById(auth()!.id,auth()!.token)
    if(response.errors){
      console.log(response.errors.errorMessage)
      return
    }
    setUser(response)

  }
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const auth = useAuthUser()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const res = await updateUser(user, auth()!.token)
    console.log('updateUser response: ', res);
    if (res.status === "success") {
        navigate(`/profile/${user.id}`)
    }
     
  };



  
  



  return (
    <div className="container-xxl flex-grow-1 container-p-y">
    <div className="card mb-4">
      <h5 className="card-header">update Profile </h5>
   
      <div  className="card-body">
        <div  className="d-flex align-items-start align-items-sm-center gap-4">
          <img src="../../assets/img/avatars/1.png" alt="user-avatar"  className="d-block rounded" height="100" width="100" id="uploadedAvatar"/>
          <div  className="button-wrapper">
            <label htmlFor="upload"  className="btn btn-primary me-2 mb-4" >
              <span  className="d-none d-sm-block">Upload new photo</span>
              <i  className="bx bx-upload d-block d-sm-none"></i>
              <input type="file" id="uploade"  className="account-file-input"  accept="image/png, image/jpeg"/>
            </label>
            <button type="button"  className="btn btn-label-secondary account-image-reset mb-4">
              <i  className="bx bx-reset d-block d-sm-none"></i>
              <span  className="d-none d-sm-block">Reset</span>
            </button>

            <p  className="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>
      </div>
      <hr  className="my-0"/>
      <div  className="card-body">
        <form id="formAccountSettings" method="POST" onSubmit={handleSubmit} className="fv-plugins-bootstrap5 fv-plugins-framework" >
          <div  className="row">
            <div  className="mb-3 col-md-6 fv-plugins-icon-container">
              <label  htmlFor="firstname"  className="form-label">First Name</label>
              <input  className="form-control" type="text" id="firstname" name="firstname" value={user.firstname} onChange={handleChange} />
            <div  className="fv-plugins-message-container invalid-feedback"></div></div>
            <div  className="mb-3 col-md-6 fv-plugins-icon-container">
              <label  htmlFor="lastname"  className="form-label">Last Name</label>
              <input  className="form-control" type="text" name="lastname" id="lastname" value={user.lastname} onChange={handleChange}/>
            <div  className="fv-plugins-message-container invalid-feedback"></div></div>
            <div className="mb-3 col-md-6">
              <label  htmlFor="email" className="form-label">E-mail</label>
              <input className="form-control" type="text" id="email" name="email" value={user.email} onChange={handleChange}/>
            </div>
            <div className="mb-3 col-md-6">
              <label  htmlFor="organization" className="form-label">Organization</label>
              <input type="text" className="form-control" id="organization" name="company" value={user.company} onChange={handleChange} />
            </div>
            <div className="mb-3 col-md-6">
              <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
              <div className="input-group input-group-merge">
                <span className="input-group-text">TUN (+216)</span>
                <input type="text" id="phoneNumber" name="phoneNumber" className="form-control" value={user.phoneNumber} onChange={handleChange}/>
              </div>
            </div>
           
           
           
            
           
          </div>
          <div className="mt-2">
            <button type="submit" className="btn btn-primary me-2">Save changes</button>
            <button type="reset" className="btn btn-label-secondary">Cancel</button>
          </div>
        <input type="hidden"/></form>
      </div>
    </div>
    </div>
   
  );
};

export default Editprofile;


