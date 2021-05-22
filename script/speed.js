var fileName =
  "https://powerful-tor-65140.herokuapp.com/http://212.183.159.230/20MB.zip";
function abort() {
  request.abort();
  resetTester();
}

function resetTester() {
  testButton.disabled = false;
  testButton.style.setProperty("opacity", 1.0);
  times = [];
  speeds = [];
  totalSpeeds = 0;
  resetGraph();
  draw(0);
}

const initialOptions = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        label: "speed",
        borderColor: "#4ADA0C",
        borderWidth: 1,
        lineTension: 0.25,
        pointRadius: 0,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1.5,
      easing: "linear",
    },
    legend: false,
    scales: {
      xAxes: [
        {
          type: "time",
          display: true,
        },
      ],
      YAxes: [
        {
          type: "speed",
          display: true,
        },
      ],
    },
  },
};

const testButton = document.getElementById("startBtn");
const ctx = document.getElementById("line-chart");
const speedGraph = new Chart(ctx, initialOptions);
const numb = document.querySelector(".numb");

let times = [];
let speeds = [];
let totalSpeeds = 0;
retrieveSavedData();
function download() {
  testButton.style.setProperty("opacity", 0);
  testButton.disabled = true;
  times = [];
  speeds = [];
  totalSpeeds = 0;
  resetGraph();
  var startTime = new Date().getTime();
  request = new XMLHttpRequest();
  request.responseType = "arraybuffer";
  request.open("get", fileName, true);
  request.send();

  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
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

    speedGraph.data.labels.push(`${minutes}:${seconds}`);
    speedGraph.data.datasets.pointRadius = 0;
    speedGraph.data.datasets.forEach((dataset) => {
      dataset.data.push(kbps);
    });
    speedGraph.update();
    draw(percent_complete);

    if (percent_complete === 100) {
      const deltaCnt = Math.floor(speeds.length * 0.1);
      const initNo = deltaCnt + 1;
      const totalNo = speeds.length - 2 * deltaCnt;
      if (totalNo > 0) {
        const validData = speeds.slice(initNo, totalNo);
        meanSpeeds = 0;
        validData.forEach((element) => {
          meanSpeeds += element;
        });
        meanSpeeds = (meanSpeeds / totalNo).toFixed(2);
      }

      var testTime = new Date().toISOString();
      var newData = {
        testTime: testTime,
        speed: meanSpeeds,
        server: currentServerUrl,
      };
      const oldJStringData = localStorage.getItem("data");
      let oldData = JSON.parse(oldJStringData);
      if (oldData == null) {
        oldData = { testData: [] };
      }
      console.log(oldData);
      oldData.testData.push(newData);
      var jsonString = JSON.stringify(oldData);
      localStorage.setItem("data", jsonString);
      retrieveSavedData(newData);
    }
  };
}

function resetGraph() {
  speedGraph.data.labels = [];
  speedGraph.data = initialOptions.data;
  speedGraph.options = initialOptions.options;
}

function retrieveSavedData(newData) {
  const savedData = JSON.parse(localStorage.getItem("data"));
  if (newData == null) {
    var index = 1;
    savedData.testData.forEach((element) => {
      addNewItem(index, element);
      index++;
    });
  } else {
    const newIndex = savedData.testData.length;
    addNewItem(newIndex, newData);
  }
}

function addNewItem(index, element) {
  const dataTable = document.getElementById("savedDataList");
  let cell = document.createElement("tr");
  const scope = document.createElement("th");
  scope.innerHTML = `${index}`;
  const date = document.createElement("td");
  date.innerHTML = `${element.testTime}`;
  const speed = document.createElement("td");
  speed.innerHTML = `${element.speed}`;
  const server = document.createElement("td");
  server.innerHTML = `${element.server}`;
  cell.appendChild(scope);
  cell.appendChild(date);
  cell.appendChild(speed);
  cell.appendChild(server);
  dataTable.appendChild(cell);
}

function changedServer(serverIndex) {
  const dropDown = document.getElementById("dropdownMenuButton");
  selectedServerUrl = serverUrls[serverIndex];
  switch (serverIndex) {
    case 1:
      dropDown.innerHTML = "Server 2";
    default:
      dropDown.innerHTML = "Server 1";
      break;
  }
}
