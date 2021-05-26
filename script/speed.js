// var fileName =
//   "https://powerful-tor-65140.herokuapp.com/https://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"; //"http://speedtest.tupelo.matraex.com/100MB.txt";
// //"https://powerful-tor-65140.herokuapp.com/http://212.183.159.230/100MB.zip";
// var fileName =
//   "https://powerful-tor-65140.herokuapp.com/http://212.183.159.230/100MB.zip";
function abort() {
  request.abort();
  resetTester();
}

function stop() {
  request.abort();
}

function resetTester() {
  testButton.disabled = false;
  testButton.style.setProperty("opacity", 1.0);
  times = [];
  speeds = [];
  totalSpeeds = 0;
  resetGraph();
  draw(0);
  knob.setValue(0);
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
// function download() {
//   var userImageLink =
//     "https://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg";
//   var time_start, end_time;

//   // The size in bytes
//   var downloadSize = 5616998;
//   var downloadImgSrc = new Image();

//   downloadImgSrc.onload = function () {
//     end_time = new Date().getTime();
//     displaySpeed();
//   };
//   time_start = new Date().getTime();
//   downloadImgSrc.src = userImageLink;
//   document.write("time start: " + time_start);
//   document.write("<br>");

//   function displaySpeed() {
//     var timeDuration = (end_time - time_start) / 1000;
//     var loadedBits = downloadSize * 8;

//     /* Converts a number into string
//                    using toFixed(2) rounding to 2 */
//     var bps = (loadedBits / timeDuration).toFixed(2);
//     var speedInKbps = (bps / 1024).toFixed(2);
//     var speedInMbps = (speedInKbps / 1024).toFixed(2);
//     alert(
//       "Your internet connection speed is: \n" +
//         bps +
//         " bps\n" +
//         speedInKbps +
//         " kbps\n" +
//         speedInMbps +
//         " Mbps\n"
//     );
//   }
// }
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
  request.open("get", currentServerUrl, true);
  request.setRequestHeader("Cache-Control", "no-cache");
  request.setRequestHeader("Pragma", "no-cache");
  request.setRequestHeader("Accept-Encoding", "gzip, deflate, br");
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
    const mbps = kbps / 1024;
    const ratios = calcRatio(mbps) ?? {
      ratio: 0,
      startValue: 0,
      offset: 0,
    };

    const equalValue =
      ratios.ratio * (mbps - ratios?.startValue) + ratios?.offset;
    knob.setValue(equalValue);
    knob.setProperty("displayVal", mbps.toFixed(2));
    draw(percent_complete);

    speedGraph.data.labels.push(`${minutes}:${seconds}`);
    speedGraph.data.datasets.pointRadius = 0;
    speedGraph.data.datasets.forEach((dataset) => {
      dataset.data.push(kbps);
    });
    speedGraph.update();

    if (percent_complete === 100 || currentTime > 10000) {
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

      var newData = {
        testTime: getFormattedTime(new Date()),
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
  console.log(serverIndex);
  selectedServerUrl = serverUrls[serverIndex];
  switch (serverIndex) {
    case 0:
      dropDown.innerHTML = "http://speedtest.tupelo.matraex.com/20MB";
      break;
    case 1:
      dropDown.innerHTML = "http://speedtest.tupelo.matraex.com/100MB";
      break;
    case 2:
      dropDown.innerHTML = "http://speedtest2.matraex.com/20MB";
      break;
    case 3:
      dropDown.innerHTML = "http://speedtest2.matraex.com/100MB";
      break;
    default:
      dropDown.innerHTML = "http://speedtest.tupelo.matraex.com/20MB";
      break;
  }
}

function calcRatio(mbps) {
  if (mbps < 1) {
    return { ratio: 12.5, startValue: 0, offset: 0 };
  } else if (mbps >= 1 && mbps < 5) {
    return { ratio: 3.125, startValue: 1, offset: 12.5 };
  } else if (mbps >= 5 && mbps < 10) {
    return { ratio: 2.5, startValue: 5, offset: 25 };
  } else if (mbps >= 10 && mbps < 30) {
    return { ratio: 1.25, startValue: 10, offset: 37.5 };
  } else if (mbps >= 30 && mbps < 50) {
    return { ratio: 0.625, startValue: 30, offset: 50 };
  } else if (mbps >= 50 && mbps <= 100) {
    return { ratio: 0.5, startValue: 50, offset: 62.5 };
  }
}

function getFormattedTime(date) {
  var dateString =
    date.getUTCFullYear() +
    "/" +
    ("0" + (date.getUTCMonth() + 1)).slice(-2) +
    "/" +
    ("0" + date.getUTCDate()).slice(-2) +
    " " +
    ("0" + date.getUTCHours()).slice(-2) +
    ":" +
    ("0" + date.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + date.getUTCSeconds()).slice(-2);
    return dateString;
}
