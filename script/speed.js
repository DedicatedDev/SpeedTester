var fileName =
  "https://powerful-tor-65140.herokuapp.com/http://212.183.159.230/100MB.zip";
// "http://speedtest.tupelo.matraex.com/100MB.txt";
function abort() {
  request.abort();
}

const initialOptions = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        label: "speed",
        borderColor: "#3e95cd",
        fill: false,
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "World population per region (in millions)",
    },
  },
};

const ctx = document.getElementById("line-chart");
const speedGraph = new Chart(ctx, initialOptions);

let times = [];
let speeds = [];
let totalSpeeds = 0;
function download() {
  console.log("this is working?")
  times = [];
  speeds = [];
  totalSpeeds = 0;
  var startTime = new Date().getTime();
  request = new XMLHttpRequest();
  request.responseType = "arraybuffer";
  request.open("get", fileName, true);
  request.send();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var obj = window.URL.createObjectURL(this.response);
      document.getElementById("save-file").setAttribute("href", obj);
      document.getElementById("save-file").setAttribute("download", fileName);
      setTimeout(function () {
        window.URL.revokeObjectURL(obj);
      }, 60 * 1000);
    }
  };

  request.onprogress = function (e) {
    var percent_complete = (e.loaded / e.total) * 100;
    percent_complete = Math.floor(percent_complete);
    var duration = (new Date().getTime() - startTime) / 1000;
    var bps = e.loaded / duration;
    var kbps = bps / 1024;
    kbps = Math.floor(kbps);
    totalSpeeds += kbps;
    var time = (e.total - e.loaded) / bps;
    var currentTime = e.loaded / bps;
    var seconds = currentTime % 60;
    var minutes = currentTime / 60;
    seconds = Math.floor(seconds);
    minutes = Math.floor(minutes);
    times.push(`${minutes}:${seconds}`);
    speeds.push(kbps);
    meanSpeeds = totalSpeeds / (speeds.length ?? 1);
    speedGraph.data.labels.push(`${minutes}:${seconds}`);
    speedGraph.data.datasets.forEach((dataset) => {
      dataset.data.push(kbps);
    });
    speedGraph.update();
  };
}

function progressBar(progressVal, totalPercentageVal = 100) {
  var strokeVal = (4.64 * 100) / totalPercentageVal;
  var x = document.querySelector(".progress-circle-prog");
 // x.style.strokeDasharray = progressVal * strokeVal + " 999";
  // var el = document.querySelector(".progress-text");
  // var from = $(".progress-text").data("progress");
  // $(".progress-text").data("progress", progressVal);
  // var start = new Date().getTime();

  // setTimeout(function () {
  //   var now = new Date().getTime() - start;
  //   var progress = now / 700;
  //   el.innerHTML = (progressVal / totalPercentageVal) * 100 + "%";
  //   if (progress < 1) setTimeout(arguments.callee, 10);
  // }, 10);
}

progressBar(30, 100);

