from flask import *
from flask_cors import CORS
from models.button_func import testFunc

app = Flask(__name__)

CORS(app)

@app.route("/", methods=['POST'])
def hello_world():
    rdata = request.get_json()
    print('Flask Received:', rdata)

    resp = testFunc()
    print(jsonify(resp))
    return jsonify(resp)

"""
@app.errorhandler(404)
def not_found(error):
    print(error)
    print("LOL, you have been shutdown.")
    # return a view template here
"""

if __name__ == '__main__':
    app.run(host='localhost')
