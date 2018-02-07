from process_data import *
from all_models import *

def test_classifiers():
    dataset = "../../data/iris.csv"

    data = load_dataset(dataset)

    (x,y) = get_relevant_dataset(list(data.columns[:-1]), str(data.columns[-1]), data)

    cols, model = get_models(x, y, regression = False)

    print(cols)
    return model




