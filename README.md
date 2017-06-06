## Summary
The visualization was meant to show the approximate market share (using number of flights provided) and size (using active fleet size) of different commerical airlines through the period between 1995 to 2008. Readers should see trends based on specific events during this time period (9/11 and the Great Recession).
This visualization was derived from the US flight data obtained the [ASA](http://stat-computing.org/dataexpo/2009/the-data.html).

## Design
I chose to use a mix between a bar chart and a bubble chart to show the changes in both the total flights provided (y-axis) from year to year as well as the change in the airline's size (bubble size). A slider as was added at the end of the animation to allow users to choose the year axis themselves an allowd them to explore the data further. I felt that this was a better mechanism than using a series of buttons.  
Many of the initial feedback received had to do with improving the story telling aspect such as adding a brief description to explain the visualization, and adding longer pauses and ability to replay the animation.  These were all implemented into the visualization.  
Other feedback included cosmetics changes to improve the visual appeal.  While I did implement a smoother animation, I decided against increasing the size of the graphic the graphic was quite large already, and making it any bigger would make viewing the graphic difficult on a single screen. I also chose not move the subtitle into the middle of the graph as one reviewer suggested because the graph was quite dynamic and there is no appropriate place to put the subtitles in the graph without overlapping the data.  
Another feedback was to consolidated some of the smaller carriers and aggregate the numbers.  While that would cut down on the complexity and the size of the graph, I felt that doing so would obscure the story I was trying to convey where a group of smaller carriers began to emerge and capture a sizable market share from the big airlines.  
Finally, a reviewer found a bug where the x-axis labels were incorrectly being marked red (indicating a carrier that has ceased operations), which was promptly fixed.

### Additional Changes
After initial submission, there was additional [feedback](#Feedback-4) from the instructor.  Most of the feedback was implemented, including:

* explicitly listed all the initial carrier that were dominant.
* added explanation on Southwest Airline's dominance in the story.
* re-positioned the slider and button so that it is more visible.
* continued to display all the captions outside of the animation.
* increased the font size of the caption.
* added a custom tooltip (the initial implementation uses the inherent "title" attribute but the effects are browswer dependent).
* added a bold text effect on hover of data points.
* reduced the size of the circles to de-emphasize the importance of the fleet size.

I did not, however, change the color or style of the caption fonts as it shifted the attention away from the graph.  I also did not add any visual encoding to emphasize dominant airlines as I felt that readers should explore for themselves what is "dominant", perhaps fleet size could be a factor in dominance?

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

### Feedback 4
* Clarify story by explicitly listing the initial dominant airlines and explain the Southwest story.
* Reduce the range of the bubble size to make fleet size less prominent since it does not add to the story.
* Re-position slider and button to be more visible at the end.
* Continue displaying captions during interactions.
* Add tooltip on hover.
* Make carrier selection bold on hover of data point
* Center caption text, increase text font and color
* Add visual encoding for "dominant" airlines

## Resources

* https://bl.ocks.org/mbostock/7555321 (multiple line axis labels)
* http://stackoverflow.com/questions/20758373/inversion-with-ordinal-scale
* https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
