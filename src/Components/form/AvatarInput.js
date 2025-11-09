import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const AvatarInput = ({file, setFile}) => {
  const [preview, setPreview] = useState(null);

  //Handle on File change 
  const handleOnChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Update preview when file changes
  useEffect(() => {
    if (file) {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(file);
      }
    } else {
      setPreview(null);
    }
  }, [file]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        border: '2px dashed #e0e0e0',
        borderRadius: 2,
        backgroundColor: '#fafafa',
        minHeight: 200,
        position: 'relative'
      }}
    >
      {preview ? (
        <Avatar
          src={preview}
          alt="Preview"
          sx={{
            width: 130,
            height: 130,
            border: '3px solid #1976d2',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        />
      ) : (
        <Avatar
          sx={{
            width: 130,
            height: 130,
            bgcolor: '#e0e0e0',
            border: '3px dashed #999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CloudUpload sx={{ fontSize: 50, color: '#999' }} />
        </Avatar>
      )}
      
      <Box sx={{ textAlign: 'center' }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar-upload"
          type="file"
          onChange={handleOnChange}
        />
        <label htmlFor="avatar-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUpload />}
            sx={{
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Choose File
          </Button>
        </label>
        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
          {file ? file.name : 'No file chosen'}
        </Typography>
      </Box>
    </Box>
  );
};

export default AvatarInput;