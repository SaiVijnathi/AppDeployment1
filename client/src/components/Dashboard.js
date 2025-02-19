// import { TopologyClosedEvent } from 'mongodb';
import React from 'react';
import {useSelector} from "react-redux"
import TopNavigation from './TopNavigation';
import { data } from 'react-router-dom';

function Dashboard() {

  let userDetails = useSelector((store) => {
    return store.userDetails;
  });

  let deleteProfile = async ()=>{

    let dataToSend = new FormData();
    dataToSend.append("email",userDetails.email);

    let reqOptions={
      method:"DELETE",
      body: dataToSend,
    };

    let JSONData = await fetch("http://localhost:8888/deleteProfile",reqOptions);
    let JSOData = await JSONData.json();

    // alert(JSOData).msg;

  }

  return (
    <div>
    <TopNavigation/>
        <h1>Dashboard</h1>
        <button onClick={()=>{
          deleteProfile();
        }}>Delete Profile</button>
        <h2>{userDetails.firstName}{userDetails.lastName}</h2>
        <img alt="" src={`http://localhost:8888/${userDetails.profilePic}`}></img>
    </div>
  )
}

export default Dashboard