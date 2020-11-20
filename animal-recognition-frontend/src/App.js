import React, { Component } from 'react'
import Notifications, { notify } from 'react-notify-toast'
import Spinner from './Spinner'
import Images from './Images'
import Buttons from './Buttons'
import { API_URL } from './config'
import './App.css'

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

  onChange = e => {
    const errs = [] 
    const files = Array.from(e.target.files)

    if (files.length > 3) {
      const msg = 'Only 3 images can be uploaded at a time'
      return this.toast(msg, 'custom', 2000, toastColor)  
    }

    const formData = new FormData()
    const types = ['image/jpeg']

    files.forEach((file, i) => {

      if (types.every(type => file.type !== type)) {
        errs.push(`'${file.type}' is not a supported format`)
      }

      if (file.size > 150000) {
        errs.push(`'${file.name}' is too large, please pick a smaller file`)
      }

      formData.append(i, file)
    })

    console.log(files);

    if (errs.length) {
      return errs.forEach(err => this.toast(err, 'custom', 2000, toastColor))
    }

    this.setState({ 
      uploading: true,
      images: files.map((flie, index) => ({
        public_id: index,
        url: URL.createObjectURL(flie)
      }))
    })

    fetch(`${API_URL}/imageclassifier/predict`, {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok) {
        throw res
      }
      return res.json()
    })
    .then(results => {
      this.setState((prevState) => ({
        uploading: false,
        images: prevState.images.map((image, index) => ({
          ...image,
          predictedClass: predictionClasses[results[index].indexOf(Math.max.apply(Math, results[index]))] 
        }))
      }))
    })
    .catch(err => {
      err.json().then(e => {
        this.toast(e.message, 'custom', 2000, toastColor)
        this.setState({ uploading: false })
      })
    })
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
      switch(true) {
        case uploading:
          return <Spinner />
        case images.length > 0:
          return <Images 
                    images={images} 
                    removeImage={this.removeImage} 
                    onError={this.onError}
                 />
        default:
          return <Buttons onChange={this.onChange} />
      }
    }

    return (
      <div className='container'>
        <Notifications />
        <div className='buttons'>
          {content()}
        </div>
      </div>
    )
  }
}
