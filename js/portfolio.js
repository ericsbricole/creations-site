$(document).ready(initiatePage);

function initiatePage(){

  let modifySvg = function(mutations){
    let svgToModify = $(mutations[0].target);
    let svgId = svgToModify.attr("id");
    let d3NavPaths = d3.selectAll("#" + svgId +" path")
    // debugger;
    if (svgToModify.hasClass("active") || svgToModify.hasClass("clicked") ){
      d3NavPaths.attr("fill", function() {
                      let path = d3.select(this);
                      let colorToApply = path.attr("class");
                      path.transition()
                          .duration(0)
                          .attr("fill", colorToApply);
                    } )
    }
    else{
      d3NavPaths.attr("fill", function() {
        let path = d3.select(this);
        let colorToApply = path.attr("class");
        path.transition()
            .duration(0)
            .attr("fill", "none");
      } )
    }
}

let observer = new MutationObserver( modifySvg );
  //the a.containsSvg tags will be listened for a ".active" class, triggering colors or animations
  let links = $("a.containsSvg");
  links.each( function(){
    observer.observe( this, { attributes: true })
  } )

  //those 3 listeners allow animations on svgs.
  $("a.containsSvg").mouseenter(function() {
    $(this).addClass("active");
  });
  $(".containsSvg").mouseleave( function() {
    $(this).removeClass("active");
  });
  $(".containsSvg").click( function() {
    $(".containsSvg").removeClass("clicked");
    $(this).addClass("clicked");
  });

  typeSlowly("h2.subTitle","Ingénieur de développement");
  $(".cvSection").hide();
  $(".cvSection").removeAttr("hidden");

  let to_CvSection = $(location).attr('href').split("#")[1]; //for example: to_skills
  if (to_CvSection){
    $("#"+to_CvSection).addClass("clicked");
    let cvSection = to_CvSection.split("_")[1]
    $("#"+cvSection).addClass("currentView");
    $("#"+cvSection).show("slow");
    if (cvSection == "skills")
      skills();
  }
  else{
    $("#to_about").addClass("clicked");
    $("#about").show("slow");
  }

  $("#ulNav>li>.containsSvg").on("click",function(evt){
    //I begin by hiding the previous currentView
    $(".currentView").hide();
    $(".currentView").removeClass("currentView");

    let idToShow = $(this).filter("a").attr("href");
    idToShow = idToShow.split("to_")[1]; //href actually leads to itself and the "a"s  trigger show()
    $("#"+idToShow).show("slow");
    if (idToShow === "skills"){
      skills();
    }
    $("#" + idToShow).addClass("currentView");
  });

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

  var starPaths = d3.selectAll("#skills path")
              .attr("d", starD)
              .attr("transform", "scale(3)")
              .attr("stroke", "black")
              .attr("stroke-width", "0.7")
              .attr("fill", "none");

  starPaths
    .attr("stroke-dasharray", function() {return this.getTotalLength() + " " + this.getTotalLength()})
    .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
    .transition()
      .duration(2000)
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

    correctBBox();
}

function typeSlowly(selector, content){
  let svg = d3.select(selector)
    .append("svg");
  svg
    .append("text")
    .attr("x",0)
    .attr("y",50);
  
  for (var i = 0; i < content.length; i++){
    let newChar = content[i];
    setTimeout( () => {
      let text = svg.select("text");
      text.text( text.text() + newChar );
      correctBBox();
    }, i*100, newChar, svg);
  }
}

function correctBBox(){
  $("svg").each(function(){
    let svg = this;
    let bbox = this.getBBox();
    svg.setAttribute("viewBox", (bbox.x-10)+" "+(bbox.y-10)+" "+(bbox.width+20)+" "+(bbox.height+20));
    svg.setAttribute("width", (bbox.width+20)  + "px");
    svg.setAttribute("height",(bbox.height+20) + "px");
    });
  }
}
