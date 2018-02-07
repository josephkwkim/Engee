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

def get_relevant_dataset(x, y, dataset):
    '''
    :param x: list of strings of x-columns
    :param y: string with name of y-column
    :param dataset: pandas dataframe
    :return: x ndarray and y ndarray
    '''
    assert(isinstance(x, list))
    assert(isinstance(y, str))
    df_x = dataset[x]
    df_y = dataset[y]
    return df_x.values, df_y.values