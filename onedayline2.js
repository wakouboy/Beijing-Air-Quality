



places=["东四","天坛","官园","万寿西宫","奥体中心","农展馆","万柳","北部新区","植物园","丰台花园",
"云岗","古城","房山","大兴","亦庄","通州","顺义","昌平","门头沟","平谷","怀柔","密云","延庆","定陵","八达岭","密云水库","东高村",
"永乐店","榆垡","琉璃河","前门","永定门内","西直门北","南三环","东四环"]
pinyin=["dongsi","tiantan","guanyuan","wanshouxigong","aotizhongxing","nongzhanguan","wanliu","beibuxingqu","zhiwuyuan","fentaihuayuan",
"yungang","gucheng","fangshan","daxing","yizhuang","tongzhou","shunyi","changping","mengtougou","pinggu","huairou","miyun","yanqing","dingling","badaling",
"miyunshuiku","donggaocun","yongledian","yufa","liulihe","qianmeng","yongdingmengxi","xizhimengbei","nansanhuan","dongsihuan"]

var CO=0
var O3=1
var SO2 = 2;
var NO2 = 3;
var PM10 = 4;
var PM2_5 = 5;
var Dotline=6;
var TIME=7;

var pollunt=["CO","O3","SO2","NO2","PM10","PM2.5","AQI"]
var isCheckBoxesSelected = [false, false, true, false, false, true, false];
var allLineID = ["CO","O3","SO2", "NO2", "PM10", "PM2_5" ];
var allLineLabels = ["CO", "O3","SO2", "NO2", "PM10", "PM2.5" ];
var dataset=new Array()    // bao cun 24 xiaoshi de zhi 
for (var i=0;i<24;i++){
dataset[i]=new Array();
}
var parseDateAndTime = d3.time.format("%Y%m%d%H").parse;
var parseDate = d3.time.format("%Y%m%d").parse;
var parseTime= d3.time.format("%H").parse;
d3.select("#line-graph").select("svg").remove()
var extra=30
var width=document.getElementById("line-graph").offsetWidth;
var height=document.getElementById("line-graph").offsetHeight-60;

//console.log(width)
//console.log(height)
var margin={top:10,left:30, right:55, bottom:60}
var svg=d3.select("#line-graph")
	  .append("svg")
	  .attr("width",width)
	  .attr("height",height)
var twname=svg.append("g").attr("transform","translate("+margin.left+","+(height-10)+")")
twname.append("text")
	  .attr("class",".twname")
	  .attr("transform","translate("+width/2.5+",0)")
	  .attr("font-size","15px")
	  .attr("text-anchor","middle")
	  .attr("font-family", "sans-serif")
	  .text(places[pinyin.indexOf(chosenplace)]+" "+chosenday)
var xScale = d3.time.scale().range([0, width-margin.left-margin.right]),
			yScale = d3.scale.linear().range([height-margin.bottom-margin.top, 0]);

var context=svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")")

d3.csv("singleday/"+chosenday, function(error, data) {
		if(error) console.log("data missing")
		data.forEach(function(d) {

			d.hour=+d.hour
			//console.log(d["dongsi"])

			dataset[d.hour][pollunt.indexOf(d.type)]=+d[chosenplace];
			dataset[d.hour][TIME]=parseDateAndTime(chosenday+d.hour);
			//console.log(parseDate("20100101"))
			//console.log(parseDateAndTime(chosenday+d.hour))
		});
		var tmp=new Array();
        for (var i=1;i<24;i++){
        	for(var j=0;j<pollunt.length;j++){
        		if(dataset[i][j]==0)
        			dataset[i][j]=dataset[i-1][j]
        	}
        }
		//console.log(dataset);
		drawVis(dataset)
	});


		var drawVis=function(data)
		{
			var place = 0;
			drawOnePlace(data);
			//drawMap(allPlacePositions, allRegionLabels, data);
			
			//drawFocus(data[place]);
		}
		var drawOnePlace=function(data)
		{
			// 指定输出范围
			
			//console.log("drawOnePlace")
			drawLines(data);
			drawAxis(data);
			drawLegend();
		}
		
         var drawLines=function(data)
	    {
	    	xScale.domain(d3.extent(data,function(d){
	    		return d[TIME];
	    	}))

			// 用所有四条线的最大值来计算yScale.domain
			var maxAll, maxArray = [];
			
			for (var i = CO; i<= PM2_5; i++)
			{
				maxArray.push(d3.max(data, function(d) {
					return d[i];
				}));
			}
			//console.log(maxArray)
			//console.log(maxArray);
			maxAll = d3.max(maxArray, function(d) {
				return d;
			});
			yScale.domain([0, maxAll]);
			//console.log("maxAll = " + maxAll);
			
			for (var i = CO; i<= PM2_5; i++)
			{
				drawOneLine(data, i);
			}
		}
		var drawOneLine=function(data, index)
		{
			var line = d3.svg.line().x(function(d) {
				return xScale(d[TIME]);
			}).y(function(d) {
				return yScale(d[index]);
			});

			
			if (isCheckBoxesSelected[index - CO] == true)
			{
				//console.log(index);
				context.append("g")
				.append("path")
				.datum(data)
				.attr("class", "line"+index)
				.attr("d", line)
				.attr("id", allLineID[index-CO])
				.on("mouseover", function(d)
				{
							// if (isDrawLocked == false) {
								// onMouseOverPath(d, index);
								// isDrawLocked = true;
							// }
						}).on("mouseout", function(d)
						{
							// 擦除上一次画好的
							// currHintLines[0].transition()
					           // .delay(100).attr("class", "lineNone");
// 						        
						    // var parent = currHintLines[0].parentNode;
						    // parent.removeChild(currHintLines[0]);
// 							    
							// currHintLines[1].transition()
					           // .delay(100).attr("class", "lineNone");
// 
						    // parent = currHintLines[1].parentNode;
						    // parent.removeChild(currHintLines[1]);
					        // isDrawLocked = false;
					    });
					} else {
						if (isCheckBoxesSelected[Dotline] == true)
						{
							context.append("g").append("path")
							.datum(data)
							.attr("class", "lineDot"+index)
							.attr("d", line)
							.attr("id", allLineID[index-CO])
							.on("mouseover", function(d)
							{
								// if (isDrawLocked == false) {
									// onMouseOverPath(d, index);
									// isDrawLocked = true;
								// }
							}).on("mouseout", function(d)
							{
								// 擦除上一次画好的
								// currHintLines[0].transition()
						           // .delay(100).attr("class", "lineNone");
// 							        
							    // var parent    = currHintLines[0].parentNode;
							    // parent.removeChild(currHintLines[0]);
// 								    
								// currHintLines[1].transition()
						           // .delay(100).attr("class", "lineNone");
// 
							    // parent = currHintLines[1].parentNode;
							    // parent.removeChild(currHintLines[1]);
						        // isDrawLocked = false;
						    });
						} else {
							context.append("g").append("path")
							.datum(data)
							.attr("class", "lineNone")
							.attr("d", line)
							.attr("id", allLineID[index-CO])
							.on("mouseover", function(d)
							{
								// if (isDrawLocked == false) {
									// onMouseOverPath(d, index);
									// isDrawLocked = true;
								// }
							}).on("mouseout", function(d)
							{
								// 擦除上一次画好的
								// currHintLines[0].transition()
						           // .delay(100).attr("class", "lineNone");
// 							        
							    // var parent    = currHintLines[0].parentNode;
							    // parent.removeChild(currHintLines[0]);
// 								    
								// currHintLines[1].transition()
						           // .delay(100).attr("class", "lineNone");
// 
							    // parent = currHintLines[1].parentNode;
							    // parent.removeChild(currHintLines[1]);
						        // isDrawLocked = false;
						    });
						}
					}
				}

		var drawAxis=function(data)
		{
			xAxis = d3.svg.axis()
			.scale(xScale)
			.ticks(d3.time.hours,2)
			.tickFormat(d3.time.format('%H:%M'))
			.orient("bottom");
			yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left");

			context.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + (height-margin.bottom)+ ")")
			.call(xAxis);

			context.append("g")
			.attr("class", "y axis")
			.call(yAxis)
				.attr("transform", "translate(0, "+margin.top+")")
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6).attr("dy", ".71em")
				.style("text-anchor", "end").text("毫克/立方米");
			}

			function drawLegend()
			{
			// <line x1="0" y1="55" x2="100" y2="55" />
			var legendX = width-70;
			var legendY = 10;
			for (var i = 1; i<= PM2_5-CO; i++)
			{
				context.append("g")
				.append("line")
				.attr("x1", legendX)
				.attr("y1", legendY-5+15*i)
				.attr("x2", legendX+30)
				.attr("y2", legendY-5+15*i)
				.attr("class", "line"+i);
				
				context.append("text")
				.text(function() {
					return allLineLabels[i];
				}).attr("x", function() {
					return legendX-35;
				})
				.attr("y", legendY+15*i)
				.attr("font-family", "sans-serif")
				.attr("text-anchor", "left")
				.attr("font-size", "12px");
			}
		}
		function selectCO(cb) {
			if (cb.checked){
				isCheckBoxesSelected[CO] = true;
				svg.select("#"+allLineID[CO]).attr("class", "line"+CO);
				svg.select("#focusLine"+CO).attr("class", "line"+CO);
			} else {
				isCheckBoxesSelected[CO] = false;
				if (isCheckBoxesSelected[Dotline] == true)
				{
					svg.select("#"+allLineID[CO]).attr("class", "lineDot"+CO);
				} else {
					svg.select("#"+allLineID[CO]).attr("class", "lineNone");
				}
				svg.select("#focusLine"+CO).attr("class", "lineNone");   //  hide the line
			}
			// console.log(isCheckBoxesSelected);
		}
		function selectO3(cb) {
			if (cb.checked){
				isCheckBoxesSelected[O3] = true;
				svg.select("#"+allLineID[O3]).attr("class", "line"+O3);
				svg.select("#focusLine"+O3).attr("class", "line"+O3);
			} else {
				isCheckBoxesSelected[O3] = false;
				if (isCheckBoxesSelected[Dotline] == true)
				{
					svg.select("#"+allLineID[O3]).attr("class", "lineDot"+O3);
				} else {
					svg.select("#"+allLineID[O3]).attr("class", "lineNone");
				}
				svg.select("#focusLine"+O3).attr("class", "lineNone");   //  hide the line
			}
			// console.log(isCheckBoxesSelected);
		}
		function selectSO2(cb) {
			if (cb.checked){
				isCheckBoxesSelected[SO2] = true;
				svg.select("#"+allLineID[SO2]).attr("class", "line"+SO2);
				svg.select("#focusLine"+SO2).attr("class", "line"+SO2);
			} else {
				isCheckBoxesSelected[SO2] = false;
				if (isCheckBoxesSelected[Dotline] == true)
				{
					svg.select("#"+allLineID[SO2]).attr("class", "lineDot"+SO2);
				} else {
					svg.select("#"+allLineID[SO2]).attr("class", "lineNone");
				}
				svg.select("#focusLine"+SO2).attr("class", "lineNone");   //  hide the line
			}
			// console.log(isCheckBoxesSelected);
		}
		function selectNO2(cb) {
			if (cb.checked) {
				isCheckBoxesSelected[NO2] = true;
				svg.select("#"+allLineID[NO2]).attr("class", "line"+NO2);
				svg.select("#focusLine"+NO2).attr("class", "line"+NO2);
			} else {
				isCheckBoxesSelected[NO2] = false;
				
				if (isCheckBoxesSelected[Dotline] == true)
				{
					svg.select("#"+allLineID[NO2]).attr("class", "lineDot"+NO2);
				} else {
					svg.select("#"+allLineID[NO2]).attr("class", "lineNone");
				}
				svg.select("#focusLine"+NO2).attr("class", "lineNone");
			}
		}
		function selectPM10(cb) {
			if (cb.checked) {
				isCheckBoxesSelected[PM10] = true;
				svg.select("#"+allLineID[PM10]).attr("class", "line"+PM10);
				svg.select("#focusLine"+PM10).attr("class", "line"+PM10);
			} else {
				isCheckBoxesSelected[PM10] = false;
				
				if (isCheckBoxesSelected[Dotline] == true)
				{
					svg.select("#"+allLineID[PM10]).attr("class", "lineDot"+PM10);
				} else {
					svg.select("#"+allLineID[PM10]).attr("class", "lineNone");
				}
				svg.select("#focusLine"+PM10).attr("class", "lineNone");
			}
		}
		function selectPM2_5(cb) {
			if (cb.checked) {
				isCheckBoxesSelected[PM2_5] = true;
				svg.select("#"+allLineID[PM2_5]).attr("class", "line"+PM2_5);
				svg.select("#focusLine"+PM2_5).attr("class", "line"+PM2_5);
			} else {
				isCheckBoxesSelected[PM2_5] = false;
				if (isCheckBoxesSelected[PM2_5] == true)
				{
					svg.select("#"+allLineID[PM2_5]).attr("class", "lineDot"+PM2_5);
				} else {
					svg.select("#"+allLineID[PM2_5]).attr("class", "lineNone");
				}
				svg.select("#focusLine"+PM2_5).attr("class", "lineNone");
			}
		}
		function selectDotted(cb) {
			if (cb.checked) {
				if (isCheckBoxesSelected[CO] == false)
				{
					svg.select("#"+allLineID[CO]).attr("class", "lineDot"+CO);
				}
				if (isCheckBoxesSelected[O3] == false)
				{
					svg.select("#"+allLineID[O3]).attr("class", "lineDot"+O3);
				}
				if (isCheckBoxesSelected[SO2] == false)
				{
					svg.select("#"+allLineID[SO2]).attr("class", "lineDot"+SO2);
				}
				if (isCheckBoxesSelected[NO2] == false)
				{
					svg.select("#"+allLineID[NO2]).attr("class", "lineDot"+NO2);
				}
				if (isCheckBoxesSelected[PM10] == false)
				{
					svg.select("#"+allLineID[PM10]).attr("class", "lineDot"+PM10);
				}
				if (isCheckBoxesSelected[PM2_5] == false)
				{
					svg.select("#"+allLineID[PM2_5]).attr("class", "lineDot"+PM2_5);
				}

				isCheckBoxesSelected[Dotline] = true;
			} else {
				if (isCheckBoxesSelected[CO] == false)
				{
					svg.select("#"+allLineID[CO]).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[O3] == false)
				{
					svg.select("#"+allLineID[O3]).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[SO2] == false)
				{
					svg.select("#"+allLineID[SO2]).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[NO2] == false)
				{
					svg.select("#"+allLineID[NO2]).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[PM2_5] == false)
				{
					svg.select("#"+allLineID[PM2_5]).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[PM10] == false)
				{
					svg.select("#"+allLineID[PM10]).attr("class", "lineNone");
				}
				isCheckBoxesSelected[Dotline] = false;
			}
		}
	

		//////////////////////////////////////////////////////
function change()
  {
  	   var dataset=new Array()    // bao cun 24 xiaoshi de zhi 
			for (var i=0;i<24;i++){
			dataset[i]=new Array();
		}

		d3.csv("singleday/"+chosenday, function(error, data) {
		if(error) console.log("data missing")
		data.forEach(function(d) {

			d.hour=+d.hour
			//console.log(d["dongsi"])

			dataset[d.hour][pollunt.indexOf(d.type)]=+d[chosenplace];
			dataset[d.hour][TIME]=parseDateAndTime(chosenday+d.hour);
			//console.log(parseDate("20100101"))
			//console.log(parseDateAndTime(chosenday+d.hour))
		});
		console.log(typeof(dataset[0][0]))
		var tmp=new Array();
        for (var i=1;i<24;i++){
        	for(var j=0;j<pollunt.length;j++){
        		if(dataset[i][j]==0)
        			dataset[i][j]=dataset[i-1][j]*(0.5-Math.random()+1);
        		
        	}
       }
		var maxAll, maxArray = [];
			
			for (var i = CO; i<= PM2_5; i++)
			{
				maxArray.push(d3.max(dataset, function(d) {
					return d[i];
				}));
			}

			maxAll = d3.max(maxArray, function(d) {
				return d;
			});
			maxAll*=1.1
			yScale.domain([0, maxAll]);
			xScale.domain(d3.extent(dataset,function(d){
	    		return d[TIME];
	    	}))
			// console.log("maxAll = " + maxAll);
			
			//Update Y axis
			context.select(".y.axis")
			.transition()
			.duration(500)
			.call(yAxis);
			//console.log(chosenday)
			twname.select("text")
			  .transition()
			  .duration(500)
			  .attr("font-size","19px")
			  .transition()
			  .duration(500)
			  .attr("font-size","15px")
			   .text(places[pinyin.indexOf(chosenplace)]+" "+chosenday)
			// console.log(dataset);
			for (var i = CO; i<= PM2_5; i++)
			{
				var line = d3.svg.line().x(function(d) {
					return xScale(d[TIME]);            // domain range bianhua 
				}).y(function(d) {
					return yScale(d[i]);
				});
				
				// 更新成新的数据
				//console.log(allLineID[i-CO])
				context.select("#"+allLineID[i-CO])
				.datum(dataset)
				//.transition()
				//.duration(2500)
				//.ease("bounce")
				.transition()
				.duration(500)
		        .attr("d", line); // 只有重新指定line才会更新数据
		        
		       
		   }
	});
			
}

		      
	
	