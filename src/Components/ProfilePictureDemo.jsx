import React, { useState } from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import avatar from '../Assets/user.jpg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePictureDemo = () => {
  const [demoProfileImage, setDemoProfileImage] = useState(avatar);

  const handleDemoProfileUpdate = async (croppedFile) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a preview URL for demo purposes
      const previewUrl = URL.createObjectURL(croppedFile);
      setDemoProfileImage(previewUrl);
      
      toast.success('Demo profile picture updated!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to update demo profile picture');
      throw error;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center mb-4">Profile Picture Upload Demo</h2>
          <p className="text-center text-muted mb-5">
            Click on any profile picture below to test the upload and cropping functionality
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        {/* Large Profile Picture */}
        <div className="col-md-4 text-center mb-4">
          <h5>Large Profile Picture</h5>
          <div className="d-flex justify-content-center">
            <ProfilePictureUpload
              currentProfileImage={demoProfileImage}
              onProfileUpdate={handleDemoProfileUpdate}
              size={120}
              showUploadButton={true}
            />
          </div>
          <p className="text-muted small mt-2">Size: 120px • With upload button</p>
        </div>

        {/* Medium Profile Picture */}
        <div className="col-md-4 text-center mb-4">
          <h5>Medium Profile Picture</h5>
          <div className="d-flex justify-content-center">
            <ProfilePictureUpload
              currentProfileImage={demoProfileImage}
              onProfileUpdate={handleDemoProfileUpdate}
              size={80}
              showUploadButton={true}
            />
          </div>
          <p className="text-muted small mt-2">Size: 80px • With upload button</p>
        </div>

        {/* Small Profile Picture (Display Only) */}
        <div className="col-md-4 text-center mb-4">
          <h5>Small Profile Picture</h5>
          <div className="d-flex justify-content-center">
            <ProfilePictureUpload
              currentProfileImage={demoProfileImage}
              onProfileUpdate={() => {}}
              size={50}
              showUploadButton={false}
            />
          </div>
          <p className="text-muted small mt-2">Size: 50px • Display only</p>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Features</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>✅ Upload & Preview</h6>
                  <ul className="list-unstyled">
                    <li>• Drag and drop file upload</li>
                    <li>• Image preview before cropping</li>
                    <li>• Support for all image formats</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>✅ Crop & Resize</h6>
                  <ul className="list-unstyled">
                    <li>• Interactive crop selection</li>
                    <li>• Zoom in/out functionality</li>
                    <li>• Rotate image left/right</li>
                    <li>• Reset to original position</li>
                  </ul>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-6">
                  <h6>✅ User Experience</h6>
                  <ul className="list-unstyled">
                    <li>• Modern, Instagram-like interface</li>
                    <li>• Responsive design</li>
                    <li>• Loading states and feedback</li>
                    <li>• Toast notifications</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>✅ Integration</h6>
                  <ul className="list-unstyled">
                    <li>• Easy to integrate with existing apps</li>
                    <li>• Customizable size and behavior</li>
                    <li>• Works with existing API endpoints</li>
                    <li>• Bootstrap and Material-UI compatible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h6>💡 How to Use</h6>
            <ol className="mb-0">
              <li>Click on any profile picture with a camera icon</li>
              <li>Select an image file from your device</li>
              <li>Drag the image to reposition it within the crop area</li>
              <li>Use the zoom and rotate controls to adjust the image</li>
              <li>Click "Save Profile Picture" to apply the changes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureDemo; 