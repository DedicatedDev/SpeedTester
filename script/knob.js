for (var i = 1; i < 6; i++) {
  Array.prototype.slice
    .call(document.getElementsByClassName("preset" + i))
    .forEach(function (el) {
      new Knob(el, new Ui["P" + i]());
      el.addEventListener("change", function () {
        console.log(el.value);
      });
    });
}
