const knob = pureknob.createKnob(360, 360);
function demoKnob() {
  // Create knob element, 300 x 300 px in size.
  // Set properties.
  knob.setProperty("angleStart", -0.75 * Math.PI);
  knob.setProperty("angleEnd", 0.75 * Math.PI);
  knob.setProperty("colorFG", "#88ff88");
  knob.setProperty("colorTrack", "rgb(36,46,78)");
  knob.setProperty("trackWidth", 0.2);
  knob.setProperty("valMin", 0);
  knob.setProperty("valMax", 100);
  knob.setProperty("valPeaks", [0, 1, 5, 10, 20, 30, 50, , 75, 100]);
  knob.setProperty("label", "18.93");
  knob.setProperty("readonly", true);

  //knob.setProperty("needle", true);

  // Set initial value.
  knob.setValue(0);

  /*
   * Event listener.
   *
   * Parameter 'knob' is the knob object which was
   * actuated. Allows you to associate data with
   * it to discern which of your knobs was actuated.
   *
   * Parameter 'value' is the value which was set
   * by the user.
   */
  const listener = function (knob, value) {
    console.log(value);
  };

  knob.addListener(listener);

  // Create element node.
  const node = knob.node();

  // Add it to the DOM.
  const elem = document.getElementById("current_speed");
  elem.appendChild(node);
}

/*
 * Demo code for bar graph element.
 */
function demoBarGraph() {
  const body = document.getElementsByTagName("body")[0];
  const graph = pureknob.createBarGraph(400, 40);
  graph.setProperty("colorFG", "#44ff44");
  graph.setProperty("colorMarkers", "#ffffff");
  graph.setProperty("markerStart", -60);
  graph.setProperty("markerEnd", 0);
  graph.setProperty("markerStep", 10);
  graph.setProperty("valMin", -145);
  graph.setProperty("valMax", 0);
  graph.setValue(-25);
  graph.setPeaks([-18]);
  const node = graph.node();
  body.appendChild(node);
  window.graph = graph;

  /*
   * This is executed on each timer tick.
   */
  const t = function (e) {
    let v = graph.getValue();

    /*
     * As long as value is greater than -80, decrement it.
     */
    if (v > -80) {
      v--;
      graph.setValue(v);
    }
  };

  window.setInterval(t, 200);
}

/*
 * This is executed after the document finished loading.
 */
function ready() {
  demoKnob();
  //demoBarGraph();
}

document.addEventListener("DOMContentLoaded", ready, false);
