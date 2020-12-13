import React from 'react';
import './Robot.scss';

const Robot = ({isUploading, hasSomeImages}) => {
    const getRobotText = (isUploading, hasSomeImages) => {
        if(isUploading) {
            return 'Trying to guess...' 
        } else if (hasSomeImages) {
            return 'Here is your guess! Was I correct?'
        } else {
            return 'Welcome! I can guess an image, choose or capture'
        }
    }

    return (
        <div className={`robot-container ${isUploading && 'robot-container-uploading'} ${hasSomeImages && 'robot-container-result'} fadein`}>
            <div className="face">
                <div className="cloud">
                    <img className='cloud-image' src='/cloud.png'></img>
                    <div className="cloud-text">{getRobotText(isUploading, hasSomeImages)}</div>
                </div>
                <img className="santa-hat" src='/santa.png'></img>
            </div>
            <div className="head"></div>
            <div className="body"></div>
            <div className="left-hand"></div>
            <div className="right-hand"></div>
            <div className="eye1"></div>
            <div className="eye2"></div>
            <div className="leg1"></div>
            <div className="leg2"></div>
        </div>
    );
}

export default Robot;
