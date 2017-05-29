library(reshape2)
suppressMessages(library(dplyr))

all_flights <- read.csv("data/final.csv")
carriers <- read.csv("data/carriers.csv", stringsAsFactors = F, na.strings = c("NULL"))

#US Airways (US) merge with American West (HP) in 09/2005, but they both continued to report their own numbers
#until 10/2007.  For the purposes of this visual, we will update the numbers based on when the merger
#happened.
HP_filter1 <- (all_flights$Year > 2005 & all_flights$UniqueCarrier == "HP")
HP_filter2 <- (all_flights$Year == 2005 & all_flights$Month >= 9 & all_flights$UniqueCarrier == "HP")
all_flights[HP_filter1, ]$UniqueCarrier <- "US"
all_flights[HP_filter2, ]$UniqueCarrier <- "US" 

carriers[carriers$Code == "US", ]$Description <- "US Airways Inc."
carriers[carriers$Code == "HP", ]$Description <- "America West Airlines Inc."
all_non_cancelled_flights <- all_flights %>%
  filter(Cancelled == 0) %>%
  group_by(Year, UniqueCarrier) %>%
  summarise(n_aircrafts = n_distinct(TailNum),
            Total_Flights = n()) %>%
  arrange(Year, UniqueCarrier)

flight_summary <- merge(all_non_cancelled_flights, carriers, 
                        by.x = "UniqueCarrier", by.y = "Code")[c("Year", "UniqueCarrier", 
                                                                 "n_aircrafts", "Total_Flights", "Description")]

#Aloha Airlines filed for Chapter 11 in 2001, but emerged from bankruptcy protection in 2006.
#See https://en.wikipedia.org/wiki/Aloha_Airlines#Economic_challenges
#We will fill the gap between 2001 and 2006 with 0's.
flight_summary = rbind(flight_summary, c(2002, 'AQ', 0, 0, 'Aloha Airlines Inc.'))
flight_summary = rbind(flight_summary, c(2003, 'AQ', 0, 0, 'Aloha Airlines Inc.'))
flight_summary = rbind(flight_summary, c(2004, 'AQ', 0, 0, 'Aloha Airlines Inc.'))
flight_summary = rbind(flight_summary, c(2005, 'AQ', 0, 0, 'Aloha Airlines Inc.'))

#Append an asterix for a footnote in the visualization
flight_summary[flight_summary$Carrier == 'Aloha Airlines Inc.',]$Carrier = 'Aloha Airlines Inc.*'

write.csv(file="data/flight_summary.csv", flight_summary, row.names = F)