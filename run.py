from flask import Flask
app = Flask(__name__)

dir = ''

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/")
def index1():
    print('hello')

@app.route('/data', methods=['POST'])
def index():
    rdata = request.get_json() # { gameID: 3843, time: 3839, quarter: 29823434}
    print('received request', rdata)
    return jsonify(find_shot_df(rdata))

def startup():
    global shot_df
    shotFile = dir + "shotlogwa.csv"
    shot_df = pd.read_csv(shotFile)

    # print(shot_df.head())
	print(shot_df.dtypes)
    shot_df = shot_df.sort_values(['GAME_ID', 'GAME_CLOCK'], ascending=[True, False])

if __name__ == "__main__":
    app.run()