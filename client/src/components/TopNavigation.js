import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";

function TopNavigation() {

  let navigate = useNavigate();

  let userDetails = useSelector((store)=>{
    return store.userDetails;
  });

  useEffect(()=>{
    if(userDetails && userDetails.email){

    }else{
      navigate("/");
    }
  },[]);

  return (
    <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/leaves">Leaves</Link>
        <Link to="/editProfile">Edit Profile</Link>
        <Link to="/" onClick={()=>{
          localStorage.clear();
        }}>Signout</Link>

    </nav>
  )
}

export default TopNavigation