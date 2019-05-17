var container = document.body;

// slide options
var slideEase = function(t) {
    return t * t * t;
  },
  slideDuration = 1000;

// text options
var delay = {
  before: 300,
  between: 200,
  after: 2500
};

var urlParams;
(window.onpopstate = function () {
  var match,
    pl     = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query  = window.location.search.substring(1);

  urlParams = {};
  while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);
})();

var site = urlParams["sites"];
var category = urlParams["categories"] == "todas" ? "" : urlParams["categories"];
var cols = urlParams["cols"] < 1 ? 5 : urlParams["cols"];
var rows = urlParams["rows"] < 1 ? 5 : urlParams["rows"];
var trend_type = urlParams["trend_type"] || "nombre";

var trends = ['cargando trends de ' + site + "..."];


const images = require("google-images");

images.search('Halo', function (err, images) {
  console.log(images)
})

images.search("Halo", function (error, images) {
  console.log(images);
});


fetch('https://api.mercadolibre.com/trends/' + site + "/" + category)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    if (myJson) {
      if (trend_type == "imagen") {
        // trends = myJson.map(function(i) {return search()})
      } else {
        trends = myJson.map(function(i) {return i.keyword});
      }
    } else {
      trends = ["No hay trends de" + site];
    }
  });



function randomTrend() {
  return trends[Math.floor(trends.length * Math.random())];
}

// colors
var colors = ['#ff3031', '#68ac0d', '#00a8da', '#fbc500'];
function randomColor() {
  return colors[Math.floor(colors.length * Math.random())];
}

var Cell = function(x, y) {
  // create the node
  var node = document.createElement('div');
  node.className = 'cell';
  var width = 100 / cols;
  var height = 100 / rows;


  node.style.width = width + '%';
  node.style.height = height+ '%';
  node.style.left = x * width + '%';
  node.style.top  = y * height + '%';
  this.node = node;

  // create and add the panes
  var panes = [new Pane(this), new Pane(this)];
  node.appendChild(panes[0].node);
  node.appendChild(panes[1].node);
  panes[0].setOtherNode(panes[1].node);
  panes[1].setOtherNode(panes[0].node);

  // handles sliding in next pane
  var currentPane = 0;
  this.nextPane = function() {
    // swap z-indexes
    panes[currentPane].node.style.zIndex = '-1';
    currentPane = ++currentPane % 2;
    panes[currentPane].node.style.zIndex = '1';

    panes[currentPane].init();
  }

  // quickstart
  panes[0].quickStart();
  panes[0].node.style.zIndex = '1';
}

var Pane = function(cell) {
  var otherNode;
  this.setOtherNode = function(other) {
    otherNode = other;
  }

  // create the node
  var node = document.createElement('div');
  node.className = 'pane';
  this.node = node;

  // a place to write the trends
  var trend = document.createElement('a');
  trend.className = 'trend';
  node.appendChild(trend);

  // (re-)initialize pane when sliding in
  this.init = function() {
    var dir = Math.floor(4 * Math.random());
    switch (dir) {
      case 0:
        slideStart = {left:0,top:-100};
        break;
      case 1:
        slideStart = {left:100,top:0};
        break;
      case 2:
        slideStart = {left:0,top:100};
        break;
      case 3:
        slideStart = {left:-100,top:0};
        break;
    }
    // make sure it's a different background color
    do
      node.style.backgroundColor = randomColor();
    while (node.style.backgroundColor == otherNode.style.backgroundColor);

    trend.title = randomTrend();
    trend.href = 'https://www.google.com/search?q=' + trend.title;
    trend.innerHTML = '';

    // start sliding in
    slideValue = 0;
    slideIn();
  }

  // handles sliding in
  var slideStart,
    slideValue;
  var slideIn = function() {
    slideValue += 20 / slideDuration;
    if (slideValue >= 1) {
      // end of sliding in
      slideValue = 1;
      setTimeout(nextChar, delay.before);
    } else {
      setTimeout(slideIn, 20);
    }
    node.style.left = slideEase(1 - slideValue) * slideStart.left + '%';
    node.style.top  = slideEase(1 - slideValue) * slideStart.top  + '%';
    // push other node away
    otherNode.style.left =
      (slideEase(1 - slideValue) - 1) * slideStart.left + '%';
    otherNode.style.top  =
      (slideEase(1 - slideValue) - 1) * slideStart.top  + '%';
  }

  // handles text
  var nextChar = function() {
    if (trend.innerHTML.length < trend.title.length) {
      trend.innerHTML =
        trend.title.slice(0, trend.innerHTML.length + 1);
      setTimeout(nextChar, delay.between);
    } else {
      setTimeout(cell.nextPane, delay.after);
    }
  }

  // initial start
  this.quickStart = function() {
    node.style.backgroundColor = colors[3];
    trend.title = randomTrend();
    trend.href = 'https://www.google.com/search?q=' + trend.title;
    nextChar();
  }
}

// create the cells
var cells = [];
for (var i = 0; i < cols * rows; i++) {
  cells[i] = new Cell(i % cols, Math.floor(i / rows));
  container.appendChild(cells[i].node);
}

// handles font size on resize
// quick and dirty, needs a fix
function calcFontsize() {
  var fontSize = Math.min(
    container.clientHeight / 18,
    container.clientWidth / 46
  );
  fontSize = Math.floor(fontSize);
  container.style.fontSize = fontSize + 'px';
}
calcFontsize();
window.onresize = calcFontsize;