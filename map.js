
click()
function click(){

	places=["东四","天坛","官园","万寿西宫","奥体中心","农展馆","万柳","北部新区","植物园","丰台花园",
	"云岗","古城","房山","大兴","亦庄","通州","顺义","昌平","门头沟","平谷","怀柔","密云","延庆","定陵","八达岭","密云水库","东高村",
	"永乐店","榆垡","琉璃河","前门","永定门内","西直门北","南三环","东四环"]
	place='dongsi,tiantan,guanyuan,wanshouxigong,aotizhongxing,nongzhanguan,wanliu,beibuxingqu,zhiwuyuan,fentaihuayuan,yungang,gucheng,fangshan,daxing,yizhuang,tongzhou,shunyi,changping,mengtougou,pinggu,huairou,miyun,yanqing,dingling,badaling,miyunshuiku,donggaocun,yongledian,yufa,liulihe,qianmeng,yongdingmengxi,xizhimengbei,nansanhuan,dongsihuan'
    place=place.split(',')
    //console.log(place)
	var width  =document.getElementById("map-container").offsetWidth,
		 height = document.getElementById("map-container").offsetHeight;
   // console.log(width)
   // console.log(height)
	var name
	var zoom = d3.behavior.zoom()
			     .scaleExtent([1, 10])
			     .on("zoom", zoomed);

	var svg = d3.select("#map-container").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(20,20)")
	    .call(zoom);
	function zoomed() {
		d3.select(this).attr("transform", 
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}			
	
	var projection = d3.geo.mercator()
						.center([116, 40])
						.scale(10000)
    					.translate([width/3.2, height/1.8]);

	var path = d3.geo.path()
					.projection(projection);
	d3.json("beijing.json", function(error, root) {
		
		if (error) 
			return console.error(error);
		//console.log(root.features);
		
		var graphColor=d3.rgb(236,226,240);
		var textColor=d3.rgb(117,107,177);
		var monitorColor=d3.rgb(117,107,177);
		var border=d3.rgb(229,245,224);
		var circleColorStart="#7fcdbb";
		var circleColorEnd="#2c7fb8";
		svg.selectAll("path")
			.data(root.features )
			.enter()
			.append("path")
			.attr("stroke","white")
			.attr("stroke-width",1)
			.attr("fill", graphColor)
			.attr("d", path )

		var cirleName = svg.append("g")
		               .attr("class","cirleName");
		//var peking =[117.0923,40.5121]
		//var proPeking=projection(peking)
		cirleName.selectAll("circle")
			     .data(root.features)
			     .enter() 
				 .append("circle")
			     .attr("cx",function(d,i){
			     	return projection(d.properties.cp)[0]
			     })
			     .attr("cy",function(d,i){
			     	return projection(d.properties.cp)[1]
			     })
			     .attr("r",2.5121)
			     .attr("fill",function(d,i){
			     	if(d.properties.name=="东城区"||d.properties.name=="崇文区"||d.properties.name=="西城区"||d.properties.name=="宣武区"){
			     		return graphColor
			     	}
			     	else{
			     		return "#636363"
			     	}
			     })

		cirleName.selectAll("text")
		  .data(root.features)
		  .enter() 
		  .append("text")
		  .attr("x",function(d){
		  	return projection(d.properties.cp)[0]
		  })
		  .attr("y",function(d){
		  	return projection(d.properties.cp)[1]
		  })
		  .attr("font-size","10px")
		  .attr("stroke",textColor)
		  .attr("text-anchor","end")
		  .text(function(d){
		  	if(d.properties.name=="东城区"||d.properties.name=="崇文区"||d.properties.name=="西城区"||d.properties.name=="宣武区"){
		  		return ""
		  	}
		  	else{
		  		if(d.properties.name=="朝阳区"){
		  			d3.select(this)
		  			  .attr("text-anchor","left")
		  		}
		  		return d.properties.name;  	 
		  	}
		  });
		 
	    d3.csv("monitor.csv", function(error, monitor) {
	    	if (error) 
	    		return console.error(error);
	    	//console.log(monitor);
	    	var monitorName= svg.append("g")
	    	               .attr("class","monitorName");

	    	/*monitorName.append("circle")
	    		     .attr("cx",function(){
	    		     	return projection([116.359,39.909])[0]
	    		     })
	    		     .attr("cy",function(){
	    		     	return projection([116.359,39.909])[1]
	    		     })
	    		     .attr("r",3)
	    		     .attr("fill","red")*/


	    	Circle=monitorName.selectAll(".circle")
	    		     .data(monitor)
	    		     .enter() 
	    			 .append("circle")
	    			 .attr("class","circle")
	    		     .attr("cx",function(d,i){
	    		     	return projection([d.lon,d.lat])[0]
	    		     })
	    		     .attr("cy",function(d,i){
	    		     	return projection([d.lon,d.lat])[1]
	    		     })
	    		     .attr("r",6)
	    		     .style("opacity", .8)
	    		     .attr("fill",circleColorStart)
	    		     .on("click",function(d,i){
	    		     	d3.selectAll(".circle")
	    		     	  .transition()
	    		     	  .duration(500)
	    		     	  .delay(50)
	    		     	  .attr("fill",circleColorStart)
	    		     	  .attr("stroke","none")
	    		     	  .attr("r",6)

	    		     	d3.select(this)
	    		     	  .transition()
	    		     	  .duration(500)
	    		     	  .delay(50)
	    		     	  .attr("stroke","blue")
	    		     	  .attr("fill",circleColorEnd)
	    		     	  .attr("r",8)
	    		     	d3.select("#bar").selectAll(".tick")
	    		     		.style("fill","");
	    		     	d3.select("#bar").selectAll(".tick").filter(function(c){

	    		     		return c==d.name
	    		     	}).style("fill",circleColorEnd);


	    		     	  chosenplace=place[places.indexOf(d.name)]
	    		     	  //console.log(chosenplace)
	    		     	  calendarChange()
	    		     	  linechange()
	    		     	  change()
	    		     		
	    		     	}
	    		     )
	    	//console.log(Circle)
	    	Circle.append("title")
	    	      .text(function(d){
	    	      	return d.name;
	    	    })
	    });     	

	});
}