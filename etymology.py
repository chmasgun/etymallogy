# -*- coding: utf-8 -*-
"""
Created on Mon Jul  1 17:54:06 2024

@author: muratcan.asgun
"""


import pandas as pd
import math
import json
import sys
import os
import csv
import pymongo
from datetime import datetime

sys.path.append(r'C:\Users\muratcan.asgun\Desktop\github\etymallogy')


today_date = datetime.today().strftime('%Y%m%d')
backup_json_path = r'C:\Users\muratcan.asgun\Desktop\github\etymallogy\public\dataBackup\dataFromDB'+today_date+'.json'
#relations_json_path = r'C:\Users\muratcan.asgun\Desktop\github\etymallogy\public\relations.json'

#f= open(words_json_path, encoding='utf-8')
#words_json = json.load(f)
#f= open(relations_json_path, encoding='utf-8')
#relations_json = json.load(f)


keys_path = "C:/Users/muratcan.asgun/Desktop/lang-platform/passwords.keys"
with open(keys_path) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    keys = {rows[0]: rows[1] for rows in csv_reader}
       
   
relations_all = ["derives", "loans", "homonym"]

uri = "mongodb+srv://"+keys["mongodb_user"]+":"+keys["mongodb_pw"]+"@mongodblanguage.vbeft0s.mongodb.net"
client = pymongo.MongoClient(uri)
db = client["etymallogy_clusters"]
clusters = db["cluster_data"]
word_data_collection = db["word_data"]
cluster_data = list(clusters.find())

cluster_data = [ {"cid":x["cid"], "words":x["words"]} for x in cluster_data]


with open(backup_json_path, 'w', encoding='utf-8') as file:
    json.dump(cluster_data, file, ensure_ascii=False, indent=4) 
    
############## KEY GENERATION PART
word_data = [ [y["key"],y["lang"],x["cid"]]   for x in cluster_data for y in x["words"]]
word_dict = {}
for word in word_data:
    key= word[0][0:3].lower()
    if key in word_dict.keys():
        word_dict[key].extend([word])
    else:
        word_dict[key] = [word]
        
        
word_data_push = [{"key": x, "data" : word_dict[x]} for x in  word_dict.keys()]
for i in word_data_push :
    word_data_collection.replace_one({"key": i["key"]}, i, upsert = True)
##########################################
    
flat_data = [   y      for x in cluster_data for y in x["words"]] 
cid_data = [   x["cid"]    for x in cluster_data for y in x["words"]] 
 
data_df = pd.DataFrame(flat_data)    
data_df["cid_data"] = cid_data    

 