#!/bin/bash

eval "$(conda shell.bash hook)"
conda activate animal-recognition

export FLASK_APP=server.py
export FLASK_ENV=development
flask run --eager-loading