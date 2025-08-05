/**
 *
 * @param {string} value
 * @param {*} button
 */
function setDisplay(value, button) {
  if (selectedDomObject) {
    selectedDomObject.css("display", value);
    saveStyle([{ type: "display", value: value }]);
    checkForShowDisplaySettings(value);
    handleDisplay($("#displays .button"), button.object);
    refreshStylePanel();
  }
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
    //handleDisplay($("#directions .button"), button, "direction");
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

function setGridDirection(value, button) {
  selectedDomObject.css("grid-auto-flow", value);
  saveStyle([{ type: "grid-auto-flow", value: value }]);
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

function setSizing(type, value) {
  selectedDomObject.css(type, value);
  saveStyle([{ type: type, value: value }]);
}

function setOverflow(value, button) {
  selectedDomObject.css("overflow", value);
  saveStyle([{ type: "overflow", value: value }]);
  handleDisplay($("#overflow-container .button"), button);
}

function setRatio(button = null, custom = null) {
  let value;
  if (button !== null) value = button.attr("data-value");
  else if (custom !== null) value = custom.w + " / " + custom.h;
  selectedDomObject.css("aspect-ratio", value);
  saveStyle([{ type: "aspect-ratio", value: value }]);
  refreshStylePanel();
}
