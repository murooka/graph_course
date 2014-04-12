var Point = function (x, y) {
  this.x = x;
  this.y = y;
};

// useful alias
var pt = function (x, y) { return new Point(x, y); };

var hypot = function (a, b) { return Math.sqrt(a * a + b * b); };

Point.prototype.add = function(p) { return pt(this.x + p.x, this.y + p.y); };
Point.prototype.sub = function(p) { return pt(this.x - p.x, this.y - p.y); };
Point.prototype.mul = function(s) { return pt(this.x * s, this.y * s); };
Point.prototype.div = function(s) { return pt(this.x / s, this.y / s); };
Point.prototype.dot = function(p) { return this.x * p.x + this.y * p.y; };
Point.prototype.cross = function(p) { return this.x * p.y - this.y * p.x; };
Point.prototype.abs = function() { return hypot(this.x, this.y); };
Point.prototype.unit = function() { return this.div(this.abs()); };
Point.prototype.rotate = function(r) {
  var s = Math.sin(r);
  var c = Math.cos(r);
  return pt(this.x * c - this.y * s, this.x * s + this.y * c);
};

(function () {
  var nodes = [
    { id: 1, title: 'foo1' , text: 'hogehoge', pos: pt( 50, 300) },
    { id: 2, title: 'foo2' , text: 'hogehoge', pos: pt(150, 250) },
    { id: 3, title: 'bar'  , text: 'hogehoge', pos: pt(150, 350) },
    { id: 4, title: 'baz'  , text: 'hogehoge', pos: pt(250, 200) },
    { id: 5, title: 'hogg' , text: 'hogehoge', pos: pt(250, 300) },
    { id: 6, title: 'ahoge', text: 'hogehoge', pos: pt(250, 400) }
  ];

  var edges = [
    { f: 0, t: 1, curve:-0.3 },
    { f: 0, t: 2, curve: 0.3 },
    { f: 1, t: 3, curve:-0.3 },
    { f: 1, t: 4, curve: 0.3 }
  ];

  _(edges).each(function (e) {
    var t = nodes[e.t].pos;
    var f = nodes[e.f].pos;
    var d = t.sub(f).abs();
    var h = t.sub(f).unit().rotate(Math.PI / 2);
    e.control = t.add(f).div(2).add(h.mul(d*e.curve));
  });

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

  var showPopup = function (d) {
    console.log(d);
    var popup = d3.select('div#course-wrapper')
      .append('div')
      .attr('class', 'course-popup')
      .style('width', '300px')
      .style('height', '200px')
      .style('position', 'absolute')
      .style('display', 'block')
      .style('left', d.pos.x + 40 + 'px')
      .style('top', d.pos.y + 'px')
      .style('background', '#DEF')
      .style('padding', '0 20px');

    popup.append('h1')
      .text(d.title);

    popup.append('p')
      .text(d.text);
  };

  var hidePopup = function (d) {
    d3.selectAll('.course-popup').remove();
  };

  var goToProblem = function (d) {
    alert('go to problem ' + d.id);
  };

  var edgeColor = '#456';
  var nodeColor = '#1abc9c';

  var svg = d3.select('body')
    .append('div')
      .attr('id', 'course-wrapper')
    .append('svg')
      .attr('id', 'problem-course')
      .attr('width', 800)
      .attr('height', 600);

  svg.append('defs').append('marker')
    .attr('id', 'arrow-head')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 6)
    .attr('refY', 5)
    .attr('markerWidth', '5')
    .attr('markerHeight', '5')
    .attr('orient', 'auto')
  .append('polygon')
    .attr('points', '0,0 10,5 0,10')
    .attr('fill', edgeColor);

  var render = function () {

    svg.selectAll('circle')
      .data(nodes)
    .enter()
      .append('circle')
      .style('stroke', nodeColor)
      .style('stroke-width', 4)
      .style('fill', 'white')
      .attr('r', 20)
      .attr('cx', function (d) { return d.pos.x; })
      .attr('cy', function (d) { return d.pos.y; })
      .on('mouseenter', showPopup)
      .on('mouseleave', hidePopup)
      .on('click', goToProblem)
      .on('touch', goToProblem);

      //M 25 25 Q 175 25 175 175
    svg.selectAll('line')
      .data(edges)
    .enter()
      .append('path')
      .each(function (d) { d.dom = this; })
      .style('stroke', edgeColor)
      .style('fill', 'none')
      .style('stroke-width', 3)
      .attr('d', function (d) {
        var p1 = port(nodes[d.f].pos, d.control, 25);
        var c = d.control;
        var p2 = port(nodes[d.t].pos, d.control, 30);
        return 'M '+p1.x+' '+p1.y+' Q '+c.x+' '+c.y+' '+p2.x+' '+p2.y;
      })
      .attr('marker-end', 'url(#arrow-head)');
  };

  render();

})();
