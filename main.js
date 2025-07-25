let selectedDomObject = null;
let selectedDisplayObject = null;
let selectedDirectionObject = null;
let selectedWrapObject = null;
let selectedAlignmentObject = null;
let selectedFlexGapObject = null;
let selectedFlexRowGapObject = null;
let selectedFlexColumnGapObject = null;

$(document).ready(function () {
  pageRefreshLoad();
  console.log(selectedWrapObject);
  console.log(selectedDisplayObject);
  console.log(selectedDirectionObject);
  console.log(selectedAlignmentObject);
  if (selectedDomObject === null) {
    $("#select-smt").show();
    $("#settings").hide();
  } else {
    $("#select-smt").hide();
    $("#settings").show();
  }

  $(".editable").each(function () {
    $(this).dblclick(function () {
      console.log("ASD");
    });
    $(this).on("click", function (event) {
      if ($(this).attr("id") === "body") {
        $("#none").hide();
      } else {
        if ($("#none").css("display") === "none") {
          $("#none").show();
        }
      }
      event.stopPropagation();
      selectDomObject($(this));
    });
  });

  $("#display").on("click", function () {
    if (selectedDomObject.css("display") !== "block") {
      selectedDomObject.css({
        display: "block",
      });
      try {
        selectedDisplayObject.removeClass("pressed-button");
        selectedDisplayObject = $("#block");
        selectedDisplayObject.addClass("pressed-button");
        saveStyle([{ type: "display", value: "block" }]);
      } catch (error) {
        return;
      }
    }
  });

  $("#displays-toggle").on("click", function () {
    showDisplayOptions();
  });

  $("#display-ui-container").on("click", function () {
    hideDisplayOptions();
  });

  $("#wrap-toggle").on("click", function () {
    showWrapOptions();
  });

  $("#wrap-ui-container").on("click", function () {
    hideWrapOptions();
  });

  $("#displays").on("click", ".button", function (event) {
    event.stopPropagation();
    let value = $(this).attr("value");
    setDisplay(value, { type: "display", object: $(this) });
  });

  $("#flex-directions").on("click", ".button", function () {
    let value = $(this).attr("value");
    setDirection(value, { type: "direction", object: $(this) });
  });

  $("#wrap-options").on("click", ".button", function (event) {
    event.stopPropagation();
    let value = $(this).attr("value");
    setWrap(value, $(this));
  });

  $("#align-box").on("click", ".button", function () {
    let value = $(this).attr("value");
    setAlignmentWithBox(value, { type: "alignment", object: $(this) });
  });

  $("#align-box").on("mouseenter", ".button", function () {
    $(this).html(
      '<span class="material-symbols-outlined">align_justify_center</span>'
    );
  });
  $("#align-box").on("mouseleave", ".button", function () {
    if (!$(this).is(selectedAlignmentObject))
      $(this).html('<rect class="rect"></rect>');
  });

  $("#align-axis").on("click", ".toggle", function () {
    switch ($(this).attr("id")) {
      case "align-x":
        showAlignmentOptions("align-horizontal");
        break;

      case "align-y":
        showAlignmentOptions("align-vertical");
        break;
    }
  });

  $("#alignment-ui-container").on("click", function () {
    hideAlignmentOptions();
  });

  $("#align-axis").on("click", ".button", function () {
    setAlignmentWithMenu($(this).attr("value"), $(this));
  });

  $("#flex-gap-range").on("input", function () {
    let gapValue = $(this).val();
    setGap(gapValue, $("#flex-gap-type").attr("value"));
  });

  $("#flex-gap-value").on("input", function () {
    let gapValue = parseInt($(this).val());
    if (!isNaN(gapValue) && gapValue >= 0 && gapValue <= 100) {
      setGap(
        gapValue,
        $("#flex-gap-type").attr("value"),
        selectedFlexGapObject,
        "gap"
      );
    }
  });

  $("#flex-gap-type").on("click", function () {
    showFlexGapOptions("gap");
  });

  $("#flex-gap-ui-container").on("click", function () {
    hideFlexGapOptions();
  });

  $("#flex-gap-options").on("click", ".button", function (event) {
    event.stopPropagation();
    let gapValue = $("#flex-gap-range").val();
    let gapType = $(this).attr("value");
    setGap(gapValue, gapType, $(this));
  });

  $("#flex-gap-lock").on("click", function () {
    toggleFlexGapOptions();
  });

  $("#flex-row-gap-type").on("click", function () {
    showFlexGapOptions("row-gap");
  });
  $("#flex-row-gap-text").on("input", function () {
    let gapValue = parseInt($(this).val());
    let colGapValue = parseInt($("#flex-column-gap-text").val());
    if (!isNaN(gapValue) && gapValue >= 0 && gapValue <= 100) {
      setGap(
        gapValue,
        $("#flex-row-gap-type").attr("value"),
        selectedFlexRowGapObject,
        "row-gap"
      );
      if (!isNaN(colGapValue) && colGapValue >= 0 && colGapValue <= 100) {
        setGap(
          colGapValue,
          $("#flex-column-gap-type").attr("value"),
          selectedFlexColumnGapObject,
          "column-gap"
        );
      }
    }
  });
  $("#flex-row-gap-options").on("click", ".button", function (event) {
    event.stopPropagation();
    let gapValue = $("#flex-row-gap-text").val();
    let gapType = $(this).attr("value");
    setGap(gapValue, gapType, $(this), "row-gap");
  });

  $("#flex-column-gap-type").on("click", function () {
    showFlexGapOptions("column-gap");
  });
  $("#flex-column-gap-text").on("input", function () {
    let gapValue = parseInt($(this).val());
    let rowGapValue = parseInt($("#flex-row-gap-text").val());
    if (!isNaN(gapValue) && gapValue >= 0 && gapValue <= 100) {
      setGap(
        gapValue,
        $("#flex-column-gap-type").attr("value"),
        selectedFlexColumnGapObject,
        "column-gap"
      );
      if (!isNaN(rowGapValue) && rowGapValue >= 0 && rowGapValue <= 100) {
        setGap(
          rowGapValue,
          $("#flex-row-gap-type").attr("value"),
          selectedFlexRowGapObject,
          "row-gap"
        );
      }
    }
  });
  $("#flex-column-gap-options").on("click", ".button", function (event) {
    event.stopPropagation();
    let gapValue = $("#flex-column-gap-text").val();
    let gapType = $(this).attr("value");
    setGap(gapValue, gapType, $(this), "column-gap");
  });
});

function selectDomObject(object) {
  if ($("#settings").css("display") === "none") {
    $("#settings").show();
    $("#select-smt").css("display", "none");
  }
  if (selectedDomObject !== object) {
    selectedDomObject.removeClass("selected");
    selectedDomObject = object;
    localStorage.setItem("selectedDomObject", selectedDomObject.attr("id"));
    selectedDomObject.addClass("selected");
    $("#name").text(getElementName(selectedDomObject));
  }
  refreshStylePanel();
}

function saveStyle(dataObjects) {
  dataObjects.forEach((data) => {
    let styleData = JSON.parse(
      localStorage.getItem(selectedDomObject.attr("id"))
    );
    if (styleData) {
      try {
        if (styleData[data.type] !== data.value) {
          styleData[data.type] = data.value;
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      styleData = { [data.type]: data.value };
    }
    localStorage.setItem(
      selectedDomObject.attr("id"),
      JSON.stringify(styleData)
    );
    try {
      if (styleData[data.type] !== data.value) {
        styleData[data.type] = data.value;
        localStorage.setItem(
          selectedDomObject.attr("id"),
          JSON.stringify(styleData)
        );
      }
    } catch (error) {
      console.error(error);
    }
  });
}

function pageRefreshLoad() {
  $(".editable").each(function () {
    try {
      const styleData = JSON.parse(localStorage.getItem($(this).attr("id")));
      if (styleData) {
        for (const [key, value] of Object.entries(styleData)) {
          $(this).css(key, value);
        }
      }
    } catch (error) {
      console.error("No style data found for " + $(this).attr("id"));
      return;
    }
  });
  if (localStorage.getItem("selectedDomObject") !== null) {
    selectedDomObject = $("#" + localStorage.getItem("selectedDomObject"));
    $("#name").text(getElementName(selectedDomObject));
  } else {
    $("#name").text("None selected");
  }
  refreshStylePanel();
}

function refreshStylePanel() {
  $("#sidepanel .button").removeClass("pressed-button");
  try {
    let styleData = JSON.parse(
      localStorage.getItem(selectedDomObject.attr("id"))
    );
    for (const [key, value] of Object.entries(styleData)) {
      try {
        switch (key) {
          case "display":
            $("#" + value).addClass("pressed-button");
            selectedDisplayObject = $("#" + value);
            break;
          case "flex-direction":
            $("#" + value).addClass("pressed-button");
            selectedDirectionObject = $("#" + value);
            break;
          case "flex-wrap":
            if (value !== "nowrap") {
              $("#row").removeClass("pressed-button");
              $("#column").removeClass("pressed-button");
            }
            $("#" + value).addClass("pressed-button");
            selectedDirectionObject = $("#" + value);
            selectWrapObject(
              styleData["flex-direction"],
              styleData["flex-wrap"]
            );
            displaySelectedWrapOption();
            break;
          case "align-items":
            selectAlignmentObject(
              styleData["align-items"],
              styleData["justify-content"]
            );
            break;
          case "justify-content":
            break;
          case "gap":
            if (extractGapType(styleData["gap"]) !== "%") {
              selectedFlexGapObject = $(
                "#flex-gap-" + extractGapType(styleData["gap"])
              );
            } else {
              selectedFlexGapObject = $("#flex-gap-percent");
            }
            selectedFlexGapObject.addClass("pressed-button");
            $("#flex-gap-range").val(parseInt(value));
            $("#flex-gap-value").val(parseInt(value));
            $("#flex-gap-type-text").text(extractGapType(value).toUpperCase());
            $("#flex-gap-type").attr("value", extractGapType(value));
            break;
          case "row-gap":
            if (extractGapType(styleData["row-gap"]) !== "%") {
              selectedFlexRowGapObject = $(
                "#flex-row-gap-" + extractGapType(styleData["row-gap"])
              );
            } else {
              selectedFlexRowGapObject = $("#flex-row-gap-percent");
            }
            selectedFlexRowGapObject.addClass("pressed-button");
            $("#flex-row-gap-range").val(parseInt(value));
            $("#flex-row-gap-value").val(parseInt(value));
            $("#flex-row-gap-type-text").text(
              extractGapType(value).toUpperCase()
            );
            $("#flex-row-gap-type").attr("value", extractGapType(value));
            break;
          case "column-gap":
            if (extractGapType(styleData["column-gap"]) !== "%") {
              selectedFlexColumnGapObject = $(
                "#flex-column-gap-" + extractGapType(styleData["column-gap"])
              );
            } else {
              selectedFlexColumnGapObject = $("#flex-column-gap-percent");
            }
            selectedFlexColumnGapObject.addClass("pressed-button");
            $("#flex-column-gap-range").val(parseInt(value));
            $("#flex-column-gap-value").val(parseInt(value));
            $("#flex-column-gap-type-text").text(
              extractGapType(value).toUpperCase()
            );
            $("#flex-column-gap-type").attr("value", extractGapType(value));
            break;
          default:
            console.warn("Unknown style key: " + key);
        }
      } catch (error) {
        console.error("Error applying style: " + error);
        return;
      }
    }
    if (
      styleData.display !== "block" &&
      styleData.display !== "flex" &&
      styleData.display !== "grid"
    ) {
      $("#od-text").text(getDisplayName(styleData.display));
      $("#other-display").addClass("pressed-button");
    } else {
      $("#other-display").removeClass("pressed-button");
    }
    checkForShowDisplaySettings(styleData.display);
  } catch (error) {
    return;
  }
}

function selectWrapObject(flexDirection, flexWrap) {
  const wrapMap = {
    "row|wrap": "#ltr-wrap-down",
    "row|wrap-reverse": "#ltr-wrap-up",
    "row-reverse|nowrap": "#rtl-single-row",
    "row-reverse|wrap": "#rtl-wrap-down",
    "row-reverse|wrap-reverse": "#rtl-wrap-up",
    "column|wrap": "#ttb-wrap-right",
    "column|wrap-reverse": "#ttb-wrap-left",
    "column-reverse|nowrap": "#btt-single-column",
    "column-reverse|wrap": "#btt-wrap-right",
    "column-reverse|wrap-reverse": "#btt-wrap-left",
  };
  const key = `${flexDirection}|${flexWrap}`;
  if (wrapMap[key]) {
    selectedWrapObject = $(wrapMap[key]);
  } else {
    if (
      flexWrap === "nowrap" &&
      (flexDirection === "row" || flexDirection == "column")
    ) {
      $("#wrap").removeClass("pressed-button");
      $("#wrap-text").text("Wrap");
      return;
    } else
      console.error("Unknown wrap configuration: ", flexDirection, flexWrap);
  }
}

function selectAlignmentObject(alignItems, justifyContent) {
  const alignmentMap = {
    "flex-start|flex-start": "#top-left",
    "flex-start|center": "#top-center",
    "flex-start|flex-end": "#top-right",
    "center|flex-start": "#left",
    "center|center": "#center",
    "center|flex-end": "#right",
    "flex-end|flex-start": "#bottom-left",
    "flex-end|center": "#bottom-center",
    "flex-end|flex-end": "#bottom-right",
  };

  const uniqueAlignmentMap = {
    "stretch|flex-start": "left-stretch",
    "stretch|center": "center-stretch",
    "stretch|flex-end": "right-stretch",
    "baseline|flex-start": "left-baseline",
    "baseline|center": "center-baseline",
    "baseline|flex-end": "right-baseline",
    "flex-start|space-between": "left-sb",
    "center|space-between": "center-sb",
    "flex-end|space-between": "right-sb",
    "flex-start|space-around": "left-sa",
    "center|space-around": "center-sa",
    "flex-end|space-around": "right-sa",
    "stretch|space-between": "stretch-sb",
    "stretch|space-around": "stretch-sa",
    "baseline|space-between": "baseline-sb",
    "baseline|space-around": "baseline-sa",
  };

  const key = `${alignItems}|${justifyContent}`;
  if (alignmentMap[key]) {
    const alignX = $("#align-x");
    const alignY = $("#align-y");
    selectedAlignmentObject = $(alignmentMap[key]);
    selectedAlignmentObject.addClass("pressed-button");
    selectedAlignmentObject.html(
      '<span class="material-symbols-outlined">align_justify_center</span>'
    );
    const alignMap = {
      "top-left": {
        css: { "align-items": "flex-start", "justify-content": "flex-start" },
        x: "Left",
        y: "Top",
      },
      "top-center": {
        css: { "align-items": "flex-start", "justify-content": "center" },
        x: "Center",
        y: "Top",
      },
      "top-right": {
        css: { "align-items": "flex-start", "justify-content": "flex-end" },
        x: "Right",
        y: "Top",
      },
      left: {
        css: { "align-items": "center", "justify-content": "flex-start" },
        x: "Left",
        y: "Center",
      },
      center: {
        css: { "align-items": "center", "justify-content": "center" },
        x: "Center",
        y: "Center",
      },
      right: {
        css: { "align-items": "center", "justify-content": "flex-end" },
        x: "Right",
        y: "Center",
      },
      "bottom-left": {
        css: { "align-items": "flex-end", "justify-content": "flex-start" },
        x: "Left",
        y: "Bottom",
      },
      "bottom-center": {
        css: { "align-items": "flex-end", "justify-content": "center" },
        x: "Center",
        y: "Bottom",
      },
      "bottom-right": {
        css: { "align-items": "flex-end", "justify-content": "flex-end" },
        x: "Right",
        y: "Bottom",
      },
    };

    if (alignMap[alignmentMap[key].slice(1)]) {
      selectedDomObject.css(alignMap[alignmentMap[key].slice(1)].css);
      alignX.text(alignMap[alignmentMap[key].slice(1)].x);
      alignY.text(alignMap[alignmentMap[key].slice(1)].y);
    } else {
      console.error("Unknown alignment: " + alignmentMap[key].slice(1));
    }
  } else {
    if (!uniqueAlignmentMap[key])
      console.error(
        "Unkown alignment configuration: ",
        alignItems,
        justifyContent
      );
    if (uniqueAlignmentMap[key].includes("stretch"))
      $("#align-y").text("Stretch");
    else if (uniqueAlignmentMap[key].includes("baseline"))
      $("#align-y").text("Baseline");
    if (uniqueAlignmentMap[key].includes("sb"))
      $("#align-x").text("Space bet...");
    else if (uniqueAlignmentMap[key].includes("sa"))
      $("#align-x").text("Space ar...");
  }
}

function setDisplay(value, button) {
  if (selectedDomObject) {
    selectedDomObject.css("display", value);
    saveStyle([{ type: "display", value: value }]);
    checkForShowDisplaySettings(value);
    handleDisplay($("#displays .button"), button, "display");
    refreshStylePanel();
  }
}

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
    handleDisplay($("#directions .button"), button, "direction");
    refreshStylePanel();
  }
}

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
  handleDisplay($("#wrap-options .button"), button, "wrap");
  refreshStylePanel();
}

function setAlignmentWithMenu(value, button) {
  if (button.hasClass("horizontal")) {
    selectedDomObject.css("justify-content", value);
  } else if (button.hasClass("vertical")) {
    selectedDomObject.css("align-items", value);
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
  handleDisplay($("#align-box .button"), button, "alignment");
  refreshStylePanel();
}
/**
 * Sets gap value
 * @param {*} value Gap size (number)
 * @param {*} gapType Gap type (ex.: px, em, etc)
 * @param {*} button Dom element to be presented as active (default: null)
 * @param {*} type Gap, row-gap, column-gap (default: "gap")
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

function extractGapType(gapValue) {
  let gapType = "";
  for (let i = 0; i < gapValue.length; i++) {
    if (isNaN(parseInt(gapValue[i], 10))) {
      gapType += gapValue[i];
    }
  }
  return gapType;
}
