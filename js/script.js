var id = 1;

(function() {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "progress");
  svg.setAttribute("width", 500);
  svg.setAttribute("height", 500);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", `0 0 ${500} ${500}`);

  slider1 = new circularSlider({
    container: svg,
    color: "#663A69",
    range: [100, 1000],
    step: 1,
    radius: 250,
    text: "Transportation"
  });
  slider1.handleInput();

  slider2 = new circularSlider({
    container: svg,
    color: "#0075B0",
    range: [0, 800],
    step: 1,
    radius: 200,
    text: "Food"
  });
  slider2.handleInput();

  slider3 = new circularSlider({
    container: svg,
    color: "#009D33",
    range: [0, 2350],
    step: 1,
    radius: 150,
    text: "Insurance"
  });
  slider3.handleInput();

  slider4 = new circularSlider({
    container: svg,
    color: "#FF7D36",
    range: [0, 1567],
    step: 1,
    radius: 100,
    text: "Entertainment"
  });
  slider4.handleInput();

  slider5 = new circularSlider({
    container: svg,
    color: "#FF394B",
    range: [0, 500],
    step: 1,
    radius: 50,
    text: "Health care"
  });
  slider5.handleInput();

  document.querySelector(".sliderContainer").appendChild(svg);
})();

function circularSlider(options) {
  var mouseDown = false;

  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", id);
  id++;

  var progressMeter = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  progressMeter.setAttribute("class", "progress__meter");
  progressMeter.setAttribute("cx", options.container.getAttribute("width") / 2);
  progressMeter.setAttribute("cy", options.container.getAttribute("width") / 2);
  progressMeter.setAttribute("r", options.radius - 6);
  progressMeter.setAttribute("stroke-width", 12);

  var progressValue = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  progressValue.setAttribute("class", "progress__value");
  progressValue.setAttribute("cx", options.container.getAttribute("width") / 2);
  progressValue.setAttribute("cy", options.container.getAttribute("width") / 2);
  progressValue.setAttribute("r", options.radius - 6);
  progressValue.setAttribute("stroke-width", 12);
  progressValue.style.stroke = options.color;

  var dial = document.createElement("div");
  dial.setAttribute("class", "dial");

  var input = document.createElement("input");
  input.setAttribute("type", "range");
  input.setAttribute("id", "control");
  input.setAttribute("name", "points");
  input.setAttribute("min", options.range[0]);
  input.setAttribute("max", options.range[1]);
  input.setAttribute("step", options.step);
  input.setAttribute("value", options.range[0]);
  input.addEventListener("input", e => {
    this.progress(input.valueAsNumber);
  });

  var pricing = document.createElement("span");
  pricing.setAttribute("class", "pricing");
  pricing.textContent = "$" + options.range[0];

  var box = document.createElement("span");
  box.setAttribute("class", "box");
  box.setAttribute("style", "background-color: " + options.color);

  var text = document.createElement("span");
  text.setAttribute("class", "text");
  text.textContent = options.text;

  var div = document.createElement("div");
  div.setAttribute("class", "textContainer");

  group.appendChild(progressMeter);
  group.appendChild(progressValue);
  // group.appendChild(dial);
  // group.appendChild(input);
  options.container.appendChild(group);

  div.appendChild(pricing);
  div.appendChild(box);
  div.appendChild(text);
  document.querySelector(".price").appendChild(div);

  this.handleInput = () => {
    group.addEventListener("mouseup", e => {
      // e.path[1].style.zIndex = '0';
      group.style.zIndex = "0";
      mouseDown = false;
    });
    group.addEventListener("touchend", e => {
      // e.path[1].style.zIndex = '0';
      group.style.zIndex = "0";
      mouseDown = false;
    });
    group.addEventListener("mousedown", e => {
      // e.path[1].style.zIndex = '123';
      group.style.zIndex = "123";
      mouseDown = true;
    });
    group.addEventListener("touchstart", e => {
      // e.path[1].style.zIndex = '123';
      group.style.zIndex = "123";
      mouseDown = true;
    });
    progressMeter.addEventListener("click", this.update);
    progressValue.addEventListener("click", this.update);
    document.addEventListener("mousemove", this.update);
    document.addEventListener("mouseup", () => {
      group.style.zIndex = "0";
      mouseDown = false;
    });
    document.addEventListener("touchmove", this.update, { passive: false });
  };

  this.update = e => {
    if (e.type != "click") {
      if (!mouseDown || options.range[1] == 0) return;
      this.move(e);
    } else {
      this.move(e);
    }
  };

  this.move = e => {
    // e.path[1].style.zIndex = '123';
    // sliderContainer.style.zIndex = '123';

    // console.log('Event: ' + e.type);
    var position;
    if (
      e.type == "mouseup" ||
      e.type == "mousedown" ||
      e.type == "mousemove" ||
      e.type == "click"
    ) {
      position = { x: e.pageX, y: e.pageY };
    } else if (
      e.type == "touchend" ||
      e.type == "touchstart" ||
      e.type == "touchmove"
    ) {
      e.preventDefault();
      position = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    var dialRadius = dial.offsetWidth / 2;
    var coords = {
      x: position.x - group.getBoundingClientRect().left,
      y: position.y - group.getBoundingClientRect().top
    };
    var atan = Math.atan2(coords.x - options.radius, coords.y - options.radius);
    var deg = Math.ceil(-atan / (Math.PI / 180) + 180);

    var x =
      Math.ceil((options.radius - 5) * Math.sin(deg * Math.PI / 180)) +
      options.radius +
      "px";
    var y =
      Math.ceil((options.radius - 5) * -Math.cos(deg * Math.PI / 180)) +
      options.radius +
      "px";
    var points = Math.ceil(deg * options.range[1] / 360);

    dial.style.transform = "translate(" + x + "," + y + ")";

    // console.log(text.textContent + ": $" + points);
    input.value = points;
    pricing.textContent = "$" + input.value;
    this.progress(input.value);
  };

  this.progress = value => {
    // console.log('Value: ' + value);
    progressValue.style.strokeDasharray = 2 * Math.PI * (options.radius - 6);
    var progress = value / options.range[1];
    var dashoffset = 2 * Math.PI * (options.radius - 6) * (1 - progress);
    // console.log('dashoffset: ' + dashoffset);
    progressValue.style.strokeDashoffset = dashoffset;
  };

  this.progress(input.value);

  var xx =
    Math.ceil((options.radius - 5) * Math.sin(1 * Math.PI / 180)) +
    options.radius +
    "px";
  var yy =
    Math.ceil((options.radius - 5) * -Math.cos(1 * Math.PI / 180)) +
    options.radius +
    "px";
  dial.style.transform = "translate(" + xx + "," + yy + ")";
}
