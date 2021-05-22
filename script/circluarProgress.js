var ring = document.getElementsByTagName("path")[0];
var range = document.getElementById("control");
var text = document.getElementsByTagName("text")[0];
var toRadians = Math.PI / 180;
var r = 130;
var toRadians = Math.PI / 180;

function draw(progress = 0) {
  let degrees = progress * 3.5999;
  let rad = degrees * toRadians;
  let x = (Math.sin(rad) * r).toFixed(2);
  let y = -(Math.cos(rad) * r).toFixed(2);
  let lenghty = Number(degrees > 180);
  let descriptions = ["M", 0, 0, "v", -r, "A", r, r, 1, lenghty, 1, x, y, "z"];
  ring.setAttribute("d", descriptions.join(" "));
  text.textContent = progress;
}
ring.setAttribute("transform", "translate(" + r + ", " + r + ")");
draw();
