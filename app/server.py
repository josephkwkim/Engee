from flask import *
from flask_cors import CORS

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from models.button_func import testFunc
from models.process_data import load_dataset, get_column_names, get_first_rows, select_columns_X, select_column_y

app = Flask(__name__)

CORS(app)

glob_df = None
glob_X = None
glob_y = None
glob_model = None

@app.route("/", methods=['POST'])
def process_page():
    global glob_df
    global glob_X
    global glob_y
    global glob_model

    rdata = request.get_json()
    print('\n', 'Flask Received:', rdata, '\n')

    ### Loading the Data ###
    if rdata['phase'] == 1:
        if rdata['name'] == "Selected Iris":  # -> Iris Dataset
            filename = rdata['file']
            df = load_dataset(filename)
        elif rdata['name'] == "Selected Own Data":  # -> User Dataset
            filename = rdata['file']
            default_path = "../data/"
            df = load_dataset(default_path + filename)
        else:
            resp = "1Huh? What is this?"

        glob_df = df
        column_names = get_column_names(df)
        first_rows = get_first_rows(df)

        resp = {'column_names': column_names, 'first_rows': first_rows}

    ### Confirming Features and Target ###
    elif rdata['phase'] == 2:
        if rdata['name'] == "Chose Features":  # -> Features
            X_names = rdata['features']
            glob_x = select_columns_X(X_names, glob_df)
            resp = "Received Features at BACK."
        elif rdata['name'] == "Chose Target":  # -> Target
            y_name = rdata['target'][0]
            glob_y = select_column_y(y_name, glob_df)
            resp = "Received Target at BACK."
        else:
            resp = "2Huh? What is this?"

    ### Selecting Prediction Model ###
    elif rdata['phase'] == 3:
        return 42

    print('Sent to JavaScript:', resp, jsonify(resp), '\n')
    return jsonify(resp)

"""
@app.errorhandler(404)
def not_found(error):
    print("LOL, you have been shutdown.")
    # return a view template here
"""

if __name__ == '__main__':
    app.run(host='localhost')
