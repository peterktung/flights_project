/*
Draw the chart
*/
function draw(flightData) {
  "use strict";
  var margin = 75,
    topMargin = 25,
    bottomMargin = 40,
    width = 1400 - margin,
    height = 500 - topMargin - bottomMargin;

  //Create all the static elements of the graph (title, description, footnotes, etc)
  d3.select("body")
    .append("h2")
    .text("Air Dominance In the US (1995 - 2008)");

  d3.select("body")
    .append("p")
    .attr("id", "description")
    .html("This visualization shows the commerical airlines that " +
      "dominated the US market between the years 1995 to 2008 through the " +
      "number of flights each airline provide that year."+ "</br>" +
      "The size of the circle represents the size of the fleet of each " +
      "airline.");

  d3.select("body")
    .append("h3")
    .text("\u200C");


  d3.select("body")
    .append("div")
    .attr("id", "multi-cols");

  d3.select("#multi-cols")
    .append("div")
    .attr("id", "caption-div")
    .append("p")
    .attr("id", "caption")
    .text("\u200C");

  var interactions = d3.select("#multi-cols")
    .append("div")
    .append("p")
    .attr("class", "interactions");

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin)
    .attr("height", height + topMargin + bottomMargin)
    .append('g')
    .attr('class','chart');

  d3.select("body")
    .append("p")
    .attr("id", "footnote1")
    .attr("class", "footnote")
    .text("Ceased Operation");

    d3.select("body")
      .append("p")
      .attr("id", "footnote2")
      .attr("class", "footnote")
      .text("*Aloha Airlines filed for Chapter 11 in 2001, but emerged " +
            "from bankruptcy protection in 2006.\n" +
            " Hence the lack of data during the 2002 - 2005 time period");

  //Create y-axis (total flights) scale using the max total flights across all
  //years
  var flightsMax = d3.max(flightData, function(d) {
    return +d['Total_Flights'];
  });

  var flightsScale = d3.scaleLinear()
    .domain([0, flightsMax])
    .range([height, topMargin]);

  //sort carrier names so that it's case insensitive
  function carrierSort(a,b) {
    var aa = a.toLowerCase();
    var bb = b.toLowerCase();
    if (aa < bb)
      return -1;
    if (aa > bb)
      return 1;
    return 0;
  }

  // Create x-axis (carrier) scale
  var allCarriers = d3.set(flightData, function(d) {
    return d["Carrier"]
  })
  .values()
  .sort(function (a,b) {
    return carrierSort(a,b);
  });

  var carriersScale = d3.scalePoint()
    .domain(allCarriers)
    .range([margin, width]);

  //create scale of size of bubble based on active fleet size
  var aircraftsMax = d3.max(flightData, function(d) {
    return +d['n_aircrafts'];
  });

  var maxRadius = 30;
  var radius = d3.scaleSqrt()
    .domain([0, aircraftsMax])
    .range([0, maxRadius]);

  //Draw axes
  var flightsAxis = d3.axisLeft(flightsScale);
  var carriersAxis = d3.axisBottom(carriersScale);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', "translate(" +
                          Math.ceil(maxRadius) + "," + height + ")")
    .call(carriersAxis)
    .selectAll(".tick text")
    .call(wrap, carriersScale.step());

  svg.append("text")
    .attr("transform",
          "translate(" +
            (Math.ceil(maxRadius) + (margin + width / 2)) + ", " +
            (height + topMargin + 40) + ")")
    .style("text-anchor", "middle")
    .text("Airlines");

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', "translate(" + margin + ",0)")
    .call(flightsAxis);

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Total Flights");

  //https://bl.ocks.org/mbostock/7555321
  //This is used to create x-axis labels in multiple lines
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null)
                    .append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", dy + "em");
      text.attr("class", "xtext");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
                    .attr("x", 0)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
        }
      }
    });
  }

  // Get the year that a carrier has ceased operation or 2008 if carrier
  // is operating on (and beyond) 2008
  var carrier_max_year = d3.nest()
    .key(function(d) {
      return d.Carrier;
    })
    .sortKeys(function (a,b) {
      return carrierSort(a,b);
    })
    .rollup(function(d) {
      return d3.max(d, function(g) {
        return +g['Year'];
      });
    })
    .entries(flightData);

  var bubble = svg.append('g')
    .attr('class', 'bubble');

  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //Update the chart based on year, annotate is a flag to indicate
  //whether to provide a tool tip to each data point
  function update(year, annotate) {
    //update year sub header
    d3.select("h3")
      .text("(" + year + ")");

    //update color and strikeout of x-axis label if the carrier is
    //no longer in operation for the given year
    var xAxisText = svg.selectAll(".tick text.xtext")['_groups'][0];
    for (var i = 0; i < allCarriers.length; i++) {
      if (year > carrier_max_year[i].value) {
        xAxisText[i].classList.add("removed");
      }
      else {
        xAxisText[i].classList.remove("removed");
      }
    }

    //filter all the data for the given year
    var filtered = flightData.filter(function (d) {
      return +d['Year'] === year
    });

    var circles = bubble.selectAll('circle')
      .data(filtered, function(d){
        return d['Carrier'];
      });

    //remove all the bubbles for carriers that no longer exist.
    //use a transition so the bubble doesn't just simply disappear
    circles.exit()
      .transition()
      .duration(1000)
      .attr('cy', height)
      .attr('r', 0)
      .remove();

    //draw all new data points.
    //transition to the final position so the bubble doesn't just appear
    circles.enter()
      .append('circle')
      .attr('cx', function(d) {
        return carriersScale(d['Carrier']) + Math.ceil(maxRadius);
      })
      .attr('cy', height)
      .attr('r', 0)
      .transition()
      .duration(1000)
      .attr('cy', function(d) {
        return flightsScale(d['Total_Flights']);
      })
      .attr('r', function(d) {
        return radius(d['n_aircrafts']);
      });

    //move the circles that are still around from year to year
    circles.transition()
      .duration(1000)
      .attr('cy', function(d) {
        return flightsScale(d['Total_Flights']);
      })
      .attr('r', function(d) {
        return radius(d['n_aircrafts']);
      });

    //https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //http://stackoverflow.com/questions/20758373/inversion-with-ordinal-scale
    function getDomainIndex(rangeValue) {
      var i = 0;
      var step = carriersScale.step()
      for(i=0; rangeValue > ( margin + (step * i)); i++) {}
      return i-1;
    }

    // provide tooltip when we're not in animation
    if (annotate == true) {
      //add mouseover and mouseout events to add custom tooltip, change the color
      //of the selected circle, and bold the carrier for easier distinction
      bubble.selectAll('circle')
        .on("mouseover", function(d) {
          d3.select(this)
            .attr("fill", "blue");
          var i = getDomainIndex(d3.event.pageX);
          xAxisText[i].classList.add("x-selected");

          tooltip.transition()
           .duration(200)
           .style("opacity", .9);
          tooltip.html("Active Fleet Size: " + d['n_aircrafts'] + "<br/>" +
                       "Total Flights: " + numberWithCommas(d['Total_Flights']))
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .attr("fill", null);
          var i = getDomainIndex(d3.event.pageX);
          xAxisText[i].classList.remove("x-selected");
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
        });
    }
  }


  /*
    Create caption to show user the "Air Dominance" story
    Some captions (2002, 2008) only last one year, so pause animation a
     little longer to allow users to read the caption.
    isAnimation is a flag that indicates whether we should set a timeout
     depending on whether we are in the middle of animation.
  */
  var isPaused = false;
  var caption1 = "Up to 2001, commercial air travels have been dominated " +
    "by five airlines (American Airlines, Delta, Southwest Airlines, US " +
    "Airway, and United Air Lines).",
  caption2 = "After 9/11, the demand for flights saw a dip. One would " +
    "assume that lower demand in air travel would equate to a decrease " +
    "in the fleet size. However, the active fleet size actually saw an " +
    "increase that year.",
  caption3 = "In the years following, smaller commercial airlines began " +
    "to emerge to take a good part of the market shares from the " +
    "\"giants\".",
  caption4 = " During the \"Great Recession\", we see again a uniform " +
    "decline in air travels. It is interesting to note that Southwest " +
    "Airlines has risen up above the rest of the competition. Based on their " +
    "annual reports, this could possibly be attributed to their continual " +
    "expansion in flight paths as well as their competitive pricing."
  function updateCaption(year, isAnimation){
    if (year <= 2001) {
      d3.select("#caption")
        .text(caption1);
    }
    else if (year == 2002){
      d3.select("#caption")
        .text(caption2);
      if (isAnimation) {
        isPaused = true;
        setTimeout(function () {
          isPaused = false;
        }, 5000);
      }
    }
    else if (year <= 2007) {
      d3.select("#caption")
        .text(caption3);
    } else {
      d3.select("#caption")
        .text(caption4);
    }
  }

  var years = [...Array(14).keys()].map( function (x) {
    return 1995 + x;
  });

  // Since we allow users to replay the animation, we encapsulate the
  //animation logic into a function.  drawOnEnd is a flag that indicates whether
  //we draw the interactions (slider, button) at the end of the animation.
  function playAnimation(drawOnEnd) {
    // remove all data to restart animation
    svg.selectAll("circle").remove();

    // Disable the buttons and slider during animation
    if (!drawOnEnd) {
      d3.select("#yearSlider")
        .attr('disabled', true);

      d3.select("#replayButton")
        .attr('disabled', true);

      svg.selectAll(".tick text.xtext")['_groups'][0]
        .forEach( function (e) {
          e.classList.remove("removed");
        });
    }

    // create animation with an interval of 1.5 s per year of data
    var yearIdx = 0;
    var yearInterval = setInterval(function() {
      if (!isPaused) {
        update(years[yearIdx], false);
        updateCaption(years[yearIdx], true);

        yearIdx++;

        if (yearIdx >= years.length) {
          clearInterval(yearInterval);

          // this timeout is for the 2008 caption as it is the final year
          // of the animation and we want to give readers time to read
          setTimeout(function () {
            if (drawOnEnd) {
              drawInteractions();
            }
            else {
              var yearSlider = d3.select("#yearSlider")
              yearSlider.attr('disabled', null)
                .property('value', 2008);
              d3.select("#yearLabel").text('2008 ');
              update(2008, true);

              d3.select("#replayButton")
                .attr('disabled', null);
            }
          }, 3000);
        }
      }
    }, 1500);
  }

  // start the first animation
  playAnimation(true);

  // create the slider and button at the end of the first animation
  function drawInteractions() {
    // draw the slider and default to 2008 (where the animation ends)
    var yearInteraction = interactions.append('span')
      .attr('id', 'yearInteraction');

    var yearLabel = yearInteraction.append('label')
      .attr('for', 'yearSlider')
      .text('Year: ');

    var yearValue = yearInteraction.append('span')
      .attr('id', 'yearLabel')
      .text('2008 ');

    var yearSlider = yearInteraction.append('input')
      .attr('type', 'range')
      .attr('min', 1995)
      .attr('max', 2008)
      .attr('id', 'yearSlider')
      .property('value', 2008);

    update(2008, true);

    yearSlider.on("input", function() {
      updateYear(+this.value);
    });

    function updateYear(year) {
      yearSlider.property('value', year);
      yearValue.text(year);

      update(year, true);
      updateCaption(year, false);
    }

    // add replay button
    var replayInteraction = interactions.append('span')
      .attr('id', 'replayInteraction');
    var replay = replayInteraction.append('input')
      .attr('type', 'button')
      .attr('value', 'Replay')
      .attr('id', 'replayButton')
      .on('click', function() {
        playAnimation(false);
      });
  }
}
