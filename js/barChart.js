		var outerWidth = 1400;
		var outerHeight = 500;
		var margin = { left: 400, top: 50, right: 300, bottom: 100 };
		var barPadding=.4;

		var innerWidth  = outerWidth  - margin.left - margin.right;
		var innerHeight = outerHeight - margin.top  - margin.bottom;


		var xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);

		var yScale = d3.scale.linear().range([innerHeight, 0]);

		var color = d3.scale.ordinal().domain(["1","2","3","4"]).range([  "#4286f4","#44ff7c","#ff4444","#faff82"]);

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
		.outerTickSize(0);

		var yAxis = d3.svg.axis().scale(yScale).orient("left")
		.outerTickSize(0);

		var svg = d3.select("body").append("svg")
		.attr("width", outerWidth)
		.attr("height", outerHeight)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		d3.json("../data/data_crime_1.json", function(data) 
		{

			color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

			data.forEach(function(d) 
			{
				var y0 = 0;
				d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
				d.total = d.ages[d.ages.length - 1].y1;
			});

			xScale.domain(data.map(function(d) { return d.Year; }));
			yScale.domain([0, d3.max(data, function(d) { return d.total; })]);

			var xAxisLabelText = "Year";
			var xAxisLabelOffset = 50;

			var yAxisLabelText = "THEFT CASES";
			var yAxisLabelOffset = 70;

			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + innerHeight + ")")
			.call(xAxis)
			.append("text")
			.attr("class", "smallText")
			.style("text-anchor", "middle")
			.attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
			.attr("class", "label")
			.text(xAxisLabelText);

			svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.style("text-anchor", "middle")
			.attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
			.attr("class", "label")
			.text(yAxisLabelText);

			var state = svg.selectAll("Year")
			.data(data)
			.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) { return "translate(" + xScale(d.Year) + ",0)"; });

			state.selectAll("rect")
			.data(function(d) { return d.ages; })
			.enter().append("rect")
			.attr("width", xScale.rangeBand())
			.attr("y", function(d) { return yScale(d.y1); })
			.attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
			.style("fill", function(d) { return color(d.name); });

			var legend = svg.selectAll(".legend")
			.data(color.domain().slice().reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			legend.append("rect")
			.attr("x", innerWidth - 18)
			.attr("width", 10)
			.attr("height", 18)
			.style("fill", color);

			legend.append("text")
			.attr("x", innerWidth - 24)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("text-anchor", "end")
			.text(function(d) { return d; });


		});
