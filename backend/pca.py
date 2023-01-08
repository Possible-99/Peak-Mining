import pandas as pd               # Para la manipulación y análisis de datos
import numpy as np                # Para crear vectores y matrices n dimensionales
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
#%matplotlib inline  





# This is slow, maybe create a variance of a table where we have only not NAN values and numeric.
"""
    Returns a data_frame with the standarized matrix from the numeric cols of the given data_frame
"""
def standarized_matrix(numeric_cols):
    standarize = StandardScaler()
    matrix_stand = standarize.fit_transform(numeric_cols.dropna())  
    return matrix_stand


"""
    Obtain the components of the standarized matrix, returns a data_frame
"""
def get_components(matrix_stand):
    components = PCA(n_components = None)    
    components.fit(matrix_stand)          
    return components

def components_variance_chart_val(components):
    cumulative_variances = np.cumsum(components.explained_variance_ratio_)
    comp_chart_val = []
    for idx , cum_variance in enumerate(cumulative_variances):
        comp_chart_val.append({ "number_components": idx + 1 , "variance" : cum_variance})
    return comp_chart_val


"""
    Get component charges table, returns a DataFrame
"""
def component_charge_table(components , matrix_stand):
    charge_table = pd.DataFrame(abs(components.components_), columns = matrix_stand.columns)
    return charge_table
