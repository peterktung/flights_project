#!/bin/bash
for i in `seq 1995 2008`;
do
    cat "${i}.csv" | cut -d, -f1,2,9,11,17,18,22 > "${i}_extract.csv"
done
