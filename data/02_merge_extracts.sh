#!/bin/bash
head -1 2008_extract.csv > final.csv

for i in `seq 1995 2008`; 
do 
    sed 1d "${i}_extract.csv" >> final.csv; 
    rm "${i}_extract.csv"
done
