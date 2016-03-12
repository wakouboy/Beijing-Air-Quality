

var places=["东四","天坛","官园","万寿西宫","奥体中心","农展馆","万柳","北部新区","植物园","丰台花园",
"云岗","古城","房山","大兴","亦庄","通州","顺义","昌平","门头沟","平谷","怀柔","密云","延庆","定陵","八达岭","密云水库","东高村",
"永乐店","榆垡","琉璃河","前门","永定门内","西直门北","南三环","东四环"]
var pinyin=["dongsi","tiantan","guanyuan","wanshouxigong","aotizhongxing","nongzhanguan","wanliu","beibuxingqu","zhiwuyuan","fentaihuayuan",
"yungang","gucheng","fangshan","daxing","yizhuang","tongzhou","shunyi","changping","mengtougou","pinggu","huairou","miyun","yanqing","dingling","badaling",
"miyunshuiku","donggaocun","yongledian","yufa","liulihe","qianmeng","yongdingmengxi","xizhimengbei","nansanhuan","dongsihuan"]


			var margin = {top : 20, right : 10, bottom : 30, left : 100},
			margin2 = {top: 180, right: 10, bottom: 20, left: 100};
			var width = document.getElementById("line-graph").offsetWidth- margin.left - margin.right, 
				height = 150 - margin.top - margin.bottom;
			
			var width2 = width, height2 = height+50;
			//var imgWidth = 437, imgHeight = 406;
			var svgWidth = width + margin.left + margin.right, svgHeight = (height + height2 + 3*margin.top + 3*margin.bottom);
			
		var CO=0
		var O3=1
		var SO2 = 2;
		var NO2 = 3;
		var PM10 = 4;
		var PM2_5 = 5;
		var Dotline=6;
		var TIME=7;
		var dataset;
			var xAxis, yAxis;
			var xScale, yScale;
			var dataset = new Array();
			var numPlaces = 35;

			var allNullValPos = new Array();
			for (var i = 0; i < numPlaces; i++) {
			    dataset[i] = new Array();
			}
		
			
			// 三种物质的轻微污染线与重污染线
			var pollutionDescs = [[0.17,"CO"],[0.18,"O3"],[0.15, "可吸入颗粒物\n与SO2轻微污染线"], [1.6, "SO2重污染线"], 
							[0.12, "NO2轻微污染线"], [0.565, "NO2重污染线"], 
							[0.42, "可吸入颗粒物重污染线"]];

			var parseDateAndTime = d3.time.format("%Y%m%d%H").parse;
			var parseDate = d3.time.format("%Y%m%d").parse;
			var parseTime= d3.time.format("%H:%M").parse;
			var dateFormat= d3.time.format("%Y%m%d");
			
			var place, so2, no2, pm10, pm2_5,o3;
			var currentIndex = 0;
			var placeIndex = 0;
			var lastSelectedPlaceIndex = 0;
			
			// 因为在svg的id中不能出现PM2.5中的"."
			var pollunt=["CO","O3","SO2","NO2","PM10","PM2.5"]
			var isCheckBoxesSelected = [false, false, false, false, true, true, false];
			var allLineID = ["CO","O3","SO2", "NO2", "PM10", "PM2_5" ];
			var allLineLabels = ["CO", "O3","SO2", "NO2", "PM10", "PM2.5" ];
			
			var svg = d3.select("#line-graph")
				.append("svg")
				.attr("width", svgWidth)
				.attr("height", svgHeight);
			
			// for (var i = SO2; i <= PM2_5; i++)
			// {
			svg.append("defs").append("clipPath")
			    .attr("id", "clip")
			  	.append("rect")
			    .attr("width", width2)
			    .attr("height", height2);

		    var sname=svg.append("g").attr("transform","translate("+margin.left+","+(svgHeight-10)+")")
				sname.append("text")
	  			.attr("class",".twname")
	  			.attr("transform","translate("+svgWidth/2.5+","+0+")")
	  			.attr("font-size","15px")
	  			.attr("text-anchor","middle")
	  			.attr("font-family", "sans-serif")
	  			.text(places[pinyin.indexOf(chosenplace)]+" "+"监测点")
			// }

			// 整体坐标系变换，向右平移，这个transform是作用在之前定义svg的g上
			var context = svg.append("g").attr("transform", "translate("+ margin.left +", "+ margin.top +")");;
			
			// Checkbox事件///////////////////////////
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
				if (isCheckBoxesSelected[Dotline] == true)
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
					svg.select("#"+"focusLine"+allLineID[CO]).attr("class", "lineDot"+CO);

				}
				if (isCheckBoxesSelected[O3] == false)
				{
					svg.select("#"+allLineID[O3]).attr("class", "lineDot"+O3);
					svg.select("#"+"focusLine"+O3).attr("class", "lineDot"+O3);
				}
				if (isCheckBoxesSelected[SO2] == false)
				{
					svg.select("#"+allLineID[SO2]).attr("class", "lineDot"+SO2);
					svg.select("#"+"focusLine"+SO2).attr("class", "lineDot"+So2);
				}
				if (isCheckBoxesSelected[NO2] == false)
				{
					svg.select("#"+allLineID[NO2]).attr("class", "lineDot"+NO2);
					svg.select("#"+"focusLine"+NO2).attr("class", "lineDot"+NO2);
				}
				if (isCheckBoxesSelected[PM10] == false)
				{
					svg.select("#"+allLineID[PM10]).attr("class", "lineDot"+PM10);
					svg.select("#"+"focusLine"+PM10).attr("class", "lineDot"+PM10);
				}
				if (isCheckBoxesSelected[PM2_5] == false)
				{
					svg.select("#"+allLineID[PM2_5]).attr("class", "lineDot"+PM2_5);
					svg.select("#"+"focusLine"+PM2_5).attr("class", "lineDot"+PM2_5);
				}

				isCheckBoxesSelected[Dotline] = true;
			} else {
				if (isCheckBoxesSelected[CO] == false)
				{
					svg.select("#"+allLineID[CO]).attr("class", "lineNone");
					svg.select("#"+"focusLine"+CO).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[O3] == false)
				{
					svg.select("#"+allLineID[O3]).attr("class", "lineNone");
					svg.select("#"+"focusLine"+O3).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[SO2] == false)
				{
					svg.select("#"+allLineID[SO2]).attr("class", "lineNone");
					svg.select("#"+"focusLine"+SO2).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[NO2] == false)
				{
					svg.select("#"+allLineID[NO2]).attr("class", "lineNone");
					svg.select("#"+"focusLine"+NO2).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[PM2_5] == false)
				{
					svg.select("#"+allLineID[PM2_5]).attr("class", "lineNone");
					svg.select("#"+"focusLine"+PM2_5).attr("class", "lineNone");
				}
				if (isCheckBoxesSelected[PM10] == false)
				{
					svg.select("#"+allLineID[PM10]).attr("class", "lineNone");
					svg.select("#"+"focusLine"+PM10).attr("class", "lineNone");
				}
				isCheckBoxesSelected[Dotline] = false;
			}
		}

			
			//////////////////////////////////////////////////////
			// Focus try
			var focus = svg.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
			var xScale2 = d3.time.scale().range([0, width2]),
			yScale2 = d3.scale.linear().range([height2, 0]);
			var xAxis2 = d3.svg.axis().scale(xScale2).orient("bottom")
					.tickSize(8,3,10)
					.tickSubdivide(23),
		    yAxis2 = d3.svg.axis().scale(yScale2).orient("left")
						.tickSize(8,3,10)
						.tickSubdivide(5);

		    var lineFocuses = [];
		    lineFocuses[CO] = d3.svg.line()
					// .interpolate("monotone")
					.x(function(d) {
						return xScale2(d.date);
					}).y(function(d) {
						return yScale2(d[pollunt[CO]]);
					});
		    lineFocuses[SO2] = d3.svg.line()
					// .interpolate("monotone")
					.x(function(d) {
						return xScale2(d.date);
					}).y(function(d) {
						return yScale2(d[pollunt[SO2]]);
					});
		    lineFocuses[NO2] = d3.svg.line()
					// .interpolate("monotone")
					.x(function(d) {
						return xScale2(d.date);
					}).y(function(d) {
						return yScale2(d[pollunt[NO2]]);
					});
		    lineFocuses[O3] = d3.svg.line()
					// .interpolate("monotone")
					.x(function(d) {
						return xScale2(d.date);
					}).y(function(d) {
						return yScale2(d[pollunt[O3]]);
					});
			lineFocuses[PM10] = d3.svg.line()
					// .interpolate("monotone")
					.x(function(d) {
						return xScale2(d.date);
					}).y(function(d) {
						return yScale2(d[pollunt[PM10]]);
					});
			lineFocuses[PM2_5] = d3.svg.line()
					// .interpolate("monotone")
					.x(function(d) {
						return xScale2(d.date);
					}).y(function(d) {
						return yScale2(d[pollunt[PM2_5]]);
					});

			function onBrush() {
				xScale2.domain(brush.empty() ? xScale.domain() : brush.extent());
				var ext=brush.extent();
				//console.log(ext);
				var tmp=dataset;
					tmp=tmp.filter(function(d){
					if (d.date<ext[1]&&d.date>ext[0]){
						//console.log("ww");
						return d;
					}
				})
				//console.log(tmp);
				var maxAll, maxArray = [];
			
				for (var i = CO; i<= PM2_5; i++)
				{
					maxArray.push(d3.max(tmp, function(d) {
						//if(d[pollunt[i]]>800) console.log(d);
						return d[pollunt[i]];
					}));
				}

				maxAll = d3.max(maxArray, function(d) {
						return d;
				});
				yScale2.domain([0,maxAll]);

				for (var i = O3; i<= PM2_5; i++)
				{
					if (isCheckBoxesSelected[i-CO] == true) {
						focus.select("#focusLine"+i).attr("d", lineFocuses[i-CO]);
					}
					else if(isCheckBoxesSelected[Dotline]==true){
						focus.select("#focusLine"+i).attr("d", lineFocuses[i-CO]);
					}
				}
				// 更新x轴
				focus.select(".x.axis2").call(xAxis2);
				focus.select(".y.axis2").call(yAxis2);

				svg.selectAll('.tick')
    				.on('click',function(d){
    					//console.log(dateFormat(d));
    					chosenday=dateFormat(d);
    					change();
    			 	});
			}

			var brush;
			function drawFocus(data)
			{
				brush = d3.svg.brush()
					    .x(xScale)
					    .on("brush", onBrush);

				xScale2.domain(xScale.domain());
				yScale2.domain(yScale.domain());
				
				/*for (var i = 0; i<pollutionDescs.length; i++) {
					var yCoord = yScale2(pollutionDescs[i][0]);
					// console.log(i + ", " +yCoord);
					// 不显示超出坐标轴的
					if (yCoord > 0) {
						focus.append("g").append("line")
							.attr("x1", 0)
							.attr("x2", width2)
							.attr("y1", yCoord)
							.attr("y2", yCoord)
					      	.attr("class", "lineDotGray")
					      	.attr("id", "pollutionIndex"+i);
						focus.append("text")
							.attr("x", width2).attr("dx", ".71em")
							.attr("y", yCoord-5)
							.text(pollutionDescs[i][1])
						    .attr("text-anchor", "middle")
						    .attr("font-size", "10px")
					      	.attr("id", "pollutionIndexText"+i)
					      	.attr("fill", "gray");
					}
				}*/

				for (var i = CO; i<= PM2_5; i++)
				{
					if (isCheckBoxesSelected[i-CO] == true) {
						focus.append("g").append("path")
						      .datum(data)
						      .attr("clip-path", "url(#clip)")
						      .attr("class", "line"+i)
						      .attr("d", lineFocuses[i-CO])
						      .attr("id", "focusLine"+i);
					} else {
						if(isCheckBoxesSelected[Dotline] == true)
						{
						context.append("g").append("path")
								.datum(data)
								.attr("clip-path", "url(#clip)")
						      	.attr("class", "lineDot"+i)
						      	.attr("d", lineFocuses[i-CO])
						      	.attr("id", "focusLine"+i);
							}
						else {
						focus.append("g").append("path")
						      .datum(data)
						      .attr("clip-path", "url(#clip)")
						      .attr("class", "lineNone")
						      .attr("d", lineFocuses[i-CO])
						      .attr("id", "focusLine"+i);
						  }
					}
				}

				focus.append("g")
			      .attr("class", "x axis2")
			      .attr("transform", "translate(0," + height2 + ")")
			      .call(xAxis2);
			
			  	focus.append("g")
			      .attr("class", "y axis2")
			      .call(yAxis2);

				context.append("g")
			      .attr("class", "x brush")
			      .call(brush)
			      .selectAll("rect")
			      .attr("y", -6)
			      .attr("height", height + 7);
				// var aaa = svg.append("g")
			      // .attr("class", "x brush")
			     // console.log(aaa);
			     // brush(aaa);
	// 			     
		    // aaa.selectAll("rect")
		      // .attr("y", -6)
		      // .attr("height", height);
					    // console.log("ss", brush)
					// 
			}
			
			//////////////////////////////////////////////////////
			function drawVis(data)
			{
				drawOnePlace(data);
				//drawMap(allPlacePositions, allRegionLabels, data);
				
				drawFocus(data);
			}
			
			function drawOnePlace(data)
			{
				// 指定输出范围
				xScale = d3.time.scale().range([0, width]);
				yScale = d3.scale.linear().range([height, 0]);

				drawLines(data);
				drawAxis(data);
				drawLegend();
			}
			
			
			function drawLines(data)
			{
				xScale.domain(d3.extent(data, function(d) {
					return d.date;
				}));
				
				// 用所有四条线的最大值来计算yScale.domain
				var maxAll, maxArray = [];
				
				for (var i = CO; i<= PM2_5; i++)
				{
					maxArray.push(d3.max(data, function(d) {
						return d[pollunt[i]];
					}));
				}

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

			var currHintLines = [];
			var isDrawLocked = false;
			function drawOneLine(data, index)
			{
				var line = d3.svg.line().x(function(d) {
					return xScale(d.date);
				}).y(function(d) {
					return yScale(d[pollunt[index]]);
				});
				
				if (isCheckBoxesSelected[index - CO] == true)
				{
					context.append("g")
						.append("path")
							.datum(data)
							.attr("class", "line"+index)
							.attr("d", line)
							.attr("id", allLineID[index-CO])
							
				} else {
					if (isCheckBoxesSelected[Dotline] == true)
					{
						context.append("g").append("path")
								.datum(data)
								.attr("class", "lineDot"+index)
								.attr("d", line)
								.attr("id", allLineID[index-CO])
								
					} else {
						context.append("g").append("path")
								.datum(data)
								.attr("class", "lineNone")
								.attr("d", line)
								.attr("id", allLineID[index-CO])
								
					}
				}
			}
			
			function onMouseOverPath(data, index)
			{
				var xDomain, yDomain, xValue, yValue, hour, min;
				var displayString;
				
				xDomain = event.offsetX-margin.left;
				yDomain = event.offsetY;
				xValue = xScale.invert(xDomain);
				yValue = (yScale.invert(yDomain)).toFixed(3);
				
				hour = xValue.getHours();
				hour = (hour < 10 ? "0" : "") + hour;
				min = xValue.getMinutes();
				min = (min < 10 ? "0" : "") + min;
				displayString = allLineID[index-CO]+":\n  "
					+(xValue.getMonth()+1)+"月"
					+xValue.getDate()+"日 "
					+hour+":"
					+min+"\n  "
					+yValue + "毫克/立方米";
				// console.log( displayString);

				context.select("#"+allLineID[index-CO])
				   .append("title").text(function(d) { return allLineLabels[index-CO]; });
				
				currHintLines[0] = context.append("g").append("path")
					.attr("class", "lineDotGray")
					.attr("d", "M " +xDomain+ " " +height+" L " + xDomain + " " + yDomain + "z");
					
				currHintLines[1] = context.append("g").append("path")
					.attr("class", "lineDotGray")
					.attr("d", "M 0 " +yDomain+" L " + xDomain + " " + yDomain + "z");
			}
			
			function drawAxis(data)
			{
				xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom");
				yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left");

				context.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0, " + height + ")")
				    .call(xAxis);

				context.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					//.attr("transform", "translate("+ margin.left +", 0)")
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6).attr("dy", ".71em")
					.style("text-anchor", "end").text("微克/立方米");



			}
			
			function drawLegend()
			{
				// <line x1="0" y1="55" x2="100" y2="55" />
				var legendX = -60;
				var legendY = -10;
				for (var i =O3; i<= PM2_5; i++)
				{
					context.append("g")
						.append("rect")
						.attr("x", legendX-30)
						.attr("y", legendY-5+15*i)
						.attr("width", 20)
						.attr("height", 2)
						.attr("class", "line"+i);
					
					context.append("text")
					   	.text(function() {
				        	return allLineLabels[i];
					   	}).attr("x", function() {
					        return legendX-5;
					   	})
					   	.attr("y", legendY+15*i)
					   	.attr("font-family", "sans-serif")
					   	.attr("text-anchor", "left")
					   	.attr("font-size", "12px");
				}
			}
			
			function drawNullDataCircles(data)
			{
				// 绘制圆点
				context.append("g")
				   .selectAll("circle")
				   .data(data)
				   .enter()
				   .append("circle")
				   .attr("cx", function(d) {
				        return xScale(d[0]); // x轴方向缩放
				   })
				   .attr("cy", function(d) {
				        return yScale(d[1]); // y轴方向缩放
				   })
				   .attr("r", 0.05)
				   .attr("stroke", "yellow");
			}



		// End of all function definitions
		/////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////////////////		
	d3.csv("onedayPlace/"+chosenplace, function(error, data) {
		if(error) console.log("data missing")
		data.filter(function(d) {
			d.date=parseDate(d.date)

			for(var i=0;i<pollunt.length;i++){
				d[pollunt[i]]=+d[pollunt[i]]
			}
		    return d;
			//console.log(d["dongsi"])
			//dataset[d.hour][pollunt.indexOf(d.type)]=+d[chosenplace];
			//dataset[d.hour][TIME]=parseDateAndTime(chosenday+d.hour);
			//console.log(parseDate("20100101"))
			//console.log(parseDateAndTime(chosenday+d.hour))
		});
	  
	    dataset=data;
		drawVis(data)


		
	});



	function linechange()
	{
	
		d3.csv("onedayPlace/"+chosenplace, function(error, data) {
		if(error) console.log("data missing")
		//console.log(data)
		 data.filter(function(d) {
			d.date=parseDate(d.date)

			for(var i=0;i<pollunt.length;i++){
				d[pollunt[i]]=+d[pollunt[i]]
			}
		    return d;
		});
		dataset=data;
		var maxAll, maxArray = [];
			
			for (var i = CO; i<= PM2_5; i++)
			{
				maxArray.push(d3.max(data, function(d) {
					if(d[pollunt[i]]>800) console.log(d);
					return d[pollunt[i]];
				}));
			}

			maxAll = d3.max(maxArray, function(d) {
				return d;
			});
			//maxAll*=1.1
			yScale.domain([0, maxAll]);
			yScale2.domain([0,maxAll]);
			
			context.select(".y.axis")
			.transition()
			.duration(500)
			.call(yAxis);

			focus.select(".y.axis2")
			.transition()
			.duration(500)
			.call(yAxis2)
		    sname.select("text")
			  .transition()
			  .duration(500)
			  .attr("font-size","18px")
			  .transition()
			  .duration(500)
			  .attr("font-size","15px")
			   .text(places[pinyin.indexOf(chosenplace)]+" "+"监测点")
			/*twname.select("text")
			  .transition()
			  .duration(500)
			  .attr("font-size","19px")
			  .transition()
			  .duration(500)
			  .attr("font-size","15px")
			   .text(places[pinyin.indexOf(chosenplace)]+" "+chosenday)
	        */
			for (var i = CO; i<= PM2_5; i++)
			{
				var line = d3.svg.line().x(function(d) {
					return xScale(d.date);            // domain range bianhua 
				}).y(function(d) {
					return yScale(d[pollunt[i]]);
				});
				
				// 更新成新的数据
				//console.log(allLineID[i-CO])
				svg.select("#"+allLineID[i-CO])
				.datum(data)
				//.transition()
				//.duration(2500)
				//.ease("bounce")
				.transition()
				.duration(500)
		        .attr("d", line); // 只有重新指定line才会更新数据
		       svg.select("#focusLine"+i)
		       	  .datum(data)
		       	  .transition()
		       	  .duration(500)
		       	  .attr("d",lineFocuses[i-CO]);
		        
		      }
		})

			
	}		      



