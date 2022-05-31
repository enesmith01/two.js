import Two from 'https://cdn.skypack.dev/two.js@latest';

const container = document.querySelector("section");
let params = { width: 500, height: 500 };


var squished = false;

var two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(container);

two.renderer.domElement.style.background = 'rgb(252, 136, 216)';

var radius = two.height / 5;
var resolution = 32;
var circle = new Two.Circle(0, 0, radius, resolution);
var blob = new Two.Path(circle.vertices);
blob.fill = 'red';
blob.noStroke();

blob.closed = true;
blob.curved = true;
blob.automatic = true;

two.add(blob);

reset();

two.bind('update', update).play();

function update() {

  if (!squished) {

    for (var i = 0; i < blob.vertices.length; i++) {
      var v = blob.vertices[i];
      var d = v.destination;

      if (v.equals(d)) {
        squished = true;
        break;
      }

      v.x += (d.x - v.x) * 0.125;
      v.y += (d.y - v.y) * 0.125;
    }

    return;
  }

  var outside = true;

  for (var i = 0; i < blob.vertices.length; i++) {
    var v = blob.vertices[i];
    v.y += v.step;
    v.step *= 1.125;
    if (v.y < two.height) {
      outside = false;
    }
  }

  if (outside) {
    reset();
  }

}

function reset() {

  blob.translation.set(two.width / 2, two.height / 2);

  squished = false;

  for (var i = 0; i < blob.vertices.length; i++) {
    var v = blob.vertices[i];
    var pct = (i + 1) / blob.vertices.length;
    var theta = pct * Math.PI * 2;
    var radius = Math.random() * two.height / 3 + two.height / 6;
    var x = radius * Math.cos(theta);
    var y = radius * Math.sin(theta);
    v.set(two.height / 3 * Math.cos(theta), two.height / 3 * Math.sin(theta));
    v.destination = new Two.Vector(x, y);
    v.step = Math.sqrt(Math.random()) + 2;
  }

}