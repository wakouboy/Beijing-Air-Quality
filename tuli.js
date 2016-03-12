
tuli()
function tuli(){
var width=document.getElementById("tuli").offsetWidth
var height=document.getElementById("tuli").offsetHeight
var margin={top:10,left:5,right:2 ,bottom:3}

var svg=d3.select("#tuli").append("svg")
		.attr("height",height)
		.attr("width",width)
var contxt=svg.append("g")
		.attr("transform","translate("+margin.left+","+margin.top+")");

var recw=15,rech=15;

var step=10
var color=["#f0f0f0","#91cf60",
"yellow",
"orange",
"red",
"#c51b7d",
"#542788",
]
var labels=["严重污染(>300)","重度污染(201-300)","中度污染(151-200)","轻度污染(101-150)","良(51-100)","优(0-50)","没有数据"]
var t_inds = [];
for(var i=0;i<7;i++){
	t_inds.push(i);
}
	contxt.selectAll(".myRect")
	.data(t_inds)
	.enter()
	.append("rect")
	   .attr("x",0)
	   .attr("y",function(d){return d*recw})
	   .attr("fill",function(d){return color[6-d]})
	   .attr("width",recw)
	   .attr("height",rech)
	   .on("click",function(d){
	   	  
	   	  //var index=$(this).attr("fill")
	   	  index=d;
	   	  if(index<6){
	   		bar();
	   		}
	   })

for(var i=0;i<7;i++){
	contxt.append("text")
	   .attr("x",recw+1)
	   .attr("y",recw*i+12)
	   .text(labels[i])
	   .attr("font-family", "sans-serif")
				.attr("text-anchor", "left")
				.attr("font-size", "12px");

	contxt.append("text")
		  .attr("x",recw+1)
		  .attr("y",recw*9+12)
		  .text("AQI 日历")
		  .attr("font-family", "sans-serif")
				.attr("text-anchor", "left")
				.attr("stroke","grey")
				.attr("fill","grey")
				.attr("font-size", "17px");

}
}