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

sys.path.append(r'C:\Users\muratcan.asgun\Desktop\github\etymallogy')

#words_json_path = r'C:\Users\muratcan.asgun\Desktop\github\etymallogy\public\data.json'
#relations_json_path = r'C:\Users\muratcan.asgun\Desktop\github\etymallogy\public\relations.json'

#f= open(words_json_path, encoding='utf-8')
#words_json = json.load(f)
#f= open(relations_json_path, encoding='utf-8')
#relations_json = json.load(f)


keys_path = "C:/Users/muratcan.asgun/Desktop/lang-platform/passwords.keys"
with open(keys_path) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    keys = {rows[0]: rows[1] for rows in csv_reader}
        
    
relations_all = ["derives" , "loans", "homonym"]

uri = "mongodb+srv://"+keys["mongodb_user"]+":"+keys["mongodb_pw"]+"@mongodblanguage.vbeft0s.mongodb.net"
client = pymongo.MongoClient(uri)
db = client["etymallogy_clusters"]
clusters = db["cluster_data"]
cluster_data = list(clusters.find())

[ [y["key"],y["lang"],x["cid"]]   for x in cluster_data for y in x["words"]]
