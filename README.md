## Summary
The visualization was meant to show the approximate market share (using number of flights provided) and size (using active fleet size) of different commerical airlines through the period between 1995 to 2008. Readers should see trends based on specific events during this time period (9/11 and the Great Recession).
This visualization was derived from the US flight data obtained the [ASA](http://stat-computing.org/dataexpo/2009/the-data.html).

## Design
I chose to use a mix between a bar char and a bubble chart to show the changes in both the total flights provided (y-axis) from year to year as well as the change in the airline's size (bubble size). A slider as was added at the end of the animation to allow users to choose the year axis themselves an allowd them to explore the data further. I felt that this was a better mechanism than using a series of buttons.

## Feedback
### Feedback 1

* Brief description to explain the visualization and the size of the circles.
* Add longer pause to some explanations.
* Add replay capability.

### Feedback 2
* Smooth out the animation for each transistion.
* Increase the size of the y-axis to make each transistion look clearer.

### Feedback 3
* Move the subtitle and put it in the middle of the graph next to a start button so the viewer can start it when they're ready
* Show the top 8-9 airlines individually and then aggregate all the other small ones into an additional single point. That could help cut down on complexity.
* Moving the slider around somehow triggered most of the airlines to turn red.

## Resources

* https://bl.ocks.org/mbostock/7555321 (multiple line axis labels)
* http://stackoverflow.com/questions/20758373/inversion-with-ordinal-scale
* https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
