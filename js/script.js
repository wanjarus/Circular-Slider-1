(function() {
  var container = document.getElementById("container");

  slider1 = new circularSlider({
    container: container,
    color: "#663A69",
    range: [0, 1000],
    step: 1,
    radius: 250,
    text: "Transportation"
  });
  slider1.handleInput();

  slider2 = new circularSlider({
    container: container,
    color: "#0075B0",
    range: [0, 800],
    step: 1,
    radius: 200,
    text: "Food"
  });
  slider2.handleInput();

  slider3 = new circularSlider({
    container: container,
    color: "#009D33",
    range: [0, 2350],
    step: 1,
    radius: 150,
    text: "Insurance"
  });
  slider3.handleInput();

  slider4 = new circularSlider({
    container: container,
    color: "#FF7D36",
    range: [0, 1567],
    step: 1,
    radius: 100,
    text: "Entertainment"
  });
  slider4.handleInput();

  slider5 = new circularSlider({
    container: container,
    color: "#FF394B",
    range: [0, 500],
    step: 1,
    radius: 50,
    text: "Health care"
  });
  slider5.handleInput();

})();

function circularSlider(options) {
  var mouseDown = false;
  var CIRCUMFERENCE = 2 * Math.PI * (options.radius - 6);

  var sliderContainer = document.createElement("div");
  sliderContainer.setAttribute("class", "sliderContainer");

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "progress");
  svg.setAttribute("width", options.radius * 2);
  svg.setAttribute("height", options.radius * 2);
  svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
  svg.setAttribute(
    "viewBox",
    `0 0 ${options.radius * 2} ${options.radius * 2}`
  );

  var progressMeter = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  progressMeter.setAttribute("class", "progress__meter");
  progressMeter.setAttribute("cx", options.radius);
  progressMeter.setAttribute("cy", options.radius);
  progressMeter.setAttribute("r", options.radius - 6);
  progressMeter.setAttribute("stroke-width", 12);

  var progressValue = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  progressValue.setAttribute("class", "progress__value");
  progressValue.setAttribute("cx", options.radius);
  progressValue.setAttribute("cy", options.radius);
  progressValue.setAttribute("r", options.radius - 6);
  progressValue.setAttribute("stroke-width", 12);
  progressValue.style.stroke = options.color;

  var dial = document.createElement('div');
  dial.setAttribute('class', 'dial');

  var input = document.createElement("input");
  input.setAttribute("type", "range");
  input.setAttribute("id", "control");
  input.setAttribute("name", "points");
  input.setAttribute("min", options.range[0]);
  input.setAttribute("max", options.range[1]);
  input.setAttribute("step", options.step);
  input.setAttribute("value", "0");
  input.addEventListener("input", function(event) {
    this.progress(event.target.valueAsNumber);
  });

  var pricing = document.createElement("span");
  pricing.setAttribute('class', 'pricing');
  pricing.textContent = "$" + options.range[0];

  var box = document.createElement("span");
  box.setAttribute('class', 'box');
  box.setAttribute("style", "background-color: " + options.color);

  var text = document.createElement("span");
  text.setAttribute('class', 'text');
  text.textContent = options.text;

  var div = document.createElement("div");
  div.setAttribute('class', 'textContainer');

  svg.appendChild(progressMeter);
  svg.appendChild(progressValue);

  sliderContainer.appendChild(svg);
  sliderContainer.appendChild(dial);
  sliderContainer.appendChild(input);

  div.appendChild(pricing);
  div.appendChild(box);
  div.appendChild(text);
  document.querySelector('.price').appendChild(div);

  options.container.appendChild(sliderContainer);

  this.handleInput = () => {
    sliderContainer.addEventListener("mouseup", (e) => {
      e.path[1].style.zIndex = '0';
      mouseDown = false;
    });
    sliderContainer.addEventListener("mousedown", (e) => {
      e.path[1].style.zIndex = '123';
      mouseDown = true;
    });
    progressMeter.addEventListener("click", this.update);
    progressValue.addEventListener("click", this.update);
    document.addEventListener("mousemove", this.update);
  };

  this.update = (e) => {
    if(e.type != 'click') {
      if (!mouseDown || options.range[1] == 0) return;
      this.move(e);
    } else {
      this.move(e);
    }
  };

  this.move = (e) => {
    e.path[1].style.zIndex = '123';

    var position = { x: e.pageX, y: e.pageY };
    var dialRadius = dial.offsetWidth / 2;
    var coords = {
      x: position.x - sliderContainer.offsetLeft,
      y: position.y - sliderContainer.offsetTop
    };
    var atan = Math.atan2(coords.x - options.radius, coords.y - options.radius);
    var deg = Math.ceil(-atan / (Math.PI / 180) + 180);

    var x = Math.ceil((options.radius - 5) * Math.sin(deg * Math.PI / 180)) + options.radius + "px";
    var y = Math.ceil((options.radius - 5) * -Math.cos(deg * Math.PI / 180)) + options.radius + "px";
    var points = Math.ceil(deg * options.range[1] / 360);

    dial.style.transform = "translate(" + x + "," + y + ")";

    console.log(text.textContent + ": $" + points);
    pricing.textContent = "$" + points;
    this.progress(points);
  }

  this.progress = (value) => {
    var progress = value / options.range[1];
    var dashoffset = CIRCUMFERENCE * (1 - progress);
    progressValue.style.strokeDashoffset = dashoffset;
  };

  progressValue.style.strokeDasharray = CIRCUMFERENCE;
  this.progress(input.value);

  var xx = Math.ceil((options.radius - 5) * Math.sin(1 * Math.PI / 180)) + options.radius + "px";
  var yy = Math.ceil((options.radius - 5) * -Math.cos(1 * Math.PI / 180)) + options.radius + "px";
  dial.style.transform = "translate(" + xx + "," + yy + ")"; // jQuery
}
