# Website "Animal Recognition"

## [Link to website](https://animal-recognition-app.herokuapp.com/)

#### Project description

This website is my universtiy project. It is the site to recognize the animal on the picture. Currently it can detect 10 types of animals: cows, dogs, butterflies, chickens, cows, elephants, horses, sheeps, spiders, squirrels.

#### How to run locally

##### 1. Prerequisites: Have Python, Conda, Node, NPM installed.
##### 2. Download training data and unpack it to the root folder of project from [here](https://drive.google.com/file/d/1cH3_BzWnkJTJDAFvJ8bIToTPApA5Cbyv/view?usp=sharing).
##### 2. Run `` conda env create --file envname.yml ``.
##### 3. Activate `` animal-recognition `` conda environment.
##### 4. Open ``model-training.ipynb`` in juputer notebook.
##### 5. Train model and save it for serving
##### 6. Serve application backend by executing ``bash serve-backend.sh``
##### 7. Serve frontend by running ``npm install`` and ``npm start`` inside ``animal-recognition-frontend`` folder
