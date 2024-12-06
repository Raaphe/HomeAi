import os

os.environ['KAGGLE_USERNAME'] = "raaphe"
os.environ['KAGGLE_KEY'] = "b0a7e8b0023236b5e5af4a3190fe8d3b"

from kaggle import api

api.authenticate()

api.dataset_download_files('ahmedshahriarsakib/usa-real-estate-dataset', './src/data/datasets', unzip=True)