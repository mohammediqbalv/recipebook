import React from 'react'
import avatar from "../Assets/user.jpg"
import ProfilePictureUpload from './ProfilePictureUpload';
import { BASE_URL } from '../Services/baseURL';
 
function Profilebtn({userDetails}) {

  return (
    <>
    <div className='d-flex justify-content-center  align-items-center'>
        <div className=''>
        <ProfilePictureUpload
          currentProfileImage={userDetails?.profile !== "" ? `${BASE_URL}/uploads/${userDetails.profile}` : avatar}
          onProfileUpdate={() => {}} // No update function needed for display-only
          size={34}
          showUploadButton={false}
        />
        </div>
        <div className='ms-3 d-flex flex-column'>
            <span style={{fontSize:"14px"}} className='fw-bold'>{userDetails?.username}</span>
            <span style={{fontSize:"9px"}} className=''>{userDetails?.email}</span>
        </div>
    </div>
    </>
  )
}

export default Profilebtn