$(document).ready(initiatePage);

function initiatePage(){

  //TODO? put a hidden attribute in the html and delete it after this hide(), in case they can be briefly seen.
  $(".cvSection").hide();
  $("#ulNav>li>.containsSvg").on("click",function(evt){
    //I begin by hiding the previous currentView
    $(".currentView").hide();
    $(".currentView").removeClass("currentView");

    let idToShow = $(this).filter("a").attr("href");
    idToShow = idToShow.split("to_")[1]; //href actually leads to itself and has to trigger a show()
    $("#"+idToShow).show();
    if (idToShow === "skills"){
      skills();
    }
    $(idToShow).addClass("currentView");
  });
}

// d3.select("#aboutSvg").on("mouseenter", function(){
//   let navSvg = d3.selectAll("#aboutSvg path");
//   navSvg.attr("stroke-dasharray", function() {return this.getTotalLength() + " " + this.getTotalLength()})
//                   .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
//                   .transition()
//                   .duration(1500)
//                   .ease(d3.easeLinear)
//                   .attr("stroke-dashoffset", 0);
  
// } )


// d3.select("#projectsSvg").on("mouseenter", function(){
//   let navSvg = d3.selectAll("#projectsSvg path");
//   navSvg.attr("stroke-dasharray", function() {return this.getTotalLength() + " " + this.getTotalLength()})
//                   .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
//                   .transition()
//                   .duration(1500)
//                   .ease(d3.easeLinear)
//                   .attr("stroke-dashoffset", 0);
// } )

$("#ulNav").on("click", "svg", drawNavSvg);
function drawNavSvg(){
  let d3NavSvg = d3.selectAll("#"+ this.id + " path");
  d3NavSvg.attr("stroke-dasharray", function() {return this.getTotalLength() + " " + this.getTotalLength()})
          .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
          .transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
}

$(".containsSvg").mouseenter(modifySvg);
$(".containsSvg").mouseleave(restoreSvg);

function modifySvg(){
  let svgId = $(this).children().get(1).id;
  let d3NavPaths = d3.selectAll("#" + svgId +" path")
                .attr("fill", function() {
                  let path = d3.select(this);
                  let colorToApply = path.attr("class");
                  path.transition()
                      .duration(0)
                      .attr("fill", colorToApply);
                } )
}

function restoreSvg(){
  let svgId = $(this).children().get(1).id;
  let d3NavPaths = d3.selectAll("#" + svgId +" path")
                .attr("fill", function() {
                  let path = d3.select(this);
                  path.transition()
                      .duration(0)
                      .attr("fill", "none");
                } )
}

function skills(){
  //befor any animation, removing the previous stars
  if (!$.isEmptyObject($("#skills svg")) ){
    $(".starDiv").children().remove();
  }
var skillPaths = d3.selectAll(".starDiv")
  .append("svg")
  .append("path")
  .attr("width","100%");

//jQuery is more convenient for setting the paths'classes based on their respective grandparent div
$(".starDiv").each(function(){
  let starPath = $(this).find("path");
  if ($(this).hasClass("fullStarDiv"))
    starPath.addClass("fullStar");
  else if ($(this).hasClass("halfStarDiv"))
    starPath.addClass("halfStar");
  else if ($(this).hasClass("emptyStarDiv"))
    starPath.addClass("emptyStar");
})

var defs = d3.selectAll("svg")
  .append("defs");

var linearGradient = defs.append("linearGradient")
  .attr("id","linearGradientToHalf") //unique id for reference
  .attr("x1","0%")
  .attr("x2","100%")

linearGradient.append("stop")
  .attr('class', 'start')
  .attr("offset", "50%")
  .attr("stop-color", "yellow")
  .attr("stop-opacity", 1);

linearGradient.append("stop")
  .attr('class', 'end')
  .attr("offset", "50%")
  .attr("stop-color", "white")
  .attr("stop-opacity", 1);

var starD = "M 15.438435,18.119234 9.5820455,14.754741 3.7288733,18.124829 5.118973,11.515385 0.10509911,6.9901021 6.8206179,6.2697351 9.5750456,0.10286826 12.335365,6.2671005 19.051569,6.9810503 14.042021,11.511122 Z";
var phoneD = "M34,0H4C1.791,0,0,1.791,0,4v60c0,2.209,1.791,4,4,4h30c2.209,0,4-1.791,4-4V4C38,1.791,36.209,0,34,0z   M12,3h14c0.276,0,0.5,0.224,0.5,0.5S26.276,4,26,4H12c-0.276,0-0.5-0.224-0.5-0.5S11.724,3,12,3z M19,65c-1.104,0-2-0.896-2-2  s0.896-2,2-2s2,0.896,2,2S20.104,65,19,65z M35,59H3V6h32V59z";

var starViewBox = "0 0 210 297";
var phoneViewBox = "0 0 38 68";
var starPaths = d3.selectAll("#aboutSvg path")
            .attr("d", starD)
            .attr("transform", "scale(3)")
            .attr("stroke", "black")
            .attr("stroke-width", "0.7")
            .attr("fill", "none");

starPaths
  .attr("stroke-dasharray", function() {return this.getTotalLength() + " " + this.getTotalLength()})
  .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
  .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0)
  .transition()
  .duration(3000)
  .attr("fill", function() {
    switch (d3.select(this).attr("class")){
      case "fullStar":
        return "yellow";
      case "halfStar":
        return "url(#linearGradientToHalf)";
      case "emptyStar":
        return "white";
    }
  });

  $("svg").each(function(){
    let svg = this;
    let bbox = this.getBBox();
    svg.setAttribute("viewBox", (bbox.x-10)+" "+(bbox.y-10)+" "+(bbox.width+20)+" "+(bbox.height+20));
    svg.setAttribute("width", (bbox.width+20)  + "px");
    svg.setAttribute("height",(bbox.height+20) + "px");
    });
  }