


var places=["东四","天坛","官园","万寿西宫","奥体中心","农展馆","万柳","北部新区","植物园","丰台花园",
"云岗","古城","房山","大兴","亦庄","通州","顺义","昌平","门头沟","平谷","怀柔","密云","延庆","定陵","八达岭","密云水库","东高村",
"永乐店","榆垡","琉璃河","前门","永定门内","西直门北","南三环","东四环"]
var pinyin=["dongsi","tiantan","guanyuan","wanshouxigong","aotizhongxing","nongzhanguan","wanliu","beibuxingqu","zhiwuyuan","fentaihuayuan",
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

var allLineID = ["CO","O3","SO2", "NO2", "PM10", "PM2_5" ];
var allLineLabels = ["CO", "O3","SO2", "NO2", "PM10", "PM2.5" ];
var odataset=new Array()    // bao cun 24 xiaoshi de zhi 
for (var i=0;i<24;i++){
odataset[i]=new Array();
}
var oparseDateAndTime = d3.time.format("%Y%m%d%H").parse;
var oparseDate = d3.time.format("%Y%m%d").parse;
var oparseTime= d3.time.format("%H").parse;
d3.select("#oneday").select("svg").remove()

var owidth=document.getElementById("oneday").offsetWidth;
var oheight=document.getElementById("oneday").offsetHeight;

//console.log(width)
//console.log(height)
var omargin={top:10,left:100, right:10, bottom:40}
var osvg=d3.select("#oneday")
	  .append("svg")
	  .attr("width",owidth)
	  .attr("height",oheight)
var twname=osvg.append("g").attr("transform","translate("+omargin.left+","+(10)+")")
twname.append("text")
	  .attr("class",".twname")
	  .attr("transform","translate("+owidth/2.5+","+oheight/1.1+")")
	  .attr("font-size","12px")
	  .attr("text-anchor","middle")
	  .attr("font-family", "sans-serif")
	  .text(places[pinyin.indexOf(chosenplace)]+" "+chosenday)
var oxScale = d3.time.scale().range([0, owidth-omargin.left-omargin.right]),
			oyScale = d3.scale.linear().range([oheight-omargin.bottom-omargin.top, 0]);

var ocontext=osvg.append("g").attr("transform","translate("+omargin.left+","+omargin.top+")")
var oxAxis,oyAxis;
d3.csv("singleday/"+chosenday, function(error, data) {
		if(error) console.log("data missing")
		data.forEach(function(d) {

			d.hour=+d.hour
			//console.log(d["dongsi"])

			odataset[d.hour][pollunt.indexOf(d.type)]=+d[chosenplace];
			odataset[d.hour][TIME]=oparseDateAndTime(chosenday+d.hour);
			//console.log(parseDate("20100101"))
			//console.log(parseDateAndTime(chosenday+d.hour))
		});
		var tmp=new Array();
        for (var i=1;i<24;i++){
        	for(var j=0;j<pollunt.length;j++){
        		if(odataset[i][j]==0)
        			odataset[i][j]=odataset[i-1][j]
        	}
        }
		//console.log(dataset);
		odrawVis(odataset)
	});
drawLegend2()
function drawLegend2()
			{
				// <line x1="0" y1="55" x2="100" y2="55" />
				var legendX = -60;
				var legendY = -10;
				for (var i =O3; i<= PM2_5; i++)
				{
					ocontext.append("g")
						.append("rect")
						.attr("x", legendX-30)
						.attr("y", legendY-5+15*i)
						.attr("width", 20)
						.attr("height", 2)
						.attr("class", "line"+i);
					
					ocontext.append("text")
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

		var odrawVis=function(data)
		{
			var place = 0;
			//console.log(data)
			odrawOnePlace(data);
			//drawMap(allPlacePositions, allRegionLabels, data);
			
			//drawFocus(data[place]);
		}
		var odrawOnePlace=function(data)
		{
			// 指定输出范围
			
			//console.log("drawOnePlace")
			odrawLines(data);
			odrawAxis(data);
		}
		
         var odrawLines=function(data)
	    {
	    	oxScale.domain(d3.extent(data,function(d){
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
			oyScale.domain([0, maxAll]);
			//console.log("maxAll = " + maxAll);
			
			for (var i = O3; i<= PM2_5; i++)
			{
				odrawOneLine(data, i);
			}
		}
		var odrawOneLine=function(data, index)
		{
			var line = d3.svg.line().x(function(d) {
				return oxScale(d[TIME]);
			}).y(function(d) {
				return oyScale(d[index]);
			});
				ocontext.append("g")
				.append("path")
				.datum(data)
				.attr("class", "line"+index)
				.attr("d", line)
				.attr("id", "o"+allLineID[index-CO])
				
		}

		var odrawAxis=function(data)
		{
			oxAxis = d3.svg.axis()
			.scale(oxScale)
			.ticks(d3.time.hours,4)
			.tickFormat(d3.time.format('%H'))
			.orient("bottom");
			oyAxis = d3.svg.axis()
			.scale(oyScale)
			.orient("left");

			ocontext.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate(0,  "+(oheight-omargin.bottom-omargin.top)+")")
			.call(oxAxis);

			ocontext.append("g")
			.attr("class", "y-axis")
			.attr("transform", "translate(0, 0)")
			.call(oyAxis)
				
				
		}


	

		//////////////////////////////////////////////////////
function change()
  {
  	   var dataset=new Array()    // bao cun 24 xiaoshi de zhi 
			for (var i=0;i<24;i++){
			dataset[i]=new Array();
			for(j=0;j<pollunt.length;j++)
				dataset[i].push(0);
				dataset[i].push(oparseDateAndTime(chosenday+i))
		}

		d3.csv("singleday/"+chosenday, function(error, data) {
		if(error) console.log("data missing")
		data.forEach(function(d) {

			d.hour=+d.hour
			//console.log(d["dongsi"])

			dataset[d.hour][pollunt.indexOf(d.type)]=+d[chosenplace];
			dataset[d.hour][TIME]=oparseDateAndTime(chosenday+d.hour);
			//console.log(parseDate("20100101"))
			//console.log(parseDateAndTime(chosenday+d.hour))
		})
		//console.log(dataset)
        for (var i=1;i<24;i++){
        	for(var j=0;j<=pollunt.length;j++){
        		if(dataset[i][j]==0||typeof(dataset[i][j])==undefined)
        			dataset[i][j]=dataset[i-1][j];

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
			oyScale.domain([0, maxAll]);
			oxScale.domain(d3.extent(dataset,function(d){
	    		return d[TIME];
	    	}))
			// console.log("maxAll = " + maxAll);
			
			//Update Y axis
			ocontext.select(".y-axis")
			.transition()
			.duration(500)
			.call(oyAxis);
			//console.log(chosenday)
			twname.select("text")
			  .transition()
			  .duration(300)
			  .attr("font-size","14px")
			  .transition()
			  .duration(300)
			  .attr("font-size","12px")
			   .text(places[pinyin.indexOf(chosenplace)]+" "+chosenday)
			// console.log(dataset);
			for (var i = CO; i<= PM2_5; i++)
			{
				var line = d3.svg.line().x(function(d) {
					return oxScale(d[TIME]);            // domain range bianhua 
				}).y(function(d) {
					return oyScale(d[i]);
				});
				
				// 更新成新的数据
				//console.log(allLineID[i-CO])
				ocontext.select("#o"+allLineID[i-CO])
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

		      
	
	