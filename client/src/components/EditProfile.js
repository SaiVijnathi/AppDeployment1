import React, { useEffect, useRef, useState} from 'react'
// import { Link } from 'react-router-dom';
import TopNavigation from "./TopNavigation"
import { useSelector } from 'react-redux';

function EditProfile() {

    let [profilePic, setProfilePic] = useState("./images/user-image.png");

    let userDetails = useSelector((store)=>{
        return store.userDetails;
    })

    useEffect(()=>{
        firstNameInputRef.current.value = userDetails.firstName;
        lastNameInputRef.current.value = userDetails.lastName;
        ageInputRef.current.value = userDetails.age;
        emailInputRef.current.value = userDetails.email;
        mobileInputRef.current.value = userDetails.mobileNO;
        setProfilePic(`http://localhost:8888/${userDetails.profilePic}`)
    },[])

    let firstNameInputRef = useRef();
    let lastNameInputRef = useRef();
    let ageInputRef = useRef();
    let emailInputRef = useRef();
    let passwordInputRef = useRef();
    let mobileInputRef = useRef();
    let profilePicInputRef = useRef();


    let onUpdateProfile = async ()=>{
        let dataToSend = new FormData();    
        dataToSend.append("firstName",firstNameInputRef.current.value);
        dataToSend.append("lastName",lastNameInputRef.current.value);
        dataToSend.append("age",ageInputRef.current.value);
        dataToSend.append("email",emailInputRef.current.value);
        dataToSend.append("password",passwordInputRef.current.value);
        dataToSend.append("mobileNO",mobileInputRef.current.value);

        for(let i=0;i<profilePicInputRef.current.files.length;i++){
            dataToSend.append("profilePic",profilePicInputRef.current.files[i]);
        }
                                //we dont need headers, because by default is form data
        let reqOptions={
            method:"PATCH",
            body:dataToSend,
        }

        let JSONData = await fetch("http://localhost:8888/updateProfile",reqOptions);
        let JSOData = await JSONData.json();
        alert(JSOData.msg);
    };


  return (
    <div>
    <TopNavigation/>
        <form>
        <h2>Edit Profile</h2>
            <div>
                <label>First Name</label>
                <input ref={firstNameInputRef}></input>
            </div>
            <div>
                <label>Last Name</label>
                <input ref={lastNameInputRef}></input>
            </div>
            <div>
                <label>Age</label>
                <input type='number' ref={ageInputRef}></input>
            </div>
            <div>
                <label>Email</label>
                <input ref={emailInputRef} readOnly></input>
            </div>
            <div>
                <label>Password</label>
                <input ref={passwordInputRef}></input>
            </div>
            <div>
                <label>Mobile Number</label>
                <input ref={mobileInputRef}></input>
            </div>
            <div>
                <label>Profile Pic</label>
                <input type='file' ref={profilePicInputRef} onChange={(event)=>{
                    let selectedPicPath = URL.createObjectURL(event.target.files[0]);
                    setProfilePic(selectedPicPath);
                }}></input>
            </div>
            <div>
                <img className='profilePicPreview' alt="" src={profilePic}></img>
            </div>
            <div>
                <button type='button' onClick={()=>{
                    onUpdateProfile();
                }}>Save</button>
            </div>
        </form>
        <br></br>
    </div>
  )
}

export default EditProfile;