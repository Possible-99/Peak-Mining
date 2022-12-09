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