import pandas as pd


#General
def data_description(data_frame):
    #Construct dataframe with info about the table
    data_description = pd.DataFrame(data_frame.columns, columns=['variables'])
    data_description["data_type"] = data_frame.dtypes.values
    data_description["null_count"] = data_frame.isnull().sum().values
    return data_description


#General
#TODO : Maybe create a util function for reutilizing the next 3 lines
def numerical_variables_stats(data_frame):
    stats_frame = data_frame.describe()
    #Added the stat name to data_frame
    stats_frame = stats_frame.rename_axis('measure').reset_index()
    return stats_frame
    

#TODO: Just get the lower triangle part(space/time improv.)
#General
def corr_table(data_frame):
    corr_table = data_frame.corr()
    return corr_table 
    
#General    
def corr_heatmap_values(corr_table):
    # Flatter the data frame for {row , col , value} structure
    # Stack move the cols as rows
    heatmap_values = corr_table.stack().reset_index()
    heatmap_values.columns = ['row','col','value']
    return heatmap_values