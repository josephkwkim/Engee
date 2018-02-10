import pandas as pd
import csv
import numpy as np

def clear_txt(fpath):
    with open(fpath, 'w') as file:
        file.close()

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
    code = '''import pandas as pd\n
    dataframe = pd.read_csv('{}')
    '''.format(filename.split('/')[-1])
    with open('views/output/code.txt', 'w') as file:
        file.write(code)
        file.close()
    return pd.read_csv(filename)

def get_first_rows(dataset):
    '''
    :param dataset: pandas dataframe (not separated into x and y yet)
    :return: first 30 rows of the dataframe as a numpy ndarray
    '''
    rows = dataset.head(30).values
    return [list(i) for i in rows]

