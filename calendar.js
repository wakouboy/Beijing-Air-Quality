

var cwidth = document.getElementById("calendar").offsetWidth
    cheight = document.getElementById("calendar").offsetHeight
    cellSize = 12                              ; // cell size



//console.log(width)
 var cndata={}
var cpercent = d3.format(".1%"),
    cformat = d3.time.format("%Y%m%d"),
    cformatcsv=d3.time.format("%Y%m%d").parse;

var ccolor = d3.scale.threshold()
    .domain([50,100,150,200,300])
    .range(d3.range(6).map(function(d) { return "q" + d + "-11"; }));



var c_svg = d3.select("#calendar").selectAll("svg")
    .data([2015,2014])                    // range 
  .enter().append("svg")
    .attr("width", cwidth)
    .attr("height", cheight/2)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", function(d){return "translate(" + ((cwidth - cellSize * 53) / 2) + ","
     + ((cheight/2 - cellSize * 7 - 1)/2)+ ")"});


c_svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });




/*for(var mon=1;mon<=12;mon++){
  var tmp=3;
  if(mon>3) tmp=4
  if(mon>6) tmp=5
  if(mon>9) tmp=6
c_svg.append("text")
    .attr("transform", "translate("+(cellSize*tmp+(mon-1)*4*cellSize)+"," + cellSize * 3.5 + ")")
    .style("text-anchor", "middle")
    .style("font-size","34px")
    .style("fill","grey")
    .style("opacity","1")
    .text(function(d) { return mon; });
  }*/

var crect = c_svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .attr("opacity",1)
    .on("click",function(d){
       d3.select(this)  ////////
         .transition()
         .duration(250)
         .style("opacity",0.5)
         .transition()
         .duration(250)
         .style("opacity",1)
         
       //console.log(d3.select("this"))
       chosenday=d;
       if(d in cndata)
            change();
       else alert("Missing Data")

    })
    .datum(cformat);



crect.append("title")
    .text(function(d) { return d; });   // xianshi hover de xiaoguo

c_svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);

d3.csv("singleAQI/"+chosenplace, function(error, data) {
  if (error) throw error;
  cndata={}
  data.forEach(function(d){
    d.AQI=+d.AQI;
    //ndata.push([format(formatcsv(d.Date)),d.AQI]);
    cndata[cformat(cformatcsv(d.Date))]=d.AQI;///
  })

 // console.log(ndata)
  crect.filter(function(d) {  return d in cndata; })
      .attr("class", function(d){
           return "day "+ccolor(cndata[d]);
      })
    .select("title")
      .text(function(d) { 
        return d+':AQI '+cndata[d]
      })
   crect.filter(function(d) {  return !(d in cndata); })
      .attr("class", "lostdata")
    .select("title")
      .text(function(d) { 
        return d;
      })
});
//console.log('dfd')

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
      d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}

function calendarChange(){
 
  d3.csv("singleAQI/"+chosenplace, function(error, data) {
  if (error) throw error;
  cndata={}
  //console.log("calendar:"+chosenplace)
  data.forEach(function(d){
    d.AQI=+d.AQI;
    //ndata.push([format(formatcsv(d.Date)),d.AQI]);
    cndata[cformat(cformatcsv(d.Date))]=d.AQI;///
  })

 // console.log(ndata)
  crect.filter(function(d) {  return d in cndata; })
      .attr("class", function(d){
           return "day "+ccolor(cndata[d]);
      })
    .select("title")
      .text(function(d) { 
        return d+':AQI '+cndata[d]
      })
   crect.filter(function(d) {  return !(d in cndata); })
      .attr("class", "lostdata")
    .select("title")
      .text(function(d) { 
        return d;
      })
});
}


//d3.select(self.frameElement).style("height", "2910px");
