import React, { useState, useRef } from 'react';

const EnhancedFileUpload = ({ onFileSelect, accept = ".csv" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={`file-upload-area ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      
      <div className="upload-content">
        <div className="upload-icon">📁</div>
        <div className="upload-text">
          {fileName ? (
            <div>
              <strong>Selected: {fileName}</strong>
              <p>Click to change file</p>
            </div>
          ) : (
            <div>
              <strong>Drop your CSV file here</strong>
              <p>or click to browse</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedFileUpload;