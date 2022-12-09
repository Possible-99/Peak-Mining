import pandas as pd               # Para la manipulación y análisis de datos
import json
import numpy as np                # Para crear vectores y matrices n dimensionales
import matplotlib.pyplot as plt   # Para la generación de gráficas a partir de los datos
import seaborn as sns             # Para la visualización de datos basado en matplotlib
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn import model_selection
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import roc_curve
from sklearn import metrics
#%matplotlib inline  


#Note: We get a lot of x and y values, create general func?
# Substitute series_to_dataframe
# Can we reduce copys of data_frame
# - Save the data_frame with all variables to_dict

# Every thing that we receive from the frontend should be a data_frame?

#################################### EDA

#return json in each function or when we have all the data in the main component function

# def series_to_dataframe(series, cols_names):
#     data_frame = series.to_frame().reset_index();
#     data_frame.columns = cols_names
#     return data_frame


# def null_values(data_frame):
#     null_table = data_frame.isnull().sum()
#     null_table = series_to_dataframe(null_table , ["Variable" , "Null count"])
#     return null_table


def conver_dataframe_to_json(data_frame):
    # Specify handler in case we have a strange object.
    return data_frame.to_json(orient = "records", default_handler = str)

def convert_to_json(data):
    return json.dumps(data)

def read_file(path):
    return pd.read_csv(path)

def series_to_dataframe(series, col_name , col_name2):
    return pd.DataFrame({col_name : series.index , col_name2 : series.values}) 




def data_description(data_frame):
    #Construct dataframe with info about the table and convert to json 
    data_description = pd.DataFrame(data_frame.columns, columns=['variables'])
    data_description["data_type"] = data_frame.dtypes.values
    data_description["null_count"] = data_frame.isnull().sum().values
    return conver_dataframe_to_json(data_description)

"""
histograms(data_frame) -> returns json in this format [{column_name : "name" , rows : [{name : "" , value: ""}]}]
"""
def histograms(data_frame):
    # Todo: Include the right limit, need to solve pandas interval problem.
    # Get the histogram of each variable
    histograms = []
    for column in data_frame.columns:
        data_type = data_frame.dtypes[column]
        # Only for the ones that have numeric values
        if(data_type == float or data_type == int):
            # Get the range and the count of the column
            column_hist = pd.cut(data_frame[column], 10).value_counts().sort_index()
            column_hist = pd.DataFrame({'value':column_hist.index, 'name': column_hist.values})
            #Get the limit of the histogram
            column_hist['value'] = column_hist['value'].apply(lambda x: x.left)
            ##Convert to dict , maybe create a funciton for to_dict and for formattin the dict of a col with his name.
            column_hist = column_hist.to_dict("records")
            histograms.append({"column_name" : column , "rows" : column_hist})
    histograms = json.dumps(histograms)
    return histograms


#TODO : Maybe create a util function for reutilizing the next 3 lines
def numerical_variables_stats(data_frame):
    stats_frame = data_frame.describe()
    #Added the stat name to data_frame
    stats_frame = stats_frame.rename_axis('measure').reset_index()
    return conver_dataframe_to_json(stats_frame)

def cathegorical_variables_stats(data_frame):
    stats_frame = data_frame.describe(include = "object")
    #Added the stat name to data_frame
    stats_frame = stats_frame.rename_axis('measure').reset_index()
    return conver_dataframe_to_json(stats_frame)



     

def cathegorical_cols_plots_values(data_frame , unique_values = 10):
    cols_plots_values = []
    for col in data_frame.select_dtypes(include='object'):
        if data_frame[col].nunique() < unique_values:
            col_frequencies = data_frame[col].value_counts()
            col_frequencies = series_to_dataframe(col_frequencies , "value" , "count")
            ## Use dict function?
            col_frequencies = col_frequencies.to_dict("records")
            ## Use a function for creating a dict format?
            cols_plots_values.append({"column_name": col , "rows" : col_frequencies})
    cols_plots_values = json.dumps(cols_plots_values)
    return cols_plots_values


def debug(data):
    print("==========================")
    print(data)
    print("==========================")


# TODO: Make a more optimal fucntion O(n ** 2), maybe a class with preprocessing?
def box_plot_values(data_frame):
    q1 = data_frame.quantile(0.25)
    median = data_frame.quantile(0.5)
    q3 = data_frame.quantile(0.75)
    IQR = q3 - q1 
    Lower_Fence = q1 - (1.5 * IQR)
    Upper_Fence = q3 + (1.5 * IQR)
    whisker_high = max(data_frame[data_frame<Upper_Fence])
    whisker_low = min(data_frame[data_frame>Lower_Fence])
    outliers = list(data_frame[data_frame < whisker_low])
    outliers.extend(list(data_frame[data_frame > whisker_high]))
    return {"low" : whisker_low , "q1" : q1, "median" : median , "q3" : q3 , "high" : whisker_high , "outliers" : outliers }

def box_plot(data_frame , atypicCols = []):
    if(atypicCols == []):
        atypicCols = data_frame.columns

    data_frame = data_frame.dropna()
    columns_box_plots = {}

    for col in atypicCols:
        data_type = data_frame.dtypes[col]
        if(data_type == float or data_type == int):
            values = box_plot_values(data_frame[col])
            columns_box_plots[col] = values
    
    return convert_to_json(columns_box_plots)


#TODO: Just get the lowe triangle part(space/time improv.)

def corr_table(data_frame):
    data_frame = data_frame.corr()
    return data_frame
    
    
def corr_heatmap_values(corr_matrix):
    # Flatter the data frame for {row , col , value} structure
    # Stack move the cols as rows
    heatmap_values = corr_matrix.stack().reset_index()
    heatmap_values.columns = ['row','col','value']
    return heatmap_values
        
###################################################################### PCA


def numeric_cols(data_frame):
    return data_frame.select_dtypes(include = ["float64" , "int64"])

def get_max_cols(data_frame):
    return data_frame.max().to_frame().T

# This is slow, maybe create a variance of a table where we have only not NAN values and numeric.
"""
    Returns a data_frame with the standarized matrix from the numeric cols of the given data_frame
"""
def standarized_matrix(numeric_cols):
    standarize = StandardScaler()
    matrix_stand = standarize.fit_transform(numeric_cols)  
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

###################################################################### PCA


###################################################################### Trees


def get_scatter_values(data_frame):
    return data_frame.to_dict("records")


"""
    Obtains cols of a data_frame and returns a ndarray
"""
def select_cols(data_frame, cols):
    return np.array(data_frame[cols])

    
def create_model(X , Y):
    return model_selection.train_test_split(X, Y, test_size = 0.2, random_state = 0, shuffle = True)


def create_df(col1 , col2):
    # print(col1 , col2)
    return pd.DataFrame({"Variable" : col1 , "Importance" : col2}).sort_values("Importance" , ascending = False)
        

"""
    Runs a tree classifier on the model and returns a list with
    tree_classification : Object 
    model_stats: Dict with most important stats 
"""
def get_models_stats(tree_classification, Y_validation , Y_tree_classification):
    model_stats = {}
    model_stats["criteria"] = tree_classification.criterion
    model_stats["cols_importance"] = tree_classification.feature_importances_
    model_stats["accuracy"] = accuracy_score(Y_validation, Y_tree_classification)
    model_stats["report"] = classification_report(Y_validation, Y_tree_classification)
    return model_stats


"""
    Runs a tree classifier on the model and returns a list with
    tree_classification : Object 
    model_stats: Dict with most important stats 
"""
def decision_trees(model , X):
    # Models creation , can we do it before?
    X_train, X_validation, Y_train, Y_validation = model
    #Decision trees
    tree_classification = DecisionTreeClassifier(max_depth=14, min_samples_split=4,min_samples_leaf=2, random_state=0)
    tree_classification.fit(X_train, Y_train)
    Y_tree_classification = tree_classification.predict(X_validation)
    # Get stats of the model
    model_stats = get_models_stats(tree_classification, Y_validation, Y_tree_classification)
    model_stats["cols_importance"] = create_df(X ,model_stats["cols_importance"], )
    return [tree_classification , model_stats]

def random_trees(model , X):
    # Models creation
    X_train, X_validation, Y_train, Y_validation = model
    #Decision trees with random method
    tree_classification = RandomForestClassifier(n_estimators=105, max_depth=7,min_samples_split=4, min_samples_leaf=2, random_state=1234)
    tree_classification.fit(X_train, Y_train)
    Y_tree_classification = tree_classification.predict(X_validation)
    # Get stats of the model
    model_stats = get_models_stats(tree_classification, Y_validation, Y_tree_classification)
    model_stats["cols_importance"] = create_df(X ,model_stats["cols_importance"])
    return [tree_classification , model_stats]


def make_prediction(classification ,params):
    value = classification.predict(pd.DataFrame(params))
    if value[0]:
        return True
    else:
        return False
    
    

data_frame = read_file("data/diabetes.csv")

# print(data_description(data_frame))

# histograms(data_frame)

# print(numerical_variables_stats(data_frame))


# box_plot(data_frame )

# print(cathegorical_variables_stats(data_frame))


# cathegorical_cols_plots_values(data_frame)

# debug(corr_heatmap_values(corr_table(data_frame)))


#PCA

#data_decription(data_frame)

# corr_table(data_frame)


#corr_heatmap_values()

#Stanarize data

# table_with_num_cols = numeric_cols(data_frame) 
# mx = standarized_matrix(table_with_num_cols) # This can also be the values for the scatter graph.
# comp = get_components(mx)
#components_variance_chart_val(comp)

# charge_table = component_charge_table(comp , table_with_num_cols)

# max_cols = get_max_cols(charge_table)
# debug(max_cols)



#AD y BA

#data_description

#get_scatter_values()

#numerical_values_stats

# corr_heatmap_values


# Get X and Y
X_variables =  ['Pregnancies',
                                                           'Glucose',
                                                           'BloodPressure',
                                                           'SkinThickness',
                                                           'Insulin',
                                                           'BMI',
                                                           'DiabetesPedigreeFunction',
                                                           'Age']
X = select_cols(data_frame ,X_variables)

Y = select_cols(data_frame, ["Outcome"])
model = create_model(X, Y)

classification, model_stats = decision_trees(model , X_variables)

random_classification, model_stats_random = random_trees(model ,X_variables)

print(make_prediction(random_classification, {'Pregnancies': [6], 'Glucose': [148], 'BloodPressure': [72], 'SkinThickness': [35], 'Insulin': [0],'BMI': [33.6], 'DiabetesPedigreeFunction': [0.627],
'Age': [50]}))