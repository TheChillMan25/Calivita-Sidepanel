/**
 * Sets given css property (name) with given value (value) and type (type)
 * @param {string} name Name of the css property
 * @param {string} value Value of the css property
 * @param {string} type Type of the css property, if it has one (ex: "px")
 */
function setStyle(name, value, type = "") {
  selectedDomObject.css(name, value + type);
  saveStyle([{ type: name, value: value + type }]);
  refreshStylePanel();
}
/**
 *
 * @param {string} value Value of the direction property
 * @param {*} button Button to set as active
 */
function setDirection(value, button) {
  if (selectedDomObject) {
    selectedDomObject.css({
      "flex-direction": value,
      "flex-wrap": "nowrap",
    });
    if (selectedDomObject.css("align-items") === "normal") {
      selectedDomObject.css("align-items", "flex-start");
      saveStyle([{ type: "align-items", value: "flex-start" }]);
    }
    if (selectedDomObject.css("justify-content") === "normal") {
      selectedDomObject.css("justify-content", "flex-start");
      saveStyle([{ type: "justify-content", value: "flex-start" }]);
    }
    saveStyle([
      { type: "flex-direction", value: value },
      { type: "flex-wrap", value: "nowrap" },
    ]);
    refreshStylePanel();
  }
}
/**
 *
 * @param {string} value Value of the pressed button
 * @param {*} button Button to set as active
 */
function setWrap(value, button) {
  switch (value) {
    case "ltr-wrap-down":
      selectedDomObject.css({
        "flex-direction": "row",
        "flex-wrap": "wrap",
      });
      break;
    case "ltr-wrap-up":
      selectedDomObject.css({
        "flex-direction": "row",
        "flex-wrap": "wrap-reverse",
      });
      break;
    case "rtl-single-row":
      selectedDomObject.css({
        "flex-direction": "row-reverse",
        "flex-wrap": "nowrap",
      });
      break;
    case "rtl-wrap-down":
      selectedDomObject.css({
        "flex-direction": "row-reverse",
        "flex-wrap": "wrap",
      });
      break;
    case "rtl-wrap-up":
      selectedDomObject.css({
        "flex-direction": "row-reverse",
        "flex-wrap": "wrap-reverse",
      });
      break;
    case "ttb-wrap-right":
      selectedDomObject.css({
        "flex-direction": "column",
        "flex-wrap": "wrap",
      });
      break;
    case "ttb-wrap-left":
      selectedDomObject.css({
        "flex-direction": "column",
        "flex-wrap": "wrap-reverse",
      });
      break;
    case "btt-single-column":
      selectedDomObject.css({
        "flex-direction": "column-reverse",
        "flex-wrap": "nowrap",
      });
      break;
    case "btt-wrap-right":
      selectedDomObject.css({
        "flex-direction": "column-reverse",
        "flex-wrap": "wrap",
      });
      break;
    case "btt-wrap-left":
      selectedDomObject.css({
        "flex-direction": "column-reverse",
        "flex-wrap": "wrap-reverse",
      });
      break;
    default:
      console.error("Unknown wrap value: " + value);
  }
  saveStyle([
    { type: "flex-direction", value: selectedDomObject.css("flex-direction") },
    { type: "flex-wrap", value: selectedDomObject.css("flex-wrap") },
  ]);
  refreshStylePanel();
}
/**
 *
 * @param {string} value Value of the alignment
 * @param {*} button The button to set as active (DOM element)
 */
function setAlignmentWithMenu(value, button) {
  if (button.hasClass("horizontal")) {
    selectedDomObject.css("justify-content", value);
    $("#align-h-data-desc").text(button.attr("data-desc"));
  } else if (button.hasClass("vertical")) {
    selectedDomObject.css("align-items", value);
    $("#align-v-data-desc").text(button.attr("data-desc"));
  }
  saveStyle([
    {
      type: "justify-content",
      value: selectedDomObject.css("justify-content"),
    },
    { type: "align-items", value: selectedDomObject.css("align-items") },
  ]);
  resetAlingmentBox();
  refreshStylePanel();
  hideAlignmentOptions();
}
/**
 * Set alignment property of the selected DOM element
 * @param {string} value Value attribute of the pressed button
 * @param {*} button The pressed button to set as active (DOM element)
 */
function setAlignmentWithBox(value, button) {
  switch (value) {
    case "top-left":
      selectedDomObject.css({
        "align-items": "flex-start",
        "justify-content": "flex-start",
      });
      break;
    case "top-center":
      selectedDomObject.css({
        "align-items": "flex-start",
        "justify-content": "center",
      });
      break;
    case "top-right":
      selectedDomObject.css({
        "align-items": "flex-start",
        "justify-content": "flex-end",
      });
      break;
    case "left":
      selectedDomObject.css({
        "align-items": "center",
        "justify-content": "flex-start",
      });
      break;
    case "center":
      selectedDomObject.css({
        "align-items": "center",
        "justify-content": "center",
      });
      break;
    case "right":
      selectedDomObject.css({
        "align-items": "center",
        "justify-content": "flex-end",
      });
      break;
    case "bottom-left":
      selectedDomObject.css({
        "align-items": "flex-end",
        "justify-content": "flex-start",
      });
      break;
    case "bottom-center":
      selectedDomObject.css({
        "align-items": "flex-end",
        "justify-content": "center",
      });
      break;
    case "bottom-right":
      selectedDomObject.css({
        "align-items": "flex-end",
        "justify-content": "flex-end",
      });
      break;
    default:
      console.error("Unkown alignment: " + value);
  }
  saveStyle([
    {
      type: "justify-content",
      value: selectedDomObject.css("justify-content"),
    },
    { type: "align-items", value: selectedDomObject.css("align-items") },
  ]);
  refreshStylePanel();
}
/**
 * Sets gap value
 * @param {int} value Gap size (number)
 * @param {string} gapType Gap type (ex.: px, em, etc)
 * @param {*} button Dom element to be presented as active (default: null)
 * @param {string} type Gap, row-gap, column-gap (default: "gap")
 */
function setGap(value, gapType, button = null, type = "gap") {
  if (value >= 0 && value <= 100) {
    selectedDomObject.css(type, value + gapType);
    saveStyle([{ type: type, value: value + gapType }]);
    if (button) {
      let objects = button.parent().find(".button");
      handleDisplay(objects, button, type);
    }
    refreshStylePanel();
  }
}
/**
 *
 * @param {number} value
 * @param {string} type Column or row
 */
function setGridColsRowsCount(value, type) {
  let a = "";
  for (let index = 0; index < value; index++) {
    a += "auto ";
  }
  a.trim();
  selectedDomObject.css("grid-template-" + type, a);
  saveStyle([{ type: "grid-template-" + type, value: a }]);
  refreshStylePanel();
}

/**
 *
 * @param {string} justifyContent Value of the justify-content attribute (start, center, end, stretch, space-between, space-around)
 * @param {string} alignContent Value of the align-content attribute (start, center, end, stretch, space-between, space-around)
 * @param {*} button Dom element to set as active
 */
function setGridInnerAlignment(justifyContent, alignContent, button) {
  let value = alignContent + " " + justifyContent;
  selectedDomObject.css("place-content", value);
  saveStyle([{ type: "place-content", value: value }]);
  refreshStylePanel();
}

function setSpacing(currentSpacing, value, type, button = null) {
  $("#spacing-value").val(value);
  if (value === "auto") {
    $("#" + currentSpacing).attr("data-value", value);
    selectedDomObject.css(currentSpacing, value);
    saveStyle([{ type: currentSpacing, value: value }]);
  } else {
    $("#" + currentSpacing).text(value);
    $("#" + currentSpacing).attr("data-value", value + type);
    selectedDomObject.css(currentSpacing, value + type);
    saveStyle([{ type: currentSpacing, value: value + type }]);
  }
  if (button) {
    handleDisplay(button.parent().find(".button"), button, "spacing");
  }
  refreshStylePanel();
}

function setRatio(button = null, custom = null) {
  let value;
  if (button !== null) value = button.attr("data-value");
  else if (custom !== null) value = custom.w + " / " + custom.h;
  selectedDomObject.css("aspect-ratio", value);
  saveStyle([{ type: "aspect-ratio", value: value }]);
}

function setObjectPosition(button) {
  let value = button.attr("data-value"),
    l,
    t;
  if (value.includes("left")) l = "0%";
  else if (value.includes("center")) l = "50%";
  else l = "100%";
  if (value.includes("top")) t = "0%";
  else if (value.includes("bottom")) t = "100%";
  else t = "50%";
  selectedDomObject.css("object-position", l + " " + t);
  saveStyle([{ type: "object-position", value: l + " " + t }]);
  refreshStylePanel();
}

function setMainPosition(value) {
  selectedDomObject.css("position", value);
  saveStyle([{ type: "position", value: value }]);
  refreshStylePanel();
}
/**
 *
 * @param {string} type Type of the css property (left, right, top, bottom)
 * @param {*} value Value of the css poperty (10px)
 */
function setPositionDetails(currentPosProp, value, type = null) {
  if (value !== "auto" && type !== null) {
    value = value + type;
  }
  $("#position-" + currentPosProp).attr("data-value", value);
  selectedDomObject.css(currentPosProp, value);
  saveStyle([{ type: currentPosProp, value: value }]);
  refreshStylePanel();
}

function toggleSkipInk(button) {
  if (button.attr("data-value") === "auto") {
    button.attr("data-value", "none");
  } else button.attr("data-value", "auto");
  selectedDomObject.css("text-decoration-skip-ink", button.attr("data-value"));
  saveStyle([
    { type: "text-decoration-skip-ink", value: button.attr("data-value") },
  ]);
  refreshStylePanel();
}

function setLetterSpacing(value, type) {
  if (value === "") {
    value = "normal";
    selectedDomObject.css("letter-spacing", value);
    saveStyle([{ type: "letter-spacing", value: value }]);
  } else if (!isNaN(parseFloat(value))) {
    selectedDomObject.css("letter-spacing", value + type);
    saveStyle([{ type: "letter-spacing", value: value + type }]);
  }
  refreshStylePanel();
}

function setTextIndent(value, type) {
  if (value === "") {
    value = "0";
  }
  if (!isNaN(parseFloat(value))) {
    selectedDomObject.css("text-indent", value + type);
    saveStyle([{ type: "text-indent", value: value + type }]);
  }
  refreshStylePanel();
}

function setTextColumn(value) {
  if (value === "") {
    value = "auto";
  }
  if (value === "auto" || !isNaN(parseFloat(value))) {
    selectedDomObject.css("column-count", value);
    saveStyle([{ type: "column-count", value: value }]);
  }
  refreshStylePanel();
}

function setTextShadow() {
  let x = $("#text-shadow-x").val(),
    xType = $("#text-shadow-x-type").attr("data-value");
  let y = $("#text-shadow-y").val(),
    yType = $("#text-shadow-y-type").attr("data-value");
  let blur = $("#text-shadow-blur").val(),
    blurType = $("#text-shadow-blur-type").attr("data-value");
  let color = hexToRgba(
    $("#text-shadow-color").val(),
    $("#text-shadow-color-alpha").val()
  );

  let newShadow =
    color + " " + x + xType + " " + y + yType + " " + blur + blurType;
  let shadow =
    textShadow === "none" ? newShadow : textShadow + ", " + newShadow;
  if (!editingTextShadow) setStyle("text-shadow", shadow);
}
