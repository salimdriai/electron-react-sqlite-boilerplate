import React from 'react';
import Button from '@mui/material/Button';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface Props {
  setCamera: (args: {
    open: boolean;
    photo: undefined | string | Buffer;
  }) => void;
}

function TakePhoto({ setCamera }: Props) {
  const takePhoto = async () => {
    const canvas = document.createElement('canvas');
    const video = document.getElementById('video');

    canvas.width = 400;
    canvas.height = 400;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(
      video as CanvasImageSource,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const photo = canvas.toDataURL('image/jpeg');
    setCamera({ open: false, photo });
  };

  return (
    <>
      <video
        style={{ transform: 'scaleX(-1)' }}
        id="video"
        height="400"
        width="400"
        autoPlay
      >
        <track kind="captions" label="camera" />
      </video>
      <Button
        onClick={takePhoto}
        startIcon={<PhotoCameraIcon />}
        variant="contained"
      >
        Take photo
      </Button>
    </>
  );
}

export default TakePhoto;
