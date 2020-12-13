
import base64
import json
from io import BytesIO
import numpy as np  
import cv2 
import requests
from flask import Flask, request, jsonify, send_from_directory
from tensorflow.keras.applications import inception_v3
from tensorflow.keras.preprocessing import image
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__, static_folder='animal-recognition-frontend/build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')



def centering_image(img):
    size = [256,256]
    
    img_size = img.shape[:2]
    
    row = (size[1] - img_size[0]) // 2
    col = (size[0] - img_size[1]) // 2
    resized = np.zeros(list(size) + [img.shape[2]], dtype=np.uint8)
    resized[row:(row + img.shape[0]), col:(col + img.shape[1])] = img

    return resized

CORS(app)

@app.route('/hello/', methods=['GET', 'POST'])
@cross_origin()
def hello_world():
    return 'Hello, World!'


@app.route('/imageclassifier/predict', methods=['POST'])
@cross_origin()
def image_classifier():
    images = []
    for i, file in enumerate(request.files.values()):
        print(file)
        filestr = file.read()
        npimg = np.fromstring(filestr, np.uint8)
        # convert numpy array to image
        img = cv2.imdecode(npimg, cv2.IMREAD_UNCHANGED)

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        if(img.shape[0] > img.shape[1]):
            tile_size = (int(img.shape[1]*256/img.shape[0]),256)
        else:
            tile_size = (256, int(img.shape[0]*256/img.shape[1]))

        img = centering_image(cv2.resize(img, dsize=tile_size))

        img = img[16:240, 16:240]
        images.append(img)

    images = np.array(images)

    data = json.dumps({"signature_name": "serving_default", "instances": images.tolist()})

    # # Creating payload for TensorFlow serving request
    payload = {
        "instances": [{'input_image': img}]
    }
    headers = {"content-type": "application/json"}

    # # Making POST request
    json_response = requests.post('http://localhost:8501/v1/models/saved_model:predict', data=data, headers=headers)

    predictions = json.loads(json_response.text)['predictions']

    # # Returning JSON response to the frontend
    return jsonify(predictions)
    return 'Hello, World!'
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ['PORT'])