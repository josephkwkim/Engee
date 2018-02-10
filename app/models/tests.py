from process_data import *
from all_models import *

test_split = 0.2
random_state = 69

def test_classifiers():
    dataset = "../../data/iris.csv"

    data = load_dataset(dataset)

    cols, model = get_models(list(data.columns[1:2]), str(data.columns[-1]), data, test_split, regression = False)

    test_model = 'Logistic Regression'
    print(predict([1], test_model, model))
    return run_model(test_model, model)

def test_regressors():
    dataset = "../../data/housing.csv"

    data = load_dataset(dataset)

    cols, model = get_models(list(data.columns[1:-1]), str(data.columns[-1]), data, test_split, regression = True)

    test_model = "Linear Regression"

    return run_model(test_model, model)

print(test_regressors())
