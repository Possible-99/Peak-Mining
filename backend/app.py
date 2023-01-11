#Note: We get a lot of x and y values, create general func?
# Substitute series_to_dataframe
# Can we reduce copys of data_frame
# - Save the data_frame with all variables to_dict

# Every thing that we receive from the frontend should be a data_frame?

from flask import Flask , request
from werkzeug.utils import secure_filename

import general_analysis
from utils import read_file , numeric_cols, get_max_cols , df_to_dict , nparray_to_df, select_cols, dict_vals_to_json , df_to_json
from pandas import read_csv
import pca
import eda
import trees
import json



app = Flask(__name__)
ALLOWED_EXTENSIONS = {'txt', 'csv', 'xlx'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

           
def proccess_file(request):
    if 'file' not in request.files:
        return 
    file = request.files['file']
    if file and allowed_file(file.filename):
        return file


@app.route("/api/eda", methods = ["POST"])
def eda_analysis():
    file = proccess_file(request)
    if file: 
        data_frame = read_file(file)
        #Data frame
        description = general_analysis.data_description(data_frame)
        #Array
        histograms = eda.histograms_columns(data_frame)
        #Data frame
        num_var_stats= general_analysis.numerical_variables_stats(data_frame)
        #Dict
        box_plots = eda.box_plots(data_frame)
        #Frame
        cathegorical_cols_stats = eda.cathegorical_variables_stats(data_frame)
        #Array
        cathegorical_cols_plots = eda.cathegorical_cols_plots_values(data_frame)
        #Frame
        corr_table = general_analysis.corr_table(data_frame)
        #Frame
        heat_map = general_analysis.corr_heatmap_values(corr_table)

        
        return {
            "table" : df_to_json(data_frame),
            "description": df_to_json(description),
            "histogramColumns" : histograms,
            "numVarStats": df_to_json(num_var_stats),
            "boxPlots": box_plots,
            "cathegoricalColsStats" : df_to_json(cathegorical_cols_stats),
            "cathegoricalColsPlots" : cathegorical_cols_plots,
            "corrTable": df_to_json(corr_table),
            "heatMap" : df_to_json(heat_map)
        }

    return "try later or verify file characteristics" , 400

    
@app.route("/api/pca", methods = ["POST"])
def pca_analyisis():
    file = proccess_file(request)
    if file:
        data_frame = read_file(file)
        description = general_analysis.data_description(data_frame)
        corr_table = general_analysis.corr_table(data_frame)
        #Frame
        heat_map = general_analysis.corr_heatmap_values(corr_table)
        table_with_num_cols = numeric_cols(data_frame) # This can also be the values for the scatter graph.
        stand_matrx = pca.standarized_matrix(table_with_num_cols) 
        comp = pca.get_components(stand_matrx)
        comp_chart_vals = pca.components_variance_chart_val(comp)
        charge_table = pca.component_charge_table(comp , table_with_num_cols)
        max_cols = get_max_cols(charge_table)
        
        return {
            "table" : df_to_json(data_frame),
            "description": df_to_json(description),
            "corrTable" : df_to_json(corr_table),
            "heatMap" : df_to_json(heat_map),
            "standMatrix" : df_to_json(nparray_to_df(stand_matrx , table_with_num_cols.columns)),
            "compChartVals" : comp_chart_vals,
            "chargeTable" : df_to_json(charge_table) , 
            "maxCols" : df_to_json(max_cols)
        }
    return "try later or verify file characteristics" , 400

@app.route("/api/components", methods = ["POST"])
def trees_analysis():
    file = proccess_file(request)
    print(request.form)
    X_variables = json.loads(request.form['xVariables'])
    Y_variable = json.loads(request.form["yVariable"])
    algorithm = json.loads(request.form["algorithm"])
    if file and X_variables and Y_variable:
        data_frame = read_file(file)

        # Select variables
        X = select_cols(data_frame ,X_variables)

        Y = select_cols(data_frame, Y_variable)
        model = trees.create_model(X, Y)

        #Pick algorithm
        decision_tree , random_trees = trees.tree_algorithm[algorithm]
        decision_tree = decision_tree(max_depth=14,  min_samples_split=4, min_samples_leaf=2, random_state=0)
        random_trees= random_trees(n_estimators=105, max_depth=7,min_samples_split=4, min_samples_leaf=2, random_state=1234)

        decision_model, model_stats_d = trees.tree_train(model , X_variables , decision_tree)
        random_model, model_stats_r = trees.tree_train(model , X_variables , random_trees)


        return {
            "modelStatsDecision" : dict_vals_to_json(model_stats_d),
            "modelStatsRandom" : dict_vals_to_json(model_stats_r)
        }

    return "try later or verify file characteristics and arguments" , 400



@app.route("/api/general_analysis", methods = ["POST"])
def general_stats():
    file = proccess_file(request)
    if file:
        data_frame = read_file(file)
        description = general_analysis.data_description(data_frame)
        num_cols= list(numeric_cols(data_frame).columns)
        num_var_stats= general_analysis.numerical_variables_stats(data_frame)
        corr_table = general_analysis.corr_table(data_frame)
        heat_map = general_analysis.corr_heatmap_values(corr_table)

        return{
            "table" : df_to_json(data_frame),
            "description": df_to_json(description),
            "corrTable" : df_to_json(corr_table),
            "heatMap" : df_to_json(heat_map),
            "numVarStats" : df_to_json(num_var_stats),
            "numericCols": num_cols 
        }

    return "try later or verify file characteristics and arguments" , 400

def debug(data):
    print("==========================")
    print(data)
    print("==========================")


