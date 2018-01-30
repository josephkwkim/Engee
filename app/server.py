from flask import *
from flask_cors import CORS

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from models.button_func import testFunc

app = Flask(__name__)

CORS(app)

@app.route("/", methods=['POST'])
def process_page():
    rdata = request.get_json()
    print('\n', 'Flask Received:', rdata, '\n')

    if rdata['name'] == "Simple Regression from FRONT":
        # -> From LinReg
        resp = testFunc()
    elif rdata['name'] == "Neural Network from FRONT":
        # -> From NeuNet
        resp = np.array([0, 1, 2, 3]).tolist()
    else:
        resp = "Huh? What is this?"

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
