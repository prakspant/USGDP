d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(function(data) {
        data = data.data;
        console.log(data);
        const margin = {top: 20, right: 20, bottom: 30, left: 40};
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // set up the scales
        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        // set up the axes
        const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat('%Y'));
        const yAxis = d3.axisLeft(y);

        // create the SVG element and set up the chart group
        const svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // set the domains of the scales
        x.domain(d3.extent(data, function(d) { return new Date(d[0]); }));
        y.domain([0, d3.max(data, function(d) { return d[1]; })]);

        // add the axes
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .attr('id', 'x-axis')
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr('id', 'y-axis')
            .call(yAxis);

        // add the bars
        svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(new Date(d[0])); })
        .attr("width", 3) // set a fixed width for each bar
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return height - y(d[1]); })
        .attr("data-date", function(d) { return d[0]; })
        .attr("data-gdp", function(d) { return d[1]; })
        .on("mouseover", function(event, d) {
            d3.select('body')
                .append('div')
                .attr('id', 'tooltip')
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 30) + "px")
                .style("display", "inline-block")
                .attr("data-date", d[0])
                .html("Year: " + d[0] + "<br>" + "GDP: " + d[1]);
        })
        .on("mouseout", function(d) {
            d3.select("#tooltip").remove();
        });
    });
