import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages, faCamera } from '@fortawesome/free-solid-svg-icons'
import Camera, { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

export default props => {
  const [isCapturingPicture, setIsCapturingPicture] = useState(false);

  const onImageCapture = (dataUrl) => {
    props.onImageCapture(dataUrl)
  }

  const buttons = (<div className='buttons fadein'>
    <div className='button'>
      <label onClick={() => setIsCapturingPicture(!isCapturingPicture)}>
        <FontAwesomeIcon icon={faCamera} color='#3B5998' size='10x' />
      </label>
    </div>
    <div className='button'>
      <label htmlFor='multi' className='button-icon' >
        <FontAwesomeIcon icon={faImages} color='#6d84b4' size='10x' />
      </label>
      <input type='file' name='files[]' id='multi' onChange={props.onFilesUpload} multiple />
    </div>
  </div>)

  const camera = (
    <div className='camera-container'>
      <Camera
        isImageMirror = {false}
        idealFacingMode = {FACING_MODES.ENVIRONMENT}
        onTakePhoto = {onImageCapture}
      />
    </div>
    
  )
  return (
    isCapturingPicture ? camera : buttons
  )
}
  