import autosklearn
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

def select_columns(x_names, y_name):
    """
    :param x_names: list of string names of feature columns
    :param y_name: string name of target column
    :return: tuple, X matrix and y vector
    """