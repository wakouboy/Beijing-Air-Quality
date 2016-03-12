

bar()

function bar(){

var places=["东四","天坛","官园","万寿西宫","奥体中心","农展馆","万柳","北部新区","植物园","丰台花园",
"云岗","古城","房山","大兴","亦庄","通州","顺义","昌平","门头沟","平谷","怀柔","密云","延庆","定陵","八达岭","密云水库","东高村",
"永乐店","榆垡","琉璃河","前门","永定门内","西直门北","南三环","东四环"]
var pinyin=["dongsi","tiantan","guanyuan","wanshouxigong","aotizhongxing","nongzhanguan","wanliu","beibuxingqu","zhiwuyuan","fentaihuayuan",
"yungang","gucheng","fangshan","daxing","yizhuang","tongzhou","shunyi","changping","mengtougou","pinggu","huairou","miyun","yanqing","dingling","badaling",
"miyunshuiku","donggaocun","yongledian","yufa","liulihe","qianmeng","yongdingmengxi","xizhimengbei","nansanhuan","dongsihuan"]


document.getElementById("bar").innerHTML=''
var bwidth=document.getElementById("bar").offsetWidth,
	bheight=document.getElementById("bar").offsetHeight;


var bmargin={left:70,top:5,right:5,bottom:5}

var bsvg=d3.select("#bar").append("svg")
		  .attr("width",bwidth)
		  .attr("height",bheight)
		  .append("g")
		  .attr("transform", "translate(" + bmargin.left + "," + bmargin.top + ")");

var bwidth=bwidth-bmargin.left-bmargin.right;
var bheight=bheight-bmargin.top-bmargin.bottom;






var by = d3.scale.ordinal()
    .rangeRoundBands([bheight,0], .1);

var bx = d3.scale.linear()
    .rangeRound([0,bwidth]);

var bcolor = d3.scale.ordinal()
    .range([ "#542788", "#c51b7d", "red", "orange", "yellow", "#91cf60"]);

var byAxis = d3.svg.axis()
    .scale(by)
    .orient("left")
    .outerTickSize(0)


var bdata;

var sortval=function(a, b) { return (a.days[index].y1-a.days[index].y0) - (b.days[index].y1-b.days[index].y0); }

d3.csv("AQIlevel.csv", function(error, data) {
  if (error) throw error;
  bcolor.domain(d3.keys(data[0]).filter(function(key) { return key !== "place"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.days = bcolor.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    //d.total = d.ages[d.ages.length - 1].y1;
  });
  //console.log(data);
  data.sort(sortval);
  //data.sort(function(a, b) { return b.total - a.total; });

  by.domain(data.map(function(d) { return places[pinyin.indexOf(d.place)]; }));
  bx.domain([0, 730]);


  bsvg.append("g")
      .attr("class", "y axisbar")
      .attr("id","axisbar")
      .call(byAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".51em")
      .style("text-anchor", "end")



  bsvg.selectAll('.tick')
    .on('click',function(d){
    	

    	var circleColorStart="#7fcdbb";
		var circleColorEnd="#2c7fb8";
    	 chosenplace=pinyin[places.indexOf(d)]

    	d3.selectAll(".tick").style("fill","")

    	d3.select(this).style("fill",circleColorEnd);


    	 var bcc=d3.select("#map-container").selectAll(".circle")
	       .transition()
	       .duration(500)
	       .delay(50)
	       .attr("fill",circleColorStart)
	       .attr("stroke","none")
	       .attr("r",6)
      // console.log(bcc);
	    		     	bcc.filter(function(d){
	    		     		// 	console.log(d.name)
	    		     		return pinyin[places.indexOf(d.name)]==chosenplace;


	    		     	})
	    		     	  .transition()
	    		     	  .duration(500)
	    		     	  .delay(50)
	    		     	  .attr("stroke","blue")
	    		     	  .attr("fill",circleColorEnd)
	    		     	  .attr("r",8)

	     //console.log(chosenplace)
	     calendarChange()
	     linechange()
	     change()
    });
    

  var place = bsvg.selectAll(".place")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(0," + by(places[pinyin.indexOf(d.place)]) + ")"; });

  place.selectAll(".rect")
      .data(function(d) { return d.days; })
      .enter().append("rect")
      .attr("height", by.rangeBand())
      .attr("x", function(d) { return bx(d.y0); })
      .attr("width", function(d) { return bx(d.y1)-bx(d.y0); })
      .style("fill", function(d) { return bcolor(d.name); })
      .append("title")
      .text(function(d){
      	return d.y1-d.y0;
      })



});
}


