var width=document.getElementById("map-container").offsetWidth,
	height=document.getElementById("map-container").offsetHeight;
var projection = d3.geo.mercator()
				   .center([107,31])
				   .scale(600)
				   .translate([width/2,height/2])

var path = d3.geo.path()
				.projection(projection)

var color = d3.sc