import pandas as pd               # Para la manipulación y análisis de datos
import numpy as np                # Para crear vectores y matrices n dimensionales
from sklearn import model_selection
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report
from sklearn.tree import DecisionTreeRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor
from utils import create_df
#%matplotlib inline  



tree_algorithm = {"prediction" : [DecisionTreeRegressor , RandomForestRegressor] , "classification" : [DecisionTreeClassifier , RandomForestClassifier] }





def get_scatter_values(data_frame):
    return data_frame.to_dict("records")


    
def create_model(X , Y , test_size = 0.2):
    return model_selection.train_test_split(X, Y, test_size = test_size, random_state = 0, shuffle = True)


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
    # model_stats["report"] = classification_report(Y_validation, Y_tree_classification , output_dict = False)
    # model_stats["report"] = model_stats["report"].values()
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

def tree_train(model , X , tree_algorithm):
    # Models creation
    X_train, X_validation, Y_train, Y_validation = model
    #Decision trees with random method
    #tree_algorithm = RandomForestClassifier(n_estimators=105, max_depth=7,min_samples_split=4, min_samples_leaf=2, random_state=1234)
    tree_algorithm.fit(X_train, Y_train)
    Y_tree_classification = tree_algorithm.predict(X_validation)
    # Get stats of the model
    model_stats = get_models_stats(tree_algorithm, Y_validation, Y_tree_classification)
    model_stats["cols_importance"] = create_df(X ,model_stats["cols_importance"])
    return [tree_algorithm , model_stats]
    

def make_prediction(classification ,params):
    value = classification.predict(pd.DataFrame(params))
    if value[0]:
        return True
    else:
        return False