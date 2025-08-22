import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ImageCropper.css';

const ImageCropper = ({ show, onHide, onImageCropped, currentProfileImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (show) {
      setSelectedImage(null);
      setPreviewUrl('');
      setCrop({ x: 0, y: 0, width: 200, height: 200 });
      setImagePosition({ x: 0, y: 0 });
      setScale(1);
      setRotation(0);
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    }
  }, [show]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        
                 const img = new Image();
         img.onload = () => {
           setImageSize({ width: img.width, height: img.height });
           
           // Set initial crop to center of container
           const containerWidth = containerRef.current?.offsetWidth || 400;
           const containerHeight = containerRef.current?.offsetHeight || 400;
           const cropSize = Math.min(containerWidth, containerHeight) - 40;
           
                       // Center the crop area in the container
            const cropX = (containerWidth - cropSize) / 2;
            const cropY = (containerHeight - cropSize) / 2;
            
            setCrop({
              x: cropX,
              y: cropY,
              width: cropSize,
              height: cropSize
            });
            
            // Center the image initially
            const imageX = (containerWidth - (img.width * scale)) / 2;
            const imageY = (containerHeight - (img.height * scale)) / 2;
            setImagePosition({ x: imageX, y: imageY });
         };
        img.src = url;
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };

  const handleMouseDown = (e) => {
    if (!selectedImage) return;
    
    // Prevent default to avoid text selection
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Check if clicking on resize handles
    const handleSize = 20;
    const handles = {
      'top-left': { x: crop.x - handleSize/2, y: crop.y - handleSize/2, width: handleSize, height: handleSize },
      'top-right': { x: crop.x + crop.width - handleSize/2, y: crop.y - handleSize/2, width: handleSize, height: handleSize },
      'bottom-left': { x: crop.x - handleSize/2, y: crop.y + crop.height - handleSize/2, width: handleSize, height: handleSize },
      'bottom-right': { x: crop.x + crop.width - handleSize/2, y: crop.y + crop.height - handleSize/2, width: handleSize, height: handleSize }
    };
    
    // Check if clicking on a resize handle
    for (const [handle, bounds] of Object.entries(handles)) {
      if (x >= bounds.x && x <= bounds.x + bounds.width && 
          y >= bounds.y && y <= bounds.y + bounds.height) {
        setIsResizing(true);
        setResizeHandle(handle);
        setDragStart({ x, y });
        return;
      }
    }
    
    // Check if clicking on the image area (for dragging image)
    const imageLeft = imagePosition.x;
    const imageTop = imagePosition.y;
    const imageRight = imageLeft + (imageSize.width * scale);
    const imageBottom = imageTop + (imageSize.height * scale);
    
    if (x >= imageLeft && x <= imageRight && y >= imageTop && y <= imageBottom) {
      setIsDragging(true);
      setDragStart({ x: x - imageLeft, y: y - imageTop });
    }
  };

  const handleMouseMove = (e) => {
    if (!selectedImage) return;
    
    // Prevent default to avoid text selection
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    if (isResizing && resizeHandle) {
      // Handle crop area resizing
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;
      
      let newCrop = { ...crop };
      
      switch (resizeHandle) {
        case 'top-left':
          newCrop.x = Math.max(0, Math.min(crop.x + deltaX, crop.x + crop.width - 50));
          newCrop.y = Math.max(0, Math.min(crop.y + deltaY, crop.y + crop.height - 50));
          newCrop.width = crop.width - (newCrop.x - crop.x);
          newCrop.height = crop.height - (newCrop.y - crop.y);
          break;
        case 'top-right':
          newCrop.y = Math.max(0, Math.min(crop.y + deltaY, crop.y + crop.height - 50));
          newCrop.width = Math.max(50, Math.min(crop.width + deltaX, 400 - newCrop.x));
          newCrop.height = crop.height - (newCrop.y - crop.y);
          break;
        case 'bottom-left':
          newCrop.x = Math.max(0, Math.min(crop.x + deltaX, crop.x + crop.width - 50));
          newCrop.width = crop.width - (newCrop.x - crop.x);
          newCrop.height = Math.max(50, Math.min(crop.height + deltaY, 400 - newCrop.y));
          break;
        case 'bottom-right':
          newCrop.width = Math.max(50, Math.min(crop.width + deltaX, 400 - newCrop.x));
          newCrop.height = Math.max(50, Math.min(crop.height + deltaY, 400 - newCrop.y));
          break;
      }
      
      setCrop(newCrop);
      setDragStart({ x, y });
    } else if (isDragging) {
      // Handle image dragging
      const newImageX = x - dragStart.x;
      const newImageY = y - dragStart.y;
      
      // Calculate bounds to keep image within container
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const imageWidth = imageSize.width * scale;
      const imageHeight = imageSize.height * scale;
      
      // Constrain image position within container bounds
      const constrainedX = Math.max(
        containerWidth - imageWidth,
        Math.min(0, newImageX)
      );
      const constrainedY = Math.max(
        containerHeight - imageHeight,
        Math.min(0, newImageY)
      );
      
      setImagePosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handleMouseUp = (e) => {
    if (e) {
      e.preventDefault();
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleCrop = () => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to crop size
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate the actual crop area relative to the image
    // We need to account for image position, scale, and rotation
    const imageLeft = imagePosition.x;
    const imageTop = imagePosition.y;
    const imageWidth = imageSize.width * scale;
    const imageHeight = imageSize.height * scale;
    
    // Calculate crop coordinates relative to the image
    const cropXRelativeToImage = (crop.x - imageLeft) / scale;
    const cropYRelativeToImage = (crop.y - imageTop) / scale;
    const cropWidthRelativeToImage = crop.width / scale;
    const cropHeightRelativeToImage = crop.height / scale;
    
    // Create temporary canvas for rotation
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Calculate rotated dimensions
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rotatedWidth = Math.abs(imageSize.width * cos) + Math.abs(imageSize.height * sin);
    const rotatedHeight = Math.abs(imageSize.width * sin) + Math.abs(imageSize.height * cos);
    
    tempCanvas.width = rotatedWidth;
    tempCanvas.height = rotatedHeight;
    
    // Move to center of temp canvas
    tempCtx.translate(rotatedWidth / 2, rotatedHeight / 2);
    tempCtx.rotate(rad);
    tempCtx.drawImage(imageRef.current, -imageSize.width / 2, -imageSize.height / 2);
    
    // Calculate the crop area in the rotated coordinate system
    let sourceX, sourceY, sourceWidth, sourceHeight;
    
    if (rotation === 0) {
      sourceX = cropXRelativeToImage;
      sourceY = cropYRelativeToImage;
      sourceWidth = cropWidthRelativeToImage;
      sourceHeight = cropHeightRelativeToImage;
    } else {
      // For rotated images, we need to calculate the crop area in the rotated coordinate system
      const centerX = imageSize.width / 2;
      const centerY = imageSize.height / 2;
      
      // Transform crop coordinates to rotated coordinate system
      const cropCenterX = cropXRelativeToImage + cropWidthRelativeToImage / 2;
      const cropCenterY = cropYRelativeToImage + cropHeightRelativeToImage / 2;
      
      // Calculate the crop area in the original image coordinates
      const dx = cropCenterX - centerX;
      const dy = cropCenterY - centerY;
      
      // Transform to rotated coordinates
      const rotatedDx = dx * cos + dy * sin;
      const rotatedDy = -dx * sin + dy * cos;
      
      sourceX = rotatedWidth / 2 + rotatedDx - cropWidthRelativeToImage / 2;
      sourceY = rotatedHeight / 2 + rotatedDy - cropHeightRelativeToImage / 2;
      sourceWidth = cropWidthRelativeToImage;
      sourceHeight = cropHeightRelativeToImage;
    }
    
    // Ensure crop area is within bounds
    sourceX = Math.max(0, Math.min(sourceX, rotatedWidth - sourceWidth));
    sourceY = Math.max(0, Math.min(sourceY, rotatedHeight - sourceHeight));
    sourceWidth = Math.min(sourceWidth, rotatedWidth - sourceX);
    sourceHeight = Math.min(sourceHeight, rotatedHeight - sourceY);
    
    // Draw cropped portion to main canvas
    ctx.drawImage(
      tempCanvas,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      crop.width,
      crop.height
    );
    
    // Convert to blob
    canvas.toBlob((blob) => {
      const croppedFile = new File([blob], selectedImage.name, {
        type: selectedImage.type,
        lastModified: Date.now(),
      });
      onImageCropped(croppedFile);
      onHide();
      toast.success('Profile picture updated successfully!');
    }, selectedImage.type, 0.9);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const resetImage = () => {
    setScale(1);
    setRotation(0);
    
    // Reset crop to center of container
    const containerWidth = containerRef.current?.offsetWidth || 400;
    const containerHeight = containerRef.current?.offsetHeight || 400;
    const cropSize = Math.min(containerWidth, containerHeight) - 40;
    
    const cropX = (containerWidth - cropSize) / 2;
    const cropY = (containerHeight - cropSize) / 2;
    
    setCrop({
      x: cropX,
      y: cropY,
      width: cropSize,
      height: cropSize
    });
    
    // Reset image position to center
    const imageX = (containerWidth - (imageSize.width * scale)) / 2;
    const imageY = (containerHeight - (imageSize.height * scale)) / 2;
    setImagePosition({ x: imageX, y: imageY });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column align-items-center">
          {/* File Upload */}
          {!selectedImage && (
            <div className="text-center mb-4">
                             <div 
                 className="upload-area p-4 mb-3"
                 style={{ 
                   minHeight: '200px',
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'center',
                   alignItems: 'center'
                 }}
               >
                <i className="fa-solid fa-cloud-arrow-up fs-1 text-muted mb-3"></i>
                <h5>Upload Profile Picture</h5>
                <p className="text-muted">Choose an image to upload and crop</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="form-control"
                  style={{ maxWidth: '300px' }}
                />
              </div>
            </div>
          )}

          {/* Image Cropper */}
          {selectedImage && (
            <>
                             <div 
                 ref={containerRef}
                 className="image-cropper-container mb-3"
                 style={{ 
                   width: '400px', 
                   height: '400px',
                   cursor: isDragging ? 'grabbing' : 'grab'
                 }}
                                   onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleMouseDown}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
               >
                                                   <img
                    ref={imageRef}
                    src={previewUrl}
                    alt="Preview"
                    className="cropper-image"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                      left: `${imagePosition.x}px`,
                      top: `${imagePosition.y}px`
                    }}
                  />
                
                                                  {/* Crop Overlay */}
                 <div
                   className="position-absolute border-3 border-primary"
                   style={{
                     left: `${crop.x}px`,
                     top: `${crop.y}px`,
                     width: `${crop.width}px`,
                     height: `${crop.height}px`,
                     pointerEvents: 'none',
                     boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                   }}
                 >
                   {/* Corner Handles */}
                   <div 
                     className="position-absolute bg-primary rounded-circle" 
                     style={{ 
                       width: '20px', 
                       height: '20px', 
                       top: '-10px', 
                       left: '-10px',
                       cursor: 'nw-resize',
                       pointerEvents: 'auto'
                     }}
                   ></div>
                   <div 
                     className="position-absolute bg-primary rounded-circle" 
                     style={{ 
                       width: '20px', 
                       height: '20px', 
                       top: '-10px', 
                       right: '-10px',
                       cursor: 'ne-resize',
                       pointerEvents: 'auto'
                     }}
                   ></div>
                   <div 
                     className="position-absolute bg-primary rounded-circle" 
                     style={{ 
                       width: '20px', 
                       height: '20px', 
                       bottom: '-10px', 
                       left: '-10px',
                       cursor: 'sw-resize',
                       pointerEvents: 'auto'
                     }}
                   ></div>
                   <div 
                     className="position-absolute bg-primary rounded-circle" 
                     style={{ 
                       width: '20px', 
                       height: '20px', 
                       bottom: '-10px', 
                       right: '-10px',
                       cursor: 'se-resize',
                       pointerEvents: 'auto'
                     }}
                   ></div>
                 </div>
              </div>

                             {/* Controls */}
               <div className="cropper-controls">
                 <button className="cropper-control-btn" onClick={handleZoomIn}>
                   <i className="fa-solid fa-search-plus"></i> Zoom In
                 </button>
                 <button className="cropper-control-btn" onClick={handleZoomOut}>
                   <i className="fa-solid fa-search-minus"></i> Zoom Out
                 </button>
                 <button className="cropper-control-btn" onClick={handleRotateLeft}>
                   <i className="fa-solid fa-rotate-left"></i> Rotate Left
                 </button>
                 <button className="cropper-control-btn" onClick={handleRotateRight}>
                   <i className="fa-solid fa-rotate-right"></i> Rotate Right
                 </button>
                 <button className="cropper-control-btn" onClick={resetImage}>
                   <i className="fa-solid fa-undo"></i> Reset
                 </button>
               </div>

               {/* Instructions */}
               <div className="cropper-instructions">
                 <p>Drag the image to reposition • Drag corner handles to resize crop area • Use controls to zoom and rotate</p>
               </div>
            </>
          )}

          {/* Hidden Canvas for Processing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        {selectedImage && (
          <Button variant="primary" onClick={handleCrop}>
            <i className="fa-solid fa-crop me-1"></i> Save Profile Picture
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ImageCropper; 