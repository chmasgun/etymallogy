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

sys.path.append(r'C:\Users\muratcan.asgun\Desktop\github\etymallogy')

words_json_path = r'C:\Users\muratcan.asgun\Desktop\github\etymallogy\public\data.json'
relations_json_path = r'C:\Users\muratcan.asgun\Desktop\github\etymallogy\public\relations.json'

f= open(words_json_path, encoding='utf-8')
words_json = json.load(f)
f= open(relations_json_path, encoding='utf-8')
relations_json = json.load(f)


for i,doc in enumerate(  words_json):
#    doc["id"] = i
    doc["rel"] = {}
    doc["rel"]["derives"] = {}
    doc["rel"]["loans"] = {}
    doc["rel"]["homonym"] = {}
    
relations_all = ["derives" , "loans", "homonym"]

def extract_relation(rel): # to do: instead of first found relation, gather them together
    for x in relations_all:
        if x in rel.keys():
            return {"id":rel["id"], "to":rel[x]["to"]}
        
        
for rel in relations_json:
    for x in relations_all:
        if x in rel.keys():
            if "to" in rel[x].keys():
                words_json[rel["id"]]["rel"][x]["to"] =  rel[x]["to"]
                for target in  rel[x]["to"]:
                    words_json[target]["rel"][x]["from"] = rel["id"]
   
    
    
    
########## CLUSTER ASSIGNMENT ##########
cluster_now = 0
relations_sorted = sorted(relations_json, key=lambda x : x["id"])
relations_extracted = [extract_relation(x) for x in relations_sorted]
cluster_id_dict={}
id_cluster_dict={}
 
   
for rel in relations_extracted :
    ids_all = rel["to"].copy()
    ids_all.append(rel["id"])
    if any([x in id_cluster_dict.keys() for x in ids_all]):
        already_assigned_clusters = set([id_cluster_dict.get(x) for x in ids_all if x in id_cluster_dict.keys()])
        min_assigned_cluster = min(already_assigned_clusters) #excluding None
        non_existing_ids=[x for x in ids_all if x not in id_cluster_dict.keys() ]
        for idnow in non_existing_ids: #change dicts for non-existing id
            id_cluster_dict[idnow] = min_assigned_cluster
            cluster_id_dict[min_assigned_cluster].append(idnow)
        
        values_all = [ cluster_id_dict[x] for x in already_assigned_clusters ] 
        values_all = [x for y in values_all for x in y]
        values_all.sort()
        for clusternow in already_assigned_clusters: #delete previously assigned clusters to unify them
            del cluster_id_dict[clusternow]
        cluster_id_dict[min_assigned_cluster] = values_all
        for idnow in values_all: #rewrite clusters for ids
            id_cluster_dict[idnow] = min_assigned_cluster
            
    else:
        for idnow in ids_all:
            id_cluster_dict[idnow] = cluster_now
        cluster_id_dict[cluster_now] = ids_all
        cluster_now = cluster_now + 1
        
        
########################################    
########## ROOT FINDING ##########   

root_id_to_cluster_dict = id_cluster_dict.copy()    
for rel in relations_extracted: 
    for idnow in rel["to"]:  # delete every "to" value, which would eventually spare roots only
        del root_id_to_cluster_dict[idnow]    
    
########## DEPTH CALCULATION ##########  TO DO handle multiple root
depth_dict ={}
parent_dict = {}
rel_to_pos = { x["id"]:i for i,x in enumerate(relations_extracted)}
for root_now in root_id_to_cluster_dict.keys():
    
    depth_now = 0
    depth_dict[root_now] = depth_now
    relation_now = relations_extracted[rel_to_pos[root_now]].copy()
    values_to_check = relation_now["to"].copy()
    parent_dict = { x:root_now for x in values_to_check}
    #parents_of_values = [root_now] * len(values_to_check)
    while len(values_to_check) > 0:
         
        root_x = values_to_check.pop(0)
        parent_now = parent_dict[root_x]
        depth_dict[root_x] = depth_dict[parent_now] + 1 
        if root_x in rel_to_pos.keys():
            new_go_to = relations_extracted[rel_to_pos[root_x]]["to"]
            values_to_check.extend(new_go_to)
            for idnow in new_go_to:
                parent_dict[idnow] = root_x
    
    
    
    
    
    
########## WRITE CLUSTER AND DEPTH VALUES ########## 
for word_now in words_json:
    idnow = word_now["id"]
    depthnow = depth_dict.get(idnow)
    clusternow = id_cluster_dict.get(idnow)
    word_now["cluster"] =clusternow
    word_now["depth"] =depthnow
    
with open(words_json_path, 'w', encoding='utf-8') as file:
        json.dump(words_json, file, ensure_ascii=False, indent=4)
    