import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

export default props => 
  props.images.map((image, i) =>
    <div key={i} className='fadein'>
      <div 
        onClick={() => props.removeImage(image.public_id)} 
        className='delete'
      >
        <FontAwesomeIcon icon={faTimesCircle} size='2x' />
      </div>
      <div className='image-container'>
        <img 
          className='guessed-image'
          src={image.url} 
          alt='' 
          onError={() => props.onError(image.public_id)}
        />
        <span className='predicted-class'>Our clever neural network says it is a {image.predictedClass}</span>
      </div>
    </div>
  )