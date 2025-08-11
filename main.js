let selectedDomObject = null;
let currentSpacing = null,
  currentSizing = null;
let currentType = null;
let currentPosProp = null;
let spaPosUI = `
  <div id="spacing-setting-ui" class="menu-container">
    <div id="spacing-range-container">
      <svg
        data-wf-icon="MarginLeftIcon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.4"
          d="M14 2L14 13L10 13L10 2L14 2Z"
          fill="currentColor"
          fill-opacity="0.67"></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M7.99995 7L7.99995 1H8.99995L8.99995 14H7.99995L7.99995 8L3.70706 8L5.85351 10.1464L5.1464 10.8536L1.79285 7.5L5.1464 4.14645L5.85351 4.85355L3.70706 7L7.99995 7Z"
          fill="currentColor"></path>
      </svg>
      <input
        type="range"
        name="spacing-range"
        id="spacing-range"
        value="0"
        style="width: 6rem" />
      <input
        type="text"
        name="spacing-value"
        id="spacing-value"
        class="number-input"
        value="0" />
      <div
        id="spacing-type"
        class="toggle type-toggle"
        data-value=""
        data-type="">
        <span id="spacing-type-text">PX</span>
        <div id="spacing-type-options" class="menu-container">
          <div id="spacing-type-px" data-value="px" class="button">PX</div>
          <div id="spacing-type-em" data-value="em" class="button">EM</div>
          <div id="spacing-type-rem" data-value="rem" class="button">REM</div>
          <div id="spacing-type-ch" data-value="ch" class="button">CH</div>
          <div id="spacing-type-vw" data-value="vw" class="button">VW</div>
          <div id="spacing-type-vh" data-value="vh" class="button">VH</div>
          <div id="spacing-type-svw" data-value="svw" class="button">SVW</div>
          <div id="spacing-type-svh" data-value="svh" class="button">SVH</div>
          <div id="spacing-type-percent" data-value="%" class="button">%</div>
        </div>
      </div>
    </div>
    <div id="spacing-button-container">
      <div id="spacing-auto" class="button" data-value="auto">Auto</div>
      <div id="spacing-buttons">
        <div class="button" data-value="0">0</div>
        <div class="button" data-value="10">10</div>
        <div class="button" data-value="15">15</div>
        <div class="button" data-value="20">20</div>
        <div class="button" data-value="25">25</div>
        <div class="button" data-value="50">50</div>
        <div class="button" data-value="75">75</div>
        <div class="button" data-value="100">100</div>
      </div>
    </div>
    <div
      id="spacing-reset"
      class="button"
      style="justify-content: start; gap: 0.5rem">
      <div>
        <svg
          data-wf-icon="UndoIcon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.70712 5.00004L6.35357 2.35359L5.64646 1.64648L1.79291 5.50004L5.64646 9.35359L6.35357 8.64648L3.70712 6.00004H10C11.6569 6.00004 13 7.34318 13 9.00004C13 10.6569 11.6569 12 10 12H8.00001V13H10C12.2092 13 14 11.2092 14 9.00004C14 6.7909 12.2092 5.00004 10 5.00004H3.70712Z"
            fill="currentColor"></path>
        </svg>
      </div>
      Reset
    </div>
  </div>
`;

let alignBoxMarkerCenter =
  '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill="transparent" d="M0 0h100v100H0z"/><path fill="#fff" d="M3 4h2v8H3zm4-2h2v12H7zm4 2h2v8h-2z"/></svg>';
/* let alignBoxMarkerLeft =
  '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M2 3h8v2H2zm0 4h12v2H2zm0 4h8v2H2z"/></svg>';
let alignBoxMarkerRight =
  '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M6 3h8v2H6zM2 7h12v2H2zm4 4h8v2H6z"/></svg>'; */

$(document).ready(function () {
  pageRefreshLoad();
  if (selectedDomObject === null) {
    $("#select-smt").show();
    $("#settings").hide();
  } else {
    $("#select-smt").hide();
    $("#settings").show();
    refreshStylePanel();
  }

  $(".editable").each(function () {
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

  $(".hoverable").on("mouseenter", function () {
    if ($(this).attr("data-desc") && !$(this).hasClass("menu-button")) {
      $("#tooltip").text($(this).attr("data-desc"));
      let dif = ($("#tooltip").width() - $(this).width()) / 2;
      let posLeft = $(this).offset()["left"] - dif;
      if (posLeft + $("#tooltip").width() > window.innerWidth) {
        posLeft = window.innerWidth - $("#tooltip").width() - 8;
        $("#tooltip").css("right", ".5rem");
      }
      if ($("#tooltip").width() > 150) {
        $("#tooltip").css("right", ".5rem");
        posLeft = window.innerWidth - 14.5 * 16;
      }
      let posTop = window.innerHeight - $(this).offset()["top"] + 10;
      $("#tooltip").css("bottom", posTop);
      $("#tooltip").css("left", posLeft);
      $("#tooltip").show();
    }
  });
  $(".hoverable").on("mouseleave", function () {
    $("#tooltip").hide();
    $("#tooltip").css("right", "unset");
  });

  $(".align-hoverable").on("mouseenter", function () {
    if ($(this).hasClass("horizontal")) {
      if ($(this).attr("data-desc").includes("Align children to")) {
        let domDir = selectedDomObject.css("flex-direction");
        let dir =
          domDir === "row" || domDir === "row-reverse" ? "row" : "column";
        $("#align-h-data-desc").text($(this).attr("data-desc") + dir);
      } else {
        $("#align-h-data-desc").text($(this).attr("data-desc"));
      }
    } else if ($(this).hasClass("vertical")) {
      if (
        $(this).attr("data-desc").includes("Align children to") &&
        !$(this).attr("data-desc").includes("baseline")
      ) {
        let domDir = selectedDomObject.css("flex-direction");
        let dir =
          domDir === "row" || domDir === "row-reverse" ? "row" : "column";
        $("#align-v-data-desc").text($(this).attr("data-desc") + dir);
      } else {
        $("#align-v-data-desc").text($(this).attr("data-desc"));
      }
    }
  });
  setUpControlls();
});

/**
 * Selects object to edit
 * @param {*} object Object to mark as selected to edit
 */
function selectDomObject(object) {
  if ($("#settings").css("display") === "none") {
    $("#settings").show();
    $("#select-smt").hide();
  }
  if (selectedDomObject !== object) {
    if (selectedDomObject) selectedDomObject.removeClass("selected");
    selectedDomObject = object;
    localStorage.setItem("selectedDomObject", selectedDomObject.attr("id"));
    selectedDomObject.addClass("selected");
    $("#name").text(getElementName(selectedDomObject));
  }
  refreshStylePanel();
}

/**
 * Saves data from objects in array
 * @param {Array} dataObjects Array of objects to save - ex.:[{type: "display", value: "block"}, {etc...}]
 */
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
      let cG = false;
      const styleData = JSON.parse(localStorage.getItem($(this).attr("id")));
      if (styleData) {
        if ("custom-gap" in styleData)
          cG = styleData["custom-gap"] === "true" ? true : false;
        for (const [key, value] of Object.entries(styleData)) {
          if (cG && key === "gap") continue;
          else if (!cG && (key === "column-gap" || key === "row-gap")) continue;
          else $(this).css(key, value);
        }
      } else {
        selectedDomObject = $(this);
        saveStyle([{ type: "display", value: "block" }]);
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
  checkChild();
  if (selectedDomObject.attr("id") === "body") {
    $("#flex-child").hide();
    $("#grid-child").hide();
  }
  $("#sidepanel .button").removeClass("pressed-button");
  try {
    let styleData = JSON.parse(
      localStorage.getItem(selectedDomObject.attr("id"))
    );
    for (const [key, value] of Object.entries(styleData)) {
      switch (key) {
        case "display":
          $("#" + value).addClass("pressed-button");
          if (
            styleData.display.includes("inline") ||
            styleData.display === "none"
          ) {
            $("#od-text").text(getDisplayName(styleData.display));
            $("#other-display").addClass("pressed-button");
            hideDisplayOptions();
          } else {
            $("#other-display").removeClass("pressed-button");
          }
          checkForShowDisplaySettings(styleData.display);
          break;
        case "flex-direction":
          $("#" + value).addClass("pressed-button");
          break;
        case "flex-wrap":
          if (value !== "nowrap") {
            $("#row").removeClass("pressed-button");
            $("#column").removeClass("pressed-button");
          }
          $("#" + value).addClass("pressed-button");
          displaySelectedWrapOption(
            selectWrapObject(
              styleData["flex-direction"],
              styleData["flex-wrap"]
            )
          );
          hideWrapOptions();
          break;
        case "align-items":
          resetBox("align");
          selectAlignmentObject(
            styleData["align-items"],
            styleData["justify-content"]
          );
          break;
        case "justify-content":
          break;
        case "gap":
          if (extractType(styleData["gap"]) !== "%") {
            $("#gap-" + extractType(styleData["gap"])).addClass(
              "pressed-button"
            );
          } else {
            $("#percent").addClass("pressed-button");
          }
          $("#gap-range").val(parseInt(value));
          $("#gap-value").val(parseInt(value));
          $("#gap-type-text").text(extractType(value).toUpperCase());
          $("#gap-type").attr("data-value", extractType(value));
          break;
        case "row-gap":
          if (extractType(value) !== "%") {
            $("#row-gap-" + extractType(value)).addClass("pressed-button");
          } else {
            $("#row-percent").addClass("pressed-button");
          }
          $("#row-gap-value").val(parseInt(value));
          $("#row-gap-type-text").text(extractType(value).toUpperCase());
          $("#row-gap-type").attr("data-value", extractType(value));
          break;
        case "column-gap":
          if (extractType(value) !== "%") {
            $("#column-gap-" + extractType(value)).addClass("pressed-button");
          } else {
            $("#column-percent").addClass("pressed-button");
          }
          $("#column-gap-value").val(parseInt(value));
          $("#column-gap-type-text").text(extractType(value).toUpperCase());
          $("#column-gap-type").attr("data-value", extractType(value));
          break;
        case "grid-template-rows":
          $("#grid-rows").attr("value", countGridColsRows(value));
          break;
        case "grid-template-columns":
          $("#grid-columns").attr("value", countGridColsRows(value));
          break;
        case "grid-auto-flow":
          switch (value) {
            case "row":
              $("#grid-horizontal").addClass("pressed-button");
              break;
            case "column":
              $("#grid-vertical").addClass("pressed-button");
              break;
          }
          break;
        case "place-content":
          let c = extractPlaceContentValue(value);
          if (c["align-content"] === "space-between")
            $("#grid-row-sb").addClass("pressed-button");
          else if (c["align-content"] === "space-around")
            $("#grid-row-sa").addClass("pressed-button");
          else $("#grid-row-" + c["align-content"]).addClass("pressed-button");
          if (c["justify-content"] === "space-between")
            $("#grid-col-sb").addClass("pressed-button");
          else if (c["justify-content"] === "space-around")
            $("#grid-col-sa").addClass("pressed-button");
          else
            $("#grid-col-" + c["justify-content"]).addClass("pressed-button");
          break;
        case "margin-top":
          $("#" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "margin-right":
          $("#" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "margin-bottom":
          $("#" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "margin-left":
          $("#" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "padding-top":
          $("#" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "padding-right":
          $("#" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "padding-bottom":
          $("#" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "padding-left":
          $("#" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "overflow":
          $("#overflow-" + value).addClass("pressed-button");
          break;
        case "aspect-ratio":
          $("#ratio").text(extractRatio(value));
          if ($("#ratio").text() !== "Custom") $("#custom-ratio").hide();
          $("#ratio-width").val(extractRatio(value, false, true)["w"]);
          $("#ratio-height").val(extractRatio(value, false, true)["h"]);
          break;
        case "box-sizing":
          $("#" + value).addClass("pressed-button");
          break;
        case "object-fit":
          $("#fill-text").text($("#fit-" + value).text());
          break;
        case "object-position":
          let vT = getObjectPosition(value);
          $("#object-position-" + vT).addClass("pressed-button");
          changeObjectPosSVG(vT);
          let vN = getObjectPosition(value, false);
          $("#object-position-left-value").val(vN["l"] + "%");
          $("#object-position-top-value").val(vN["t"] + "%");
          break;
        case "position":
          $("#position").text(value[0].toUpperCase() + value.slice(1));
          $("#position-desc").html($("#" + value).attr("data-desc"));
          if (value !== "static") $("#position-container").show();
          else $("#position-container").hide();
          if (value === "absolute" || value === "fixed")
            $("#quick-positioning").css("display", "flex");
          else $("#quick-positioning").hide();
          break;
        case "left":
          $("#position-" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "top":
          $("#position-" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "right":
          $("#position-" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "bottom":
          $("#position-" + key)
            .text(extractValue(value))
            .attr("data-value", value);
          break;
        case "float":
          $("#float-" + value).addClass("pressed-button");
          break;
        case "clear":
          $("#clear-" + value).addClass("pressed-button");
          break;
        default:
          if (key.includes("width") || key.includes("height")) {
            if (value === "auto" || value === "none") break;
            $("#" + key).val(extractValue(value));
            $("#" + key + "-type").attr("data-value", extractType(value));
            $("#" + key + "-type-text").text(extractType(value).toUpperCase());
          } else console.warn("Unknown style key: " + key);
      }
    }
  } catch (error) {
    console.error(error);
  }
}
/**
 * Sets active wrap button
 * @param {string} flexDirection CSS flex-direction property
 * @param {string} flexWrap CSS flex-wrap property
 * @returns {*} The DOM element according to the first two property
 */
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
    $("#wrap").addClass("pressed-button");
    $("#wrap").attr("value", wrapMap[key].slice(1));
    return $(wrapMap[key]);
  } else {
    if (
      flexWrap === "nowrap" &&
      (flexDirection === "row" || flexDirection == "column")
    ) {
      $("#wrap").removeClass("pressed-button");
      return;
    } else
      console.error("Unknown wrap configuration: ", flexDirection, flexWrap);
  }
}

function selectAlignmentObject(alignItems, justifyContent) {
  const alignmentMap = {
    "flex-start|flex-start": "#align-top-left",
    "flex-start|center": "#align-top-center",
    "flex-start|flex-end": "#align-top-right",
    "center|flex-start": "#align-left",
    "center|center": "#align-center",
    "center|flex-end": "#align-right",
    "flex-end|flex-start": "#align-bottom-left",
    "flex-end|center": "#align-bottom-center",
    "flex-end|flex-end": "#align-bottom-right",
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
    $(alignmentMap[key]).addClass("pressed-button");
    if (
      selectedDomObject.css("flex-direction") === "row" ||
      selectedDomObject.css("flex-direction") === "row-reverse"
    ) {
    }
    $(alignmentMap[key]).html(alignBoxMarkerCenter);
    const alignMap = {
      "align-top-left": {
        css: { "align-items": "flex-start", "justify-content": "flex-start" },
        x: "Left",
        y: "Top",
      },
      "align-top-center": {
        css: { "align-items": "flex-start", "justify-content": "center" },
        x: "Center",
        y: "Top",
      },
      "align-top-right": {
        css: { "align-items": "flex-start", "justify-content": "flex-end" },
        x: "Right",
        y: "Top",
      },
      "align-left": {
        css: { "align-items": "center", "justify-content": "flex-start" },
        x: "Left",
        y: "Center",
      },
      "align-center": {
        css: { "align-items": "center", "justify-content": "center" },
        x: "Center",
        y: "Center",
      },
      "align-right": {
        css: { "align-items": "center", "justify-content": "flex-end" },
        x: "Right",
        y: "Center",
      },
      "align-bottom-left": {
        css: { "align-items": "flex-end", "justify-content": "flex-start" },
        x: "Left",
        y: "Bottom",
      },
      "align-bottom-center": {
        css: { "align-items": "flex-end", "justify-content": "center" },
        x: "Center",
        y: "Bottom",
      },
      "align-bottom-right": {
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

function setUpControlls() {
  $("#displays-toggle").on("click", function (event) {
    event.stopPropagation();
    showDisplayOptions();
  });
  $("#display-ui-container").on("click", function () {
    hideDisplayOptions();
  });
  $("#displays").on("click", ".button", function (event) {
    event.stopPropagation();
    setDisplay($(this).attr("data-value"), {
      type: "display",
      object: $(this),
    });
  });
  $("#flex-direction-container").on("click", ".button", function () {
    setDirection($(this).attr("data-value"), {
      type: "direction",
      object: $(this),
    });
  });
  $("#wrap-toggle").on("click", function () {
    showWrapOptions();
  });
  $("#wrap-ui-container").on("click", function () {
    hideWrapOptions();
  });
  $("#wrap-options").on("click", ".button", function (event) {
    event.stopPropagation();
    setWrap($(this).attr("data-value"), $(this));
  });
  $("#align-box").on("click", ".button", function () {
    setAlignmentWithBox($(this).attr("data-value"), {
      type: "alignment",
      object: $(this),
    });
  });
  $("#align-box").on("mouseenter", ".button", function () {
    $(this).html(alignBoxMarkerCenter);
  });
  $("#align-box").on("mouseleave", ".button", function () {
    if (!$(this).hasClass("pressed-button"))
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
    setAlignmentWithMenu($(this).attr("data-value"), $(this));
  });
  $("#gap-range").on("input", function () {
    setGap($(this).val(), $("#gap-type").attr("data-value"));
  });
  $("#gap-value").on("input", function () {
    let gapValue = parseInt($(this).val());
    if (!isNaN(gapValue) && gapValue >= 0 && gapValue <= 100) {
      setGap(gapValue, $("#gap-type").attr("data-value"), $(this), "gap");
    }
  });
  $(".toggle.type-toggle").on("click", function (event) {
    event.stopPropagation();
    if ($(this).attr("data-type") === "sizing") {
      currentSizing = $(this).attr("id").slice(0, -5);
    }
    showTypeOptions($(this));
  });
  $("#type-ui-container").on("click", function () {
    hideTypeOptions();
  });
  $("#type-options").on("click", ".button", function (event) {
    event.stopPropagation();
    handleTypeSelection($(this));
  });
  $("#gap-lock").on("click", function () {
    toggleGapOptions();
  });
  $("#row-gap-value").on("input", function () {
    let gapValue = parseInt($(this).val());
    let colGapValue = parseInt($("#column-gap-value").val());
    if (!isNaN(gapValue) && gapValue >= 0 && gapValue <= 100) {
      let rowAttr = $("#row-gap-type").attr("data-value");
      if (rowAttr === "percent") rowAttr = "%";
      setGap(
        gapValue,
        $("#row-gap-type").attr("data-value"),
        $("#row-gap-" + rowAttr),
        "row-gap"
      );
      if (!isNaN(colGapValue) && colGapValue >= 0 && colGapValue <= 100) {
        let colAttr = $("#column-gap-type").attr("data-value");
        if (colAttr === "percent") colAttr = "%";
        setGap(
          colGapValue,
          $("#column-gap-type").attr("data-value"),
          $("#column-gap" + colAttr),
          "column-gap"
        );
      }
    }
  });
  $("#column-gap-value").on("input", function () {
    let gapValue = parseInt($(this).val());
    let rowGapValue = parseInt($("#row-gap-value").val());
    if (!isNaN(gapValue) && gapValue >= 0 && gapValue <= 100) {
      let colAttr = $("#column-gap-type").attr("data-value");
      if (colAttr === "percent") colAttr = "%";
      setGap(
        gapValue,
        $("#column-gap-type").attr("data-value"),
        $("#column-gap" + colAttr),
        "column-gap"
      );
      if (!isNaN(rowGapValue) && rowGapValue >= 0 && rowGapValue <= 100) {
        let rowAttr = $("#row-gap-type").attr("data-value");
        if (rowAttr === "percent") rowAttr = "%";
        setGap(
          rowGapValue,
          $("#row-gap-type").attr("data-value"),
          $("#row-gap-" + rowAttr),
          "row-gap"
        );
      }
    }
  });
  $("#grid-columns").on("input", function () {
    let colNum = $(this).val();
    if (!isNaN(colNum) && colNum >= 1 && colNum <= 300) {
      setGridColsRowsCount($(this).val(), "columns");
    }
  });
  $("#grid-rows").on("input", function () {
    let rowNum = $("#grid-rows").val();
    if (!isNaN(rowNum) && rowNum >= 1 && rowNum <= 300) {
      setGridColsRowsCount($(this).val(), "rows");
    }
  });
  $("#grid-direction-container").on("click", ".button", function () {
    setGridDirection($(this).attr("data-value"), $(this));
  });
  $("#more-grid-toggle").on("click", function () {
    toggleMore("grid");
  });
  $("#more-column-settings").on("click", ".button", function () {
    let aC = $("#more-row-settings .pressed-button");
    setGridInnerAlignment(
      $(this).attr("data-value"),
      aC.attr("data-value"),
      $(this)
    );
  });
  $("#more-row-settings").on("click", ".button", function () {
    let jC = $("#more-column-settings .pressed-button");
    setGridInnerAlignment(jC.attr("data-value"), $(this).attr("data-value"));
  });
  $(".spacing-setting.toggle").on("click", function () {
    currentSpacing = $(this).attr("id");
    $("#spacing-type").attr("data-type", "spacing");
    showSpacingSettings($(this).attr("data-value"), $(this));
  });
  $("#spacing-ui-container").on("click", function (event) {
    if ($(event.target).is('input[type="range"]')) {
      return;
    }
    if ($("#spacing-type-options").css("display") !== "none") {
      hideTypeOptions();
      return;
    }
    hideSpacingSettings($("#spacing-setting-ui").parent());
  });
  $("#spacing-range").on("input", function () {
    let val = $(this).val();
    let type = $("#spacing-type").attr("data-value");
    if (currentSpacing !== null) {
      setSpacing(currentSpacing, val, type);
    } else if (currentPosProp !== null) {
      setPositionDetails(currentPosProp, val, type);
    }
  });
  $("#spacing-button-container").on("click", ".button", function (event) {
    event.stopPropagation();
    $("#spacing-value").val($(this).attr("data-value"));
    $("#spacing-range").val($(this).attr("data-value"));
    let val = $(this).attr("data-value");
    let type = "";
    console.log(val);
    if (val !== "auto") {
      type = $("#spacing-type").attr("data-value");
    }
    if (currentSpacing !== null) {
      console.log(currentSpacing);
      setSpacing(currentSpacing, val, type);
    } else if (currentPosProp !== null) {
      console.log(currentPosProp);
      setPositionDetails(currentPosProp, val, type);
    }
  });
  $("#spacing-reset").on("click", function (event) {
    event.stopPropagation();
    $("#spacing-range").val(0);
    if (currentSpacing !== null) {
      setSpacing(currentSpacing, 0, "px");
    } else if (currentPosProp !== null) {
      setPositionDetails(currentPosProp, 0, "px");
    }
    hideSpacingSettings();
  });
  $("#sizing-container").on("input", ".number-input", function () {
    let value =
      $(this).val() + $("#" + $(this).attr("id") + "-type").attr("data-value");
    if ($(this).val() === "") {
      if ($(this).attr("id").includes("max")) {
        value = "none";
      } else if ($(this).attr("id").includes("min")) {
        value = "0";
      } else value = "auto";
    }
    setSizing($(this).attr("id"), value);
  });
  $("#overflow-container").on("click", ".button", function () {
    let value = $(this).attr("data-value");
    setOverflow(value, $(this));
  });
  $("#more-sizing-toggle").on("click", function () {
    toggleMore("sizing");
  });
  $("#ratio").on("click", function () {
    showRatioSettings($(this));
  });
  $("#ratio-ui-container").on("click", function () {
    hideRatioSettings();
  });
  $("#ratio-menu").on("click", ".button", function () {
    setRatio($(this));
    refreshStylePanel();
    hideCustomRatio();
  });
  $("#ratio-custom").on("click", function () {
    $("#ratio").text("Custom");
    showCustomRatio();
  });
  $("#custom-ratio").on("input", ".number-input", function () {
    $("#ratio").text("Custom");
    let w = $("#ratio-width").val(),
      h = $("#ratio-height").val();
    if (!isNaN(parseFloat(w)) && !isNaN(parseFloat(h))) {
      setRatio(null, { w: w, h: h });
    }
  });
  $("#ratio-menu").on("mouseenter", ".button, .toggle", function () {
    $("#ratio-desc").text($(this).attr("data-desc"));
  });
  $("#box-sizing").on("click", ".button", function () {
    setBoxSizing($(this));
  });
  $("#fill").on("click", function () {
    showFillSettings($(this));
  });
  $("#fill-ui-container").on("click", function () {
    hideFillSettings();
  });
  $("#fill-menu").on("click", ".button", function () {
    setObjectFit($(this));
  });
  $("#object-position").on("click", function () {
    showObjectPosSettings($(this));
  });
  $("#object-position-ui-container").on("click", function () {
    hideObjectPosSettings();
  });
  $("#object-position-box").on("click", ".button", function (event) {
    event.stopPropagation();
    console.log($(this).attr("data-value"));
    resetBox("object-position");
    changeSVG("object-position", $(this).attr("data-value"));
    setObjectPosition($(this));
  });
  $("#position").on("click", function () {
    showPositionOptions($(this));
  });
  $("#position-ui-container").on("click", function () {
    hidePositionOptions();
  });
  $("#position-menu").on("click", ".button", function () {
    let attr = $(this).attr("data-value");
    if (attr !== "static") $("#position-container").show();
    else $("#position-container").hide();
    if (attr === "absolute" || attr === "fixed")
      $("#quick-positioning").css("display", "flex");
    else $("#quick-positioning").hide();
    setMainPosition($(this).attr("data-value"));
  });
  $("#position-container").on("click", ".toggle", function () {
    currentPosProp = $(this).attr("data-type");
    $("#spacing-type").attr("data-type", "position");
    showSpacingSettings($(this).attr("data-value"), $(this));
  });
  $("#quick-positioning").on("click", ".button", function () {
    let pos = JSON.parse($(this).attr("data-value"));
    console.log(pos);
    setPositionDetails("left", pos["left"]);
    setPositionDetails("top", pos["top"]);
    setPositionDetails("right", pos["right"]);
    setPositionDetails("bottom", pos["bottom"]);
  });
  $("#float-clear-toggle").on("click", function(){
    toggleFloatClear()
  })
  $("#float-container").on("click", ".button", function () {
    setFloat($(this).attr("data-value"));
  });
  $("#clear-container").on("click", ".button", function () {
    setClear($(this).attr("data-value"));
  });
}

function checkChild() {
  if (checkFlexChild()) $("#flex-child").show();
  else $("#flex-child").hide();
  if (checkGridChild()) $("#grid-child").show();
  else $("#grid-child").hide();
}

/**
 * Checks if parent is flex container
 * @returns true if parent is boolean, false otherwise
 */
function checkFlexChild() {
  if (
    selectedDomObject.parent().css("display") === "flex" ||
    selectedDomObject.parent().css("display") === "inline-flex"
  )
    return true;
  return false;
}

function checkGridChild() {
  if (
    selectedDomObject.parent().css("display") === "grid" ||
    selectedDomObject.parent().css("display") === "inline-grid"
  )
    return true;
  return false;
}

function handleTypeSelection(button) {
  let value;
  let type = button.attr("data-value");
  switch (currentType) {
    case "gap":
      value = $("#gap-range").val();
      setGap(value, type, button);
      break;
    case "row-gap":
      value = $("#row-gap-value").val();
      setGap(value, type, button, "row-gap");
      value = $("#column-gap-value").val();
      type = $("#column-gap-type").attr("data-value");
      setGap(value, type, null, "column-gap");
      break;
    case "column-gap":
      value = $("#column-gap-value").val();
      setGap(value, type, button, "column-gap");
      value = $("#row-gap-value").val();
      type = $("#row-gap-type").attr("data-value");
      setGap(value, type, null, "row-gap");
      break;
    case "spacing":
      value = $("#spacing-range").val();
      setSpacing(currentSpacing, value, type, button);
      break;
    case "sizing":
      value = $("#" + currentSizing).val();
      setSizing(currentSizing, value + type);
      break;
    case "position":
      value = $("#spacing-range").val();
      setPositionDetails(currentPosProp, value, type, button);
      break;
    default:
      console.error("Can't handle unknown type: ", currentType);
  }
  if (currentType === "sizing") currentType = currentSizing;
  $("#" + currentType + "-type").attr("data-value", button.attr("data-value"));
  $("#" + currentType + "-type-text").text(
    button.attr("data-value").toUpperCase()
  );
  handleDisplay(button.parent().find(".button"), button);
  hideTypeOptions();
}

/**
 *Get the name from the value of the object-position css property (50% 50% --> center)
 * @param {string} value Value of the object-position css property
 * @returns The name of the element that corresponds with the given value
 */
function getObjectPosition(value, text = true) {
  let l = "",
    t = "",
    b = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === " ") b = true;
    if (b && !isNaN(parseFloat(value[i]))) t += value[i];
    else if (!b && !isNaN(parseFloat(value[i]))) l += value[i];
  }
  if (!text) return { l: l, t: t };
  if (parseFloat(l) === 0) l = "left";
  else if (parseFloat(l) === 100) l = "right";
  else l = "center";
  if (parseFloat(t) === 0) t = "top-";
  else if (parseFloat(t) === 100) t = "bottom-";
  else t = "";
  return t + l;
}
