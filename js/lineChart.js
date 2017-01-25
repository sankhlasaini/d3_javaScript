
		var outerWidth = 1400;
		var outerHeight = 500;

		var margin = { left: 400, top: 50, right: 300, bottom: 100 };
		var innerWidth = outerWidth - margin.left - margin.right;
		var innerHeight = outerHeight - margin.top - margin.bottom;

		var xScale = d3.scale.linear().range([0, innerWidth]);

		var yScale = d3.scale.linear().range([innerHeight, 0]);

		var color = d3.scale.ordinal().domain(["1","2","3","4"]).range([ "#ff4444", "#44ff7c","#faff82","#4286f4"]);


		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(16);
		var yAxis = d3.svg.axis().scale(yScale).orient("left");
		
		var line = d3.svg.line()
		//.interpolate("basis")
		.x(function(d) { return xScale(d.Year); })
		.y(function(d) { return yScale(d.assault); });

		var svg = d3.select("body").append("svg")
		.attr("width", outerWidth)
		.attr("height", outerHeight)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.json("../data/data_crime_2.json", function(data) 
		{

			color.domain(d3.keys(data[0]).filter(function(key) 
				{ return key !== "Year"; }));


			var assault_arrest = color.domain().map(function(name) 
			{
				return {
					name: name,
					values: data.map(function(d) {
						return {Year: d.Year, assault: +d[name]};
					})
				};
			});


  
			xScale.domain(d3.extent(data, function(d) { return d.Year; }));

			yScale.domain([0,d3.max(assault_arrest, function(c) { return d3.max(c.values, function(v) { return v.assault; }); })
				]);

			var xAxisLabelText = "Year";
			var xAxisLabelOffset = 60;

			var yAxisLabelText = "Assault Cases";
			var yAxisLabelOffset = 100;


			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + innerHeight + ")")
			.call(xAxis)
			.append("text")
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



			var cases = svg.selectAll(".cases")
			.data(assault_arrest)
			.enter().append("g")
			.attr("class", "cases");

			cases.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) { return color(d.name); });

			cases.append("text")
			.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 2]}; })
			.attr("transform", function(d) { return "translate(" + xScale(d.value.Year) + "," + yScale(d.value.assault) + ")"; })
			.attr("x", 3)
			.attr("dy", ".35em")
			.attr("class", "cases")
			.text(function(d) { return d.name; });

		});
