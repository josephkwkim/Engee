import pandas as pd
import csv
import numpy as np

def get_column_names(dataset):
    """
    :param dataset: pandas dataframe
    :return: list of column names.  If columns do not have names, raise exception
    """
    return list(dataset.columns)

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
    rows = dataset.head(30).values
    return [list(i) for i in rows]

def select_columns_X(x_names, dataset):
    """
    :param x_names: list of string names of feature columns
    :return: list, X matrix
    """
    x = dataset[x_names].values
    return list(x)

def select_column_y(y_name, dataset):
    """
    :param y_name: string name of target column
    :return: list, y vector
    """
    y = dataset[y_name].values
    return list(y)
