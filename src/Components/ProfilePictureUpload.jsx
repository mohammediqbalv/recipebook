import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from 'react-bootstrap/Button';
import ImageCropper from './ImageCropper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ImageCropper.css';

const ProfilePictureUpload = ({ 
  currentProfileImage, 
  onProfileUpdate, 
  size = 80, 
  showUploadButton = true,
  className = "" 
}) => {
  const [showCropper, setShowCropper] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageCropped = async (croppedFile) => {
    setIsUploading(true);
    try {
      // Call the parent component's update function
      await onProfileUpdate(croppedFile);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile picture. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarClick = () => {
    if (showUploadButton) {
      setShowCropper(true);
    }
  };

  return (
    <>
      <div className={`position-relative ${className}`}>
        <Avatar
          alt="Profile Picture"
          className={`img-fluid profile-avatar ${showUploadButton ? 'cursor-pointer' : ''}`}
          src={currentProfileImage}
          sx={{ 
            width: size, 
            height: size,
            cursor: showUploadButton ? 'pointer' : 'default'
          }}
          onClick={handleAvatarClick}
        />
        
        {showUploadButton && (
          <div className="position-absolute bottom-0 end-0">
            <button
              className="upload-button"
              onClick={() => setShowCropper(true)}
              disabled={isUploading}
            >
              <i className="fa-solid fa-camera" style={{ fontSize: '12px' }}></i>
            </button>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="loading-overlay">
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      <ImageCropper
        show={showCropper}
        onHide={() => setShowCropper(false)}
        onImageCropped={handleImageCropped}
        currentProfileImage={currentProfileImage}
      />
    </>
  );
};

export default ProfilePictureUpload; 