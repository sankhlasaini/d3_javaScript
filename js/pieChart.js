		var outerWidth = 1400;
		var outerHeight = 500;

		var margin = { left: 500, top: 50, right: 400, bottom: 100 };
		var innerWidth = outerWidth - margin.left - margin.right;
		var innerHeight = outerHeight - margin.top - margin.bottom;

		var radiusMax = 180;

		var xColumn = "name";
		var sliceSizeColumn = "count";
		var colorColumn = "crime";

		var xAxisLabelText = "Crime - 2015";
		var xAxisLabelOffset = 60;




		var svg = d3.select("body").append("svg")
		.attr("width",  outerWidth)
		.attr("height", outerHeight);
		var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var xAxisG = g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + innerHeight + ")");
		var pieG = g.append("g");

		var xAxisLabel = xAxisG.append("text")
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
		.attr("class", "label")
		.text(xAxisLabelText);


		
		var xScale = d3.scale.ordinal().rangePoints([0, innerWidth]);
		var colorScale = d3.scale.ordinal().domain(["1","2","3","4"]).range([ "#ff4444", "#44ff7c","#faff82","#4286f4"]);

		var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
		.outerTickSize(0);

		var pie = d3.layout.pie();
		var arc = d3.svg.arc();
		arc.outerRadius(radiusMax);
		arc.innerRadius(0);

		var colorLegendG = g.append("g")
		.attr("class", "color-legend")
		.attr("transform", "translate(-20,0)");

		var colorLegend = d3.legend.color()
		.scale(colorScale)
		.shapePadding(3)
		.shapeWidth(10)
		.shapeHeight(25)
		.labelOffset(10);




		d3.json("../data/data_crime_3.json", function(data)
		{
			xScale.domain(data.map( function (d){ return d[xColumn]; }));
			colorScale.domain(data.map(function (d){ return d[colorColumn]; }));
			pie.value(function(d) { return d[sliceSizeColumn]; });

			xAxisG.call(xAxis);



			var pieData = pie(data);

			pieG.attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");

			var slices = pieG.selectAll("path").data(pieData);
			slices.enter().append("path");
			slices
			.attr("d", arc)
			.attr("fill", function (d){ return colorScale(d.data[colorColumn]); });
			slices.exit().remove();

			colorLegendG.call(colorLegend);

		});

