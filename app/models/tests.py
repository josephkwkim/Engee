from process_data import *
from all_models import *

def test_regressors():
    dataset = "../../data/iris.csv"

    data = load_dataset(dataset)

    (x,y) = select_columns(data.columns[:-2], data.columns[-2], data)

    d = Dataset(x,y)
    return d.neural_network_regressor()
