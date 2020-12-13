#!/bin/bash

eval "$(conda shell.bash hook)"
conda activate animal-recognition

python3 server.py