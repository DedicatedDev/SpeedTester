/*
 * pure-knob
 *
 * Canvas-based JavaScript UI element implementing touch,
 * keyboard, mouse and scroll wheel support.
 *
 * Copyright 2018 - 2021 Andre Plötze
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    /* AMD. Register as an anonymous module. */
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    /*
     * Node.
     *
     * Does not work with strict CommonJS, but
     * only CommonJS-like environments that support
     * module.exports, like Node.
     */
    module.exports = factory();
  } else {
    /* Browser globals (root is window). */
    root.pureknob = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function PureKnob() {
    /*
     * Creates a bar graph element.
     */
    this.createBarGraph = function (width, height) {
      const heightString = height.toString();
      const widthString = width.toString();
      const canvas = document.createElement("canvas");
      const div = document.createElement("div");
      div.style.display = "inline-block";
      div.style.height = heightString + "px";
      div.style.position = "relative";
      div.style.textAlign = "center";
      div.style.width = widthString + "px";
      div.appendChild(canvas);

      /*
       * The bar graph object.
       */
      const graph = {
        _canvas: canvas,
        _div: div,
        _height: height,
        _width: width,

        /*
         * Properties of this bar graph.
         */
        _properties: {
          colorBG: "#181818",
          colorFG: "#ff8800",
          colorMarkers: "#888888",
          markerStart: 0,
          markerEnd: 100,
          markerStep: 20,
          trackWidth: 0.5,
          valMin: 0,
          valMax: 100,
          valPeaks: [],
          val: 0,
          displayVal: 0,
        },

        /*
         * Returns the peak values for this bar graph.
         */
        getPeaks: function () {
          const properties = this._properties;
          const peaks = properties.valPeaks;
          const numPeaks = peaks.length;
          const peaksCopy = [];

          /*
           * Iterate over the peak values and copy them.
           */
          for (let i = 0; i < numPeaks; i++) {
            const peak = peaks[i];
            peaksCopy.push(peak);
          }

          return peaksCopy;
        },

        /*
         * Returns the value of a property of this bar graph.
         */
        getProperty: function (key) {
          const properties = this._properties;
          const value = properties[key];
          return value;
        },

        /*
         * Returns the current value of the bar graph.
         */
        getValue: function () {
          const properties = this._properties;
          const value = properties.val;
          return value;
        },

        /*
         * Return the DOM node representing this bar graph.
         */
        node: function () {
          const div = this._div;
          return div;
        },

        setDisplayVal: function (disPlayValue) {
          this.setProperty("displayVal", displayVal);
        },

        /*
         * Redraw the bar graph on the canvas.
         */
        redraw: function () {
          this.resize();
          const properties = this._properties;
          const colorTrack = properties.colorBG;
          const colorFilling = properties.colorFG;
          const colorMarkers = properties.colorMarkers;
          const markerStart = properties.markerStart;
          const markerEnd = properties.markerEnd;
          const markerStep = properties.markerStep;
          const trackWidth = properties.trackWidth;
          const valMin = properties.valMin;
          const valMax = properties.valMax;
          const displayVal = properties.displayVal;
          const peaks = properties.valPeaks;
          const value = properties.val;
          const height = this._height;
          const width = this._width;
          const lineWidth = Math.round(trackWidth * height);
          const halfWidth = 0.5 * lineWidth;
          const centerY = 0.5 * height;
          const lineTop = centerY - halfWidth;
          const lineBottom = centerY + halfWidth;
          const relativeValue = (value - valMin) / (valMax - valMin);
          const fillingEnd = width * relativeValue;
          const numPeaks = peaks.length;
          const canvas = this._canvas;
          const ctx = canvas.getContext("2d");
          const ctx1 = canvas.getContext("2d");
          /*
           * Clear the canvas.
           */
          ctx.clearRect(0, 0, width, height);
          ctx.clearRect(0, 0, width, height);
          /*
           * Check if markers should be drawn.
           */
          if (
            (markerStart !== null) &
            (markerEnd !== null) &
            (markerStep !== null) &
            (markerStep !== 0)
          ) {
            ctx.lineCap = "butt";
            ctx.lineWidth = "2";
            ctx.strokeStyle = colorMarkers;

            /*
             * Draw the markers.
             */
            for (let v = markerStart; v <= markerEnd; v += markerStep) {
              const relativePos = (v - valMin) / (valMax - valMin);
              const pos = Math.round(width * relativePos);
              ctx.beginPath();
              ctx.moveTo(pos, 0);
              ctx.lineTo(pos, height);
              ctx.stroke();
            }
          }

          /*
           * Draw the track.
           */
          ctx.beginPath();
          ctx.rect(0, lineTop, width, lineWidth);
          ctx.fillStyle = colorTrack;
          ctx.fill();

          /*
           * Draw the filling.
           */
          ctx.beginPath();
          ctx.rect(0, lineTop, fillingEnd, lineWidth);
          ctx.fillStyle = colorFilling;
          ctx.fill();

          /*
           * Prepare for drawing the peaks.
           */
          ctx.strokeStyle = colorFilling;

          /*
           * Draw the peaks.
           */
          for (let i = 0; i < numPeaks; i++) {
            const peak = peaks[i];
            const relativePeak = (peak - valMin) / (valMax - valMin);
            const pos = Math.round(width * relativePeak);
            ctx.beginPath();
            ctx.moveTo(pos, lineTop);
            ctx.lineTo(pos, lineBottom);
            ctx.stroke();
          }
        },

        /*
         * This is called as the canvas or the surrounding DIV is resized.
         */
        resize: function () {
          const canvas = this._canvas;
          canvas.style.height = "100%";
          canvas.style.width = "100%";
          canvas.height = this._height;
          canvas.width = this._width;
        },

        /*
         * Sets the peak values of this bar graph.
         */
        setPeaks: function (peaks) {
          const properties = this._properties;
          const peaksCopy = [];
          const numPeaks = peaks.length;

          /*
           * Iterate over the peak values and append them to the array.
           */
          for (let i = 0; i < numPeaks; i++) {
            const peak = peaks[i];
            peaksCopy.push(peak);
          }

          this.setProperty("valPeaks", peaksCopy);
        },

        /*
         * Sets the value of a property of this bar graph.
         */
        setProperty: function (key, value) {
          this._properties[key] = value;
          this.redraw();
        },

        /*
         * Sets the value of this bar graph.
         */

        setValue: function (value) {
          const properties = this._properties;
          const valMin = properties.valMin;
          const valMax = properties.valMax;

          /*
           * Clamp the actual value into the [valMin; valMax] range.
           */
          if (value < valMin) {
            value = valMin;
          } else if (value > valMax) {
            value = valMax;
          }

          value = Math.round(value);
          this.setProperty("val", value);
        },
      };

      /*
       * This is called when the size of the canvas changes.
       */
      const resizeListener = function (e) {
        graph.redraw();
      };

      canvas.addEventListener("resize", resizeListener);
      return graph;
    };

    /*
     * Creates a knob element.
     */
    this.createKnob = function (width, height) {
      const heightString = height.toString();
      const widthString = width.toString();
      const smaller = width < height ? width : height;
      const fontSize = 0.2 * smaller;
      const fontSizeString = fontSize.toString();
      const canvas = document.createElement("canvas");
      const div = document.createElement("div");

      div.style.display = "inline-block";
      div.style.height = heightString + "px";
      div.style.position = "relative";
      div.style.textAlign = "center";
      div.style.width = widthString + "px";
      div.appendChild(canvas);

      const input = document.createElement("input");
      input.style.appearance = "textfield";
      input.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      input.style.border = "none";
      input.style.color = "#ff8800";
      input.style.fontFamily = "sans-serif";
      input.style.fontSize = fontSizeString + "px";
      input.style.height = heightString + "px";
      input.style.margin = "auto";
      input.style.padding = "0px";
      input.style.textAlign = "center";
      input.style.width = widthString + "px";

      const inputMode = document.createAttribute("inputmode");
      inputMode.value = "numeric";
      input.setAttributeNode(inputMode);

      const inputDiv = document.createElement("div");
      inputDiv.style.bottom = "0px";
      inputDiv.style.display = "none";
      inputDiv.style.left = "0px";
      inputDiv.style.position = "absolute";
      inputDiv.style.right = "0px";
      inputDiv.style.top = "0px";
      inputDiv.appendChild(input);
      div.appendChild(inputDiv);

      /*
       * The knob object.
       */
      const knob = {
        _canvas: canvas,
        _div: div,
        _height: height,
        _input: input,
        _inputDiv: inputDiv,
        _listeners: [],
        _mousebutton: false,
        _previousVal: 0,
        _timeout: null,
        _timeoutDoubleTap: null,
        _touchCount: 0,
        _width: width,

        /*
         * Notify listeners about value changes.
         */
        _notifyUpdate: function () {
          const properties = this._properties;
          const value = properties.val;
          const listeners = this._listeners;
          const numListeners = listeners.length;

          /*
           * Call all listeners.
           */
          for (let i = 0; i < numListeners; i++) {
            const listener = listeners[i];

            /*
             * Call listener, if it exists.
             */
            if (listener !== null) {
              listener(this, value);
            }
          }
        },

        /*
         * Properties of this knob.
         */
        _properties: {
          angleEnd: 2.0 * Math.PI,
          angleOffset: -0.5 * Math.PI,
          angleStart: 0,
          colorBG: "#181818",
          colorFG: "#ff8800",
          colorLabel: "#ffffff",
          fnStringToValue: function (string) {
            return parseInt(string);
          },
          fnValueToString: function (value) {
            return value.toString();
          },
          label: null,
          needle: false,
          readonly: false,
          textScale: 1.0,
          trackWidth: 0.4,
          valMin: 0,
          valMax: 100,
          val: 0,
          displayVal: 0,
        },

        /*
         * Abort value change, restoring the previous value.
         */
        abort: function () {
          const previousValue = this._previousVal;
          const properties = this._properties;
          properties.val = previousValue;
          this.redraw();
        },

        /*
         * Adds an event listener.
         */
        addListener: function (listener) {
          const listeners = this._listeners;
          listeners.push(listener);
        },

        /*
         * Commit value, indicating that it is no longer temporary.
         */
        commit: function () {
          const properties = this._properties;
          const value = properties.val;
          this._previousVal = value;
          this.redraw();
          this._notifyUpdate();
        },

        /*
         * Returns the value of a property of this knob.
         */
        getProperty: function (key) {
          const properties = this._properties;
          const value = properties[key];
          return value;
        },

        /*
         * Returns the current value of the knob.
         */
        getValue: function () {
          const properties = this._properties;
          const value = properties.val;
          return value;
        },

        /*
         * Return the DOM node representing this knob.
         */
        node: function () {
          const div = this._div;
          return div;
        },

        /*
         * Redraw the knob on the canvas.
         */
        redraw: function () {
          this.resize();
          const properties = this._properties;
          const needle = properties.needle;
          const angleStart = properties.angleStart;
          const angleOffset = properties.angleOffset;
          const angleEnd = properties.angleEnd;
          const actualStart = angleStart + angleOffset;
          const actualEnd = angleEnd + angleOffset;
          const label = properties.label;
          const value = properties.val;
          const valueToString = properties.fnValueToString;
          const valueStr = valueToString(value);
          const displayVal = valueToString(properties.displayVal);
          const valMin = properties.valMin;
          const valMax = properties.valMax;
          const relValue = (value - valMin) / (valMax - valMin);
          const relAngle = relValue * (angleEnd - angleStart);
          const angleVal = actualStart + relAngle;
          const colorTrack = properties.colorBG;
          const colorFilling = properties.colorFG;
          const colorLabel = properties.colorLabel;
          const textScale = properties.textScale;
          const trackWidth = properties.trackWidth;
          const height = this._height;
          const width = this._width;
          const smaller = width < height ? width : height;
          const centerX = 0.5 * width;
          const centerY = 0.5 * height;
          const radius = 0.4 * smaller;
          const labelY = centerY + radius;
          const lineWidth = Math.round(trackWidth * radius);
          const labelSize = Math.round(0.8 * lineWidth);
          const labelSizeString = labelSize.toString();
          const fontSize = 0.2 * smaller * textScale;
          const fontSizeString = fontSize.toString();
          const canvas = this._canvas;
          const ctx = canvas.getContext("2d");

          /*
           * Clear the canvas.
           */
          ctx.clearRect(0, 0, width, height);

          /*
           * Draw the track.
           */
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, actualStart, actualEnd);
          ctx.lineCap = "butt";
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = "rgb(36,46,78)"; //colorTrack;
          ctx.stroke();

          /*add Meter letters*/
          ctx.beginPath();
          const letters = [0, 1, 5, 10, 20, 30, 50, 75, 100];
          let startAngle = actualEnd - Math.PI / 2;
          let step = (actualEnd - actualStart) / (letters.length - 1);

          ctx.fillStyle = "#ffff";
          ctx.font = "20pt Calibri";
          ctx.fontSize = 30;
          for (var i = 0; i < letters.length; i++) {
            const x =
              centerX +
              radius * (0.92 - trackWidth) * Math.sin(startAngle) -
              15;
            const y =
              centerY +
              radius * (0.92 - trackWidth) * Math.cos(startAngle) +
              10;
            ctx.fillText(letters[i], x, y);
            startAngle -= step;
          }

          ctx.stroke();
          /*
           * Draw the filling.
           */
          ctx.beginPath();

          /*
           * Check if we're in needle mode.
           */
          if (needle) {
            ctx.arc(centerX, centerY, radius, angleVal - 0.1, angleVal + 0.1);
          } else {
            ctx.arc(centerX, centerY, radius, actualStart, angleVal);
          }

          ctx.lineCap = "butt";
          ctx.lineWidth = lineWidth;

          var grd = ctx.createLinearGradient(0, 0, width, 0);
          grd.addColorStop(0, `rgb(100,62,224)`);
          grd.addColorStop(1, `rgb(230,62,224)`);
          ctx.strokeStyle = grd;
          ctx.stroke();

          /* draw shadraw */
          ctx.beginPath();
          var shadowGrd = ctx.createRadialGradient(
            centerX,
            centerX,
            0,
            centerX,
            centerY,
            radius
          );
          shadowGrd.addColorStop(0, `rgb(68,68,68,0.1)`);
          shadowGrd.addColorStop(0, `rgb(68,68,68,0.1)`);
          shadowGrd.addColorStop(0, `rgb(68,68,68,0.1)`);
          shadowGrd.addColorStop(0, `rgb(68,68,68,0.1)`);
          const endColor = `rgb(${(255 * (angleVal + 10)) / 11},62,244,0.2)`;
          ctx.lineWidth = radius * (1 - trackWidth);
          shadowGrd.addColorStop(1, endColor);
          ctx.strokeStyle = shadowGrd;
          ctx.arc(centerX, centerY, radius * 0.5, actualStart, angleVal);
          ctx.stroke();

          //   /* draw needle. */
          ctx.beginPath();
          var needleGrd = ctx.createRadialGradient(
            centerX,
            centerX,
            radius,
            centerX,
            centerY,
            0
          );
          needleGrd.addColorStop(1, `rgb(68,68,68,0.1)`);
          needleGrd.addColorStop(0, `rgb(255,255,255)`);

          ctx.lineWidth = 1;
          ctx.strokeStyle = needleGrd;
          ctx.fillStyle = needleGrd;

          const needleBottomRightX =
            centerX + 10 * Math.sin(-angleVal + Math.PI / 2 + 1);
          const needleBottomRightY =
            centerY + 10 * Math.cos(-angleVal + Math.PI / 2 + 1);

          const needleBottomLeftX =
            centerX + 10 * Math.sin(-angleVal + Math.PI / 2 - 1);
          const needleBottomLeftY =
            centerY + 10 * Math.cos(-angleVal + Math.PI / 2 - 1);

          const needleTopRightX =
            centerX +
            radius *
              (0.84 - trackWidth) *
              Math.sin(-angleVal + Math.PI / 2 + 0.03);
          const needleTopRightY =
            centerY +
            radius *
              (0.84 - trackWidth) *
              Math.cos(-angleVal + Math.PI / 2 + 0.03);
          const needleTopLeftX =
            centerX +
            radius *
              (0.84 - trackWidth) *
              Math.sin(-angleVal + Math.PI / 2 - 0.03);
          const needleTopLeftY =
            centerY +
            radius *
              (0.84 - trackWidth) *
              Math.cos(-angleVal + Math.PI / 2 - 0.03);

          ctx.moveTo(needleBottomRightX, needleBottomRightY);
          ctx.lineTo(needleBottomLeftX, needleBottomLeftY);
          ctx.lineTo(needleTopLeftX, needleTopLeftY);
          ctx.lineTo(needleTopRightX, needleTopRightY);
          ctx.lineTo(needleBottomRightX, needleBottomRightY);
          ctx.fill();
          ctx.stroke();
          /*
           * Draw the number.
           */
          //   ctx.font = fontSizeString + "px sans-serif";
          //   ctx.fillStyle = colorFilling;
          //   ctx.textAlign = "center";
          //   ctx.textBaseline = "middle";
          //   ctx.fillText(valueStr, centerX, centerY);

          /*
           * Draw the label
           */
          if (label !== null) {
            ctx.font = "40px sans-serif";
            ctx.fillStyle = colorLabel;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(displayVal, centerX, labelY - 35);
            ctx.font = "20px sans-serif";
            ctx.fillStyle = colorLabel;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Mbps", centerX, labelY);
          }

          /*
           * Set the color and font size of the input element.
           */
          const elemInput = this._input;
          elemInput.style.color = colorFilling;
          elemInput.style.fontSize = fontSizeString + "px";
        },

        /*
         * This is called as the canvas or the surrounding DIV is resized.
         */
        resize: function () {
          const canvas = this._canvas;
          canvas.style.height = "100%";
          canvas.style.width = "100%";
          canvas.height = this._height;
          canvas.width = this._width;
        },

        /*
         * Sets the value of a property of this knob.
         */
        setProperty: function (key, value) {
          this._properties[key] = value;
          this.redraw();
        },

        /*
         * Sets the value of this knob.
         */
        setValue: function (value) {
          this.setValueFloating(value);
          this.commit();
        },

        /*
         * Sets floating (temporary) value of this knob.
         */
        setValueFloating: function (value) {
          const properties = this._properties;
          const valMin = properties.valMin;
          const valMax = properties.valMax;

          /*
           * Clamp the actual value into the [valMin; valMax] range.
           */
          if (value < valMin) {
            value = valMin;
          } else if (value > valMax) {
            value = valMax;
          }

          value = Math.round(value);
          this.setProperty("val", value);
        },
      };

      /*
       * Convert mouse event to value.
       */
      const mouseEventToValue = function (e, properties) {
        const canvas = e.target;
        const width = canvas.scrollWidth;
        const height = canvas.scrollHeight;
        const centerX = 0.5 * width;
        const centerY = 0.5 * height;
        const x = e.offsetX;
        const y = e.offsetY;
        const relX = x - centerX;
        const relY = y - centerY;
        const angleStart = properties.angleStart;
        const angleEnd = properties.angleEnd;
        const angleDiff = angleEnd - angleStart;
        let angle = Math.atan2(relX, -relY) - angleStart;
        const twoPi = 2.0 * Math.PI;

        /*
         * Make negative angles positive.
         */
        if (angle < 0) {
          if (angleDiff >= twoPi) {
            angle += twoPi;
          } else {
            angle = 0;
          }
        }

        const valMin = properties.valMin;
        const valMax = properties.valMax;
        let value = (angle / angleDiff) * (valMax - valMin) + valMin;

        /*
         * Clamp values into valid interval.
         */
        if (value < valMin) {
          value = valMin;
        } else if (value > valMax) {
          value = valMax;
        }

        return value;
      };

      /*
       * Convert touch event to value.
       */
      const touchEventToValue = function (e, properties) {
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect();
        const offsetX = rect.left;
        const offsetY = rect.top;
        const width = canvas.scrollWidth;
        const height = canvas.scrollHeight;
        const centerX = 0.5 * width;
        const centerY = 0.5 * height;
        const touches = e.targetTouches;
        let touch = null;

        /*
         * If there are touches, extract the first one.
         */
        if (touches.length > 0) {
          touch = touches.item(0);
        }

        let x = 0.0;
        let y = 0.0;

        /*
         * If a touch was extracted, calculate coordinates relative to
         * the element position.
         */
        if (touch !== null) {
          const touchX = touch.pageX;
          x = touchX - offsetX;
          const touchY = touch.pageY;
          y = touchY - offsetY;
        }

        const relX = x - centerX;
        const relY = y - centerY;
        const angleStart = properties.angleStart;
        const angleEnd = properties.angleEnd;
        const angleDiff = angleEnd - angleStart;
        const twoPi = 2.0 * Math.PI;
        let angle = Math.atan2(relX, -relY) - angleStart;

        /*
         * Make negative angles positive.
         */
        if (angle < 0) {
          if (angleDiff >= twoPi) {
            angle += twoPi;
          } else {
            angle = 0;
          }
        }

        const valMin = properties.valMin;
        const valMax = properties.valMax;
        let value = (angle / angleDiff) * (valMax - valMin) + valMin;

        /*
         * Clamp values into valid interval.
         */
        if (value < valMin) {
          value = valMin;
        } else if (value > valMax) {
          value = valMax;
        }

        return value;
      };

      /*
       * Show input element on double click.
       */
      const doubleClickListener = function (e) {
        const properties = knob._properties;
        const readonly = properties.readonly;

        /*
         * If knob is not read-only, display input element.
         */
        if (!readonly) {
          e.preventDefault();
          const inputDiv = knob._inputDiv;
          inputDiv.style.display = "block";
          const inputElem = knob._input;
          inputElem.focus();
          knob.redraw();
        }
      };

      /*
       * This is called when the mouse button is depressed.
       */
      const mouseDownListener = function (e) {
        const btn = e.buttons;

        /*
         * It is a left-click.
         */
        if (btn === 1) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read-only, process mouse event.
           */
          if (!readonly) {
            e.preventDefault();
            const val = mouseEventToValue(e, properties);
            knob.setValueFloating(val);
          }

          knob._mousebutton = true;
        }

        /*
         * It is a middle click.
         */
        if (btn === 4) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read-only, display input element.
           */
          if (!readonly) {
            e.preventDefault();
            const inputDiv = knob._inputDiv;
            inputDiv.style.display = "block";
            const inputElem = knob._input;
            inputElem.focus();
            knob.redraw();
          }
        }
      };

      /*
       * This is called when the mouse cursor is moved.
       */
      const mouseMoveListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Only process event, if mouse button is depressed.
         */
        if (btn) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read-only, process mouse event.
           */
          if (!readonly) {
            e.preventDefault();
            const val = mouseEventToValue(e, properties);
            knob.setValueFloating(val);
          }
        }
      };

      /*
       * This is called when the mouse button is released.
       */
      const mouseUpListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Only process event, if mouse button was depressed.
         */
        if (btn) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read only, process mouse event.
           */
          if (!readonly) {
            e.preventDefault();
            const val = mouseEventToValue(e, properties);
            knob.setValue(val);
          }
        }

        knob._mousebutton = false;
      };

      /*
       * This is called when the drag action is canceled.
       */
      const mouseCancelListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Abort action if mouse button was depressed.
         */
        if (btn) {
          knob.abort();
          knob._mousebutton = false;
        }
      };

      /*
       * This is called when a user touches the element.
       */
      const touchStartListener = function (e) {
        const properties = knob._properties;
        const readonly = properties.readonly;

        /*
         * If knob is not read-only, process touch event.
         */
        if (!readonly) {
          const touches = e.targetTouches;
          const numTouches = touches.length;
          const singleTouch = numTouches === 1;

          /*
           * Only process single touches, not multi-touch
           * gestures.
           */
          if (singleTouch) {
            knob._mousebutton = true;

            /*
             * If this is the first touch, bind double tap
             * interval.
             */
            if (knob._touchCount === 0) {
              /*
               * This is executed when the double tap
               * interval times out.
               */
              const f = function () {
                /*
                 * If control was tapped exactly
                 * twice, enable on-screen keyboard.
                 */
                if (knob._touchCount === 2) {
                  const properties = knob._properties;
                  const readonly = properties.readonly;

                  /*
                   * If knob is not read-only,
                   * display input element.
                   */
                  if (!readonly) {
                    e.preventDefault();
                    const inputDiv = knob._inputDiv;
                    inputDiv.style.display = "block";
                    const inputElem = knob._input;
                    inputElem.focus();
                    knob.redraw();
                  }
                }

                knob._touchCount = 0;
              };

              let timeout = knob._timeoutDoubleTap;
              window.clearTimeout(timeout);
              timeout = window.setTimeout(f, 500);
              knob._timeoutDoubleTap = timeout;
            }

            knob._touchCount++;
            const val = touchEventToValue(e, properties);
            knob.setValueFloating(val);
          }
        }
      };

      /*
       * This is called when a user moves a finger on the element.
       */
      var touchMoveListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Only process event, if mouse button is depressed.
         */
        if (btn) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read-only, process touch event.
           */
          if (!readonly) {
            const touches = e.targetTouches;
            const numTouches = touches.length;
            const singleTouch = numTouches === 1;

            /*
             * Only process single touches, not multi-touch
             * gestures.
             */
            if (singleTouch) {
              e.preventDefault();
              const val = touchEventToValue(e, properties);
              knob.setValueFloating(val);
            }
          }
        }
      };

      /*
       * This is called when a user lifts a finger off the element.
       */
      const touchEndListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Only process event, if mouse button was depressed.
         */
        if (btn) {
          const properties = knob._properties;
          const readonly = properties.readonly;

          /*
           * If knob is not read only, process touch event.
           */
          if (!readonly) {
            const touches = e.targetTouches;
            const numTouches = touches.length;
            const noMoreTouches = numTouches === 0;

            /*
             * Only commit value after the last finger has
             * been lifted off.
             */
            if (noMoreTouches) {
              e.preventDefault();
              knob._mousebutton = false;
              knob.commit();
            }
          }
        }

        knob._mousebutton = false;
      };

      /*
       * This is called when a user cancels a touch action.
       */
      const touchCancelListener = function (e) {
        const btn = knob._mousebutton;

        /*
         * Abort action if mouse button was depressed.
         */
        if (btn) {
          knob.abort();
          knob._touchCount = 0;
          const timeout = knob._timeoutDoubleTap;
          window.clearTimeout(timeout);
        }

        knob._mousebutton = false;
      };

      /*
       * This is called when the size of the canvas changes.
       */
      const resizeListener = function (e) {
        knob.redraw();
      };

      /*
       * This is called when the mouse wheel is moved.
       */
      const scrollListener = function (e) {
        const readonly = knob.getProperty("readonly");

        /*
         * If knob is not read only, process mouse wheel event.
         */
        if (!readonly) {
          e.preventDefault();
          const delta = e.deltaY;
          const direction = delta > 0 ? 1 : delta < 0 ? -1 : 0;
          let val = knob.getValue();
          val += direction;
          knob.setValueFloating(val);

          /*
           * Perform delayed commit.
           */
          const commit = function () {
            knob.commit();
          };

          let timeout = knob._timeout;
          window.clearTimeout(timeout);
          timeout = window.setTimeout(commit, 250);
          knob._timeout = timeout;
        }
      };

      /*
       * This is called when the user presses a key on the keyboard.
       */
      const keyDownListener = function (e) {
        const k = e.key;

        /*
         * Hide input element when user presses enter or escape.
         */
        if (k === "Enter" || k === "Escape") {
          const inputDiv = knob._inputDiv;
          inputDiv.style.display = "none";
          const input = e.target;

          /*
           * Only evaluate value when user pressed enter.
           */
          if (k === "Enter") {
            const properties = knob._properties;
            const value = input.value;
            const stringToValue = properties.fnStringToValue;
            const val = stringToValue(value);
            const valid = isFinite(val);

            /*
             * Check if input is a valid number.
             */
            if (valid) {
              knob.setValue(val);
            }
          }

          input.value = "";
        }
      };

      canvas.addEventListener("dblclick", doubleClickListener);
      canvas.addEventListener("mousedown", mouseDownListener);
      canvas.addEventListener("mouseleave", mouseCancelListener);
      canvas.addEventListener("mousemove", mouseMoveListener);
      canvas.addEventListener("mouseup", mouseUpListener);
      canvas.addEventListener("resize", resizeListener);
      canvas.addEventListener("touchstart", touchStartListener);
      canvas.addEventListener("touchmove", touchMoveListener);
      canvas.addEventListener("touchend", touchEndListener);
      canvas.addEventListener("touchcancel", touchCancelListener);
      canvas.addEventListener("wheel", scrollListener);
      input.addEventListener("keydown", keyDownListener);
      return knob;
    };
  }

  return new PureKnob();
});
