import pandas as pd               # Para la manipulación y análisis de datos
from utils import series_to_dataframe


#return json in each function or when we have all the data in the main component function

# """
# histograms(data_frame) -> returns array with dicts in this format [{column_name : "name" , rows : [{name : "" , value: ""}]}]
# """
# def histograms(data_frame):
#     # Todo: Include the right limit, need to solve pandas interval problem.
#     # Get the histogram of each variable
#     histograms = []
#     for column in data_frame.columns:
#         data_type = data_frame.dtypes[column]
#         # Only for the ones that have numeric values
#         if(data_type == float or data_type == int):
#             # Get the range and the count of the column
#             column_hist = pd.cut(data_frame[column], 10).value_counts().sort_index()
#             column_hist = pd.DataFrame({'value':column_hist.index, 'name': column_hist.values})
#             #Get the limit of the histogram
#             column_hist['value'] = column_hist['value'].apply(lambda x: x.left)
#             ##Convert to dict , maybe create a funciton for to_dict and for formattin the dict of a col with his name.
#             column_hist = column_hist.to_dict("records")
#             histograms.append({"column_name" : column , "rows" : column_hist})
#     return histograms

#Changed to only send the numerical cols names so we can render the histograms in frontend with table
def histograms_columns(data_frame):
    # Todo: Include the right limit, need to solve pandas interval problem.
    # Get the histogram of each variable
    hist_columns = []
    for column in data_frame.columns:
        data_type = data_frame.dtypes[column]
        # Only for the ones that have numeric values
        if(data_type == float or data_type == int):
            hist_columns.append(column)
    return hist_columns


# Modified for handling empty data_frame
def cathegorical_variables_stats(data_frame):
    stats_frame = data_frame.select_dtypes(include ="object")
    print(stats_frame)
    if not stats_frame.empty:
        stats_frame = stats_frame.describe()
        #Added the stat name to data_frame
        stats_frame = stats_frame.rename_axis('measure').reset_index()
        return stats_frame
    return pd.DataFrame()



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
    return cols_plots_values




# TODO: Make a more optimal fucntion O(n ** 2), maybe a class with preprocessing?
def box_plot_values(data_frame):
    q1 = data_frame.quantile(0.25)
    median = data_frame.quantile(0.5)
    q3 = data_frame.quantile(0.75)
    IQR = q3 - q1 
    Lower_Fence = q1 - (1.5 * IQR)
    Upper_Fence = q3 + (1.5 * IQR)
    whisker_high = max(data_frame[data_frame<=Upper_Fence])
    whisker_low = min(data_frame[data_frame>=Lower_Fence])
    outliers = list(data_frame[data_frame < whisker_low])
    outliers.extend(list(data_frame[data_frame > whisker_high]))
    return {"low" : whisker_low , "q1" : q1, "median" : median , "q3" : q3 , "high" : whisker_high , "outliers" : outliers }

def box_plots(data_frame , atypicCols = []):
    if(atypicCols == []):
        atypicCols = data_frame.columns

    data_frame = data_frame.dropna()
    columns_box_plots = []

    for col in atypicCols:
        data_type = data_frame.dtypes[col]
        if(data_type == float or data_type == int):
            values = box_plot_values(data_frame[col])
            values["column"] = col
            columns_box_plots.append(values)
    
    return columns_box_plots

