import pandas as pd
import csv

def get_column_names(filename):
    """
    Takes in a file to a dataset (must be .csv) and returns the column names.
    Intended to let the user choose which variable they want to predict.
    :param filename:
    :return: list of column names.  If columns do not have names, raise exception
    """
    with open(filename) as file:
        reader = csv.reader(file)
        cols = next(reader)
        file.close()

    return cols

def load_dataset(filename):
    '''
    :param filename: name or path of file to be loaded (.csv)
    :return: pandas dataframe representing the spreadsheet
    '''
    return pd.read_csv(filename)

def get_first_rows(dataset):
    '''
    :param dataset: pandas dataframe (not separated into x and y yet)
    :return: first 30 rows of the dataframe as a numpy ndarray
    '''
    return dataset.head(30).values

def select_columns(x_names, y_name, dataset):
    """
    :param x_names: list of string names of feature columns
    :param y_name: string name of target column
    :return: tuple, X matrix and y vector
    """
    y = dataset[y_name].values
    x = dataset.drop([y_name], axis=1).values
    return x, y

