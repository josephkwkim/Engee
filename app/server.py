from flask import *
from flask_cors import CORS

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from models.button_func import testFunc
from models.process_data import load_dataset, get_column_names, get_first_rows

app = Flask(__name__)

CORS(app)

@app.route("/", methods=['POST'])
def process_page():

    rdata = request.get_json()
    print('\n', 'Flask Received:', rdata, '\n')

    ### Loading the Data ###
    if rdata['phase'] == 1:
        if rdata['name'] == "Selected Iris":  # -> Iris Dataset
            filename = rdata['file']
            df = load_dataset(filename)
        elif rdata['name'] == "Selected Own Data":  # -> User Dataset
            filename = rdata['file']
            df = load_dataset(filename)
        else:
            resp = "1Huh? What is this?"

        column_names = get_column_names(df)
        first_rows = get_first_rows(df)

        resp = {'column_names': column_names, 'first_rows': first_rows}

    ### Confirming Features and Target ###
    elif rdata['phase'] == 2:
        if rdata['name'] == "Confirmed Features and Target":  # -> Features and Target
            X_text = rdata['features']
            X_names = X_text.split(",")
            y_name = rdata['target']
            resp = "Features: " + X_text + "\nTarget: " + y_name
        else:
            resp = "2Huh? What is this?"

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
