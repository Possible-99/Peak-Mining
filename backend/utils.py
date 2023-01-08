import pandas as pd
import json
import numpy as np


def numeric_cols(data_frame):
    """
        Returns a data frame with numeric data types only
    """
    return data_frame.select_dtypes(include = ["float64" , "int64"])

def get_max_cols(data_frame):
    return data_frame.max().to_frame().T


def df_to_dict(dataframe):
    """
        Returns a dictionary of records
    """
    return dataframe.to_dict("records" , default_handler = str)
    
    
# def series_to_dataframe(series, cols_names):
#     data_frame = series.to_frame().reset_index();
#     data_frame.columns = cols_names
#     return data_frame


# def null_values(data_frame):
#     null_table = data_frame.isnull().sum()
#     null_table = series_to_dataframe(null_table , ["Variable" , "Null count"])
#     return null_table


def df_to_json(data_frame):
    # Specify handler in case we have a strange object.
    return data_frame.to_json(orient = "records", default_handler = str)

def convert_to_json(data):
    return json.dumps(data)

#TODO: Add support for csv, txt and xls.
def read_file(path):
    return pd.read_csv(path)

def series_to_dataframe(series, col_name , col_name2):
    return pd.DataFrame({col_name : series.index , col_name2 : series.values}) 

    
"""
    Obtains cols of a data_frame and returns a ndarray
"""
def select_cols(data_frame, cols):
    return np.array(data_frame[cols])

    
    
def create_df(col1 , col2):
    # print(col1 , col2)
    return pd.DataFrame({"Variable" : col1 , "Importance" : col2}).sort_values("Importance" , ascending = False)

    
    
def nparray_to_df(ndarray, cols):
    return pd.DataFrame(ndarray , columns = cols)

    
def dict_vals_to_dict(dict):
    """
    Converts dataframe values of a dictionary to dictionary.

    Args:
        dict (dictionary): String keys and some values as dataframse
    """

    for key in dict:
        val = dict[key]
        if isinstance(val, pd.DataFrame ):
            dict[key] = df_to_dict(val)
    return dict

def dict_vals_to_json(dict):
    """
    Converts dataframe values of a dictionary to dictionary.

    Args:
        dict (dictionary): String keys and some values as dataframse
    """

    for key in dict:
        val = dict[key]
        if isinstance(val, pd.DataFrame ):
            dict[key] = df_to_json(val)
    return dict