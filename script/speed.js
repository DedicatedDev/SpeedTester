var fileName =
  "https://powerful-tor-65140.herokuapp.com/http://212.183.159.230/100MB.zip";
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
  console.log("this is working?");
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
