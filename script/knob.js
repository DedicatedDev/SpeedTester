const serverUrls = [
  "http://speedtest.tupelo.matraex.com/20MB.txt",
  "http://speedtest.tupelo.matraex.com/20MB.txt",
  "http://speedtest2.matraex.com/100MB.txt",
  "http://speedtest2.matraex.com/100MB.txt",
];

let currentServerUrl = "http://speedtest.tupelo.matraex.com/20MB.txt";
// for (var i = 1; i < 6; i++) {
//   Array.prototype.slice
//     .call(document.getElementsByClassName("preset" + i))
//     .forEach(function (el) {
//       new Knob(el, new Ui["P" + i]());
//       el.addEventListener("change", function () {
//         console.log(el.value);
//         switch (el.value) {
//           case 0:
//             selectedServerUrl = `${currentServerUrl}/20MB.txt`;
//             break;
//           case 1:
//             selectedServerUrl = `${currentServerUrl}/100MB.txt`;
//             break;
//           case 2:
//             selectedServerUrl = `${currentServerUrl}/200MB.txt`;
//             break;
//           case 3:
//             selectedServerUrl = `${currentServerUrl}/500MB.txt`;
//             break;
//           case 4:
//             selectedServerUrl = `${currentServerUrl}/1024MB.txt`;
//             break;
//           default:
//             selectedServerUrl = `${currentServerUrl}/20MB.txt`;
//             break;
//         }
//       });
//     });
// }
