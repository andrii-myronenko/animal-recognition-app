#!/bin/bash

eval "$(conda shell.bash hook)"
conda activate animal-recognition

tensorflow_model_server --rest_api_port=8501 --model_name=saved_model --model_base_path="$(pwd)/serve/";