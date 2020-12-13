import React, { Component } from 'react'
import Notifications, { notify } from 'react-notify-toast'
import Spinner from './components/Spinner'
import Images from './Images'
import ImageGetters from './ImageGetters'
import './App.scss'
import { predictImages } from './Api'
import Header from './components/Header'
import Robot from './components/Robot'
import Snow from './components/Snow'

const supportedTypes = ['image/jpeg', 'image/png'];
const toastColor = {
    background: '#505050',
    text: '#fff'
}

const predictionClasses = ['spider', 'cow', 'dog', 'butterfly', 'cat', 'elephant', 'chicken', 'sheep', 'squirrel', 'horse']

export default class App extends Component {

    state = {
        uploading: false,
        images: []
    }

    toast = notify.createShowQueue()

    onFilesUpload = async e => {
        try {
            const files = Array.from(e.target.files)
            const formData = new FormData()
            const errs = [];

            files.forEach((file, i) => {
                if (supportedTypes.every(type => file.type !== type)) {
                    errs.push({ message: `'${file.type}' is not a supported format` })
                }
        
                formData.append(i, file)
            })
        
            if (errs.length) {
                throw errs
            }

            const images = files.map((flie, index) => ({
                public_id: index,
                url: URL.createObjectURL(flie)
            }))

            await this.uploadFormData(formData, images);
        } catch (errs) {
            console.log(errs);
            this.handleErrors(errs);
        }
    }

    onImageCapture = async (dataUrl) => {
        try {
            const blob = dataURItoBlob(dataUrl);
            const formData = new FormData(document.forms[0]);
            formData.append("Image", blob);

            const images = [{
                public_id: 0,
                url: dataUrl
            }]

            await this.uploadFormData(formData, images);
        } catch (errs) {
            this.handleErrors(errs);
        }
    }

    uploadFormData = async (formData, images) => {
        this.setState({
            uploading: true,
            images
        });

        const results = await predictImages(formData);

        this.setState((prevState) => ({
            uploading: false,
            images: prevState.images.map((image, index) => ({
                ...image,
                predictedClass: predictionClasses[results[index].indexOf(Math.max.apply(Math, results[index]))]
            }))
        }))
    }

    handleErrors = (errs) => {
        if (Array.isArray(errs)) {
            errs.forEach((err) => {
                this.toast(err.message, 'custom', 2000, toastColor)
            })
        } else {
            this.toast(errs.message, 'custom', 2000, toastColor)
        }
        this.setState({ uploading: false })
    }

    filter = id => {
        return this.state.images.filter(image => image.public_id !== id)
    }

    removeImage = id => {
        this.setState({ images: this.filter(id) })
    }

    onError = id => {
        this.toast('Oops, something went wrong', 'custom', 2000, toastColor)
        this.setState({ images: this.filter(id) })
    }

    render() {
        const { uploading, images } = this.state

        const content = () => {
            switch (true) {
                case uploading:
                    return  (<div className='spinner-container'>
                        <Spinner />
                    </div>)
                case images.length > 0:
                    return (
                        <div className='images-container'>
                            <Images
                                images={images}
                                removeImage={this.removeImage}
                                onError={this.onError}/>
                        </div>
                    )
                default:
                    return <ImageGetters onFilesUpload={this.onFilesUpload} onImageCapture={this.onImageCapture}/>
            }
        }

        return (
            <div className='container'>
                <Snow />
                <Header />
                <Notifications />
                <div className='content' >
                    <Robot 
                        isUploading={this.state.uploading}
                        hasSomeImages={!!this.state.images.length}
                    />
                    {content()}
                </div > 
                <audio autoPlay>
                    <source src="bells.mp3" type="audio/mpeg" />
                    Your browser does not support the audio tag.
                </audio>
            </div>
        )
    }
}

// taken from https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}