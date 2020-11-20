
import base64
import json
from io import BytesIO

import numpy as np  
import cv2 
import requests
from flask import Flask, request, jsonify
from tensorflow.keras.applications import inception_v3
from tensorflow.keras.preprocessing import image
from flask_cors import CORS, cross_origin

# from flask_cors import CORS

# run nohup to start tensorflow model server

#saved_model_cli show --dir /home/andrii/VSCodeWorkspace/animal-recognition-app/serve/1 --all
#nohup tensorflow_model_server --rest_api_port=8501 --model_name=saved_model --model_base_path="/home/andrii/VSCodeWorkspace/animal-recognition-app/serve/" >server.log 2>&1

app = Flask(__name__)

def centering_image(img):
    size = [256,256]
    
    img_size = img.shape[:2]
    
    row = (size[1] - img_size[0]) // 2
    col = (size[0] - img_size[1]) // 2
    resized = np.zeros(list(size) + [img.shape[2]], dtype=np.uint8)
    resized[row:(row + img.shape[0]), col:(col + img.shape[1])] = img

    return resized

# Uncomment this line if you are making a Cross domain request
CORS(app)

# Testing URL
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
    print('Data: {} ... {}'.format(data[:50], data[len(data)-52:]))

    # # Creating payload for TensorFlow serving request
    payload = {
        "instances": [{'input_image': img}]
    }
    headers = {"content-type": "application/json"}

    # # Making POST request
    json_response = requests.post('http://localhost:8501/v1/models/saved_model:predict', data=data, headers=headers)

    print(json.loads(json_response.text))

    predictions = json.loads(json_response.text)['predictions']

    # # Returning JSON response to the frontend
    return jsonify(predictions)
    return 'Hello, World!'
    