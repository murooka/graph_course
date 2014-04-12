(function () {
  var nodes = [
    { x:  50, y: 300 },
    { x: 150, y: 250 },
    { x: 150, y: 350 },
    { x: 250, y: 200 },
    { x: 250, y: 300 },
    { x: 250, y: 400 }
  ];

  var edges = [
    { f: 0, t: 1 },
    { f: 0, t: 2 },
    { f: 1, t: 3 },
    { f: 1, t: 4 }
  ];

  var hypot = function (a, b) {
    return Math.sqrt(a * a + b * b);
  };

  var port = function (p1, p2, dist) {
    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;
    var dx = x1 - x2;
    var dy = y1 - y2;
    var d = hypot(dx, dy);
    return { x: x1 - dx * dist / d, y: y1 - dy * dist / d };
  };

  var svg = d3.select("body")
    .append("svg")
    .attr("width", 800)
    .attr("height", 600);

  svg.append("defs").append("marker")
    .attr("id", "arrow-head")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 9)
    .attr("refY", 5)
    .attr("markerWidth", "10")
    .attr("markerHeight", "10")
    .attr("orient", "auto")
  .append("polygon")
    .attr("points", "0,0 10,5 0,10")
    .attr("fill", "black");

  var render = function () {

    svg.selectAll("circle")
      .data(nodes)
    .enter()
      .append("circle")
      .each(function (d) { d.dom = this; })
      .style("stroke", "#1abc9c")
      .style("stroke-width", 4)
      .style("fill", "white")
      .attr("r", 20)
      .attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; });

    svg.selectAll("line")
      .data(edges)
    .enter()
      .append("line")
      .each(function (d) { d.dom = this; })
      .style("stroke", "black")
      .attr("x1", function (d) { var p = port(nodes[d.f], nodes[d.t], 25); console.log(p); return p.x; })
      .attr("y1", function (d) { var p = port(nodes[d.f], nodes[d.t], 25); console.log(p); return p.y; })
      .attr("x2", function (d) { var p = port(nodes[d.t], nodes[d.f], 25); console.log(p); return p.x; })
      .attr("y2", function (d) { var p = port(nodes[d.t], nodes[d.f], 25); console.log(p); return p.y; })
      .attr("marker-end", "url(#arrow-head)");
  };

  render();

})();
