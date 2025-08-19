let selectedDomObject = null;
let currentSpacing = null;
let currentSizing = null;
let currentType = null;
let currentPosProp = null;
let textShadow = null;
let editingTextShadow = false;

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
    $("#tooltip").show();
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
      const styleData = JSON.parse(localStorage.getItem($(this).attr("id")));
      if (styleData) {
        for (const [key, value] of Object.entries(styleData)) {
          $(this).css(key, value);
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
            hideMenu($("#display-ui-container"), $("#display-options"));
          } else {
            $("#other-display").removeClass("pressed-button");
          }
          checkForShowDisplaySettings(styleData.display);
          restrictFloat(value);
          restrictTextColumn(value);
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
          hideMenu($("#wrap-ui-container"), $("#wrap-options"));
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
          if (
            styleData.display.includes("flex") ||
            styleData.display.includes("grid")
          ) {
            if (extractType(value) !== "%") {
              $("#column-gap-" + extractType(value)).addClass("pressed-button");
            } else {
              $("#column-percent").addClass("pressed-button");
            }
            $("#column-gap-value").val(parseInt(value));
            $("#column-gap-type-text").text(extractType(value).toUpperCase());
            $("#column-gap-type").attr("data-value", extractType(value));
          } else if (styleData["column-count"] > 0) {
            $("#text-column-gap-type").attr("data-value", extractType(value));
            $("#text-column-gap-type").text(extractType(value).toUpperCase());
            $("#text-column-gap-range").val(extractValue(value));
            $("#text-column-gap-value").val(extractValue(value));
          }
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
        case "overflow":
          $("#overflow-" + value).addClass("pressed-button");
          break;
        case "aspect-ratio":
          $("#ratio").text(extractRatio(value));
          $("#ratio-desc").text(
            $("#ratio-" + extractRatio(value, false)).attr("data-desc")
          );
          if ($("#ratio").text() !== "Custom") $("#custom-ratio").hide();
          $("#ratio-width").val(extractRatio(value, false, true)["w"]);
          $("#ratio-height").val(extractRatio(value, false, true)["h"]);
          $("#ratio-" + extractRatio(value, false)).addClass("pressed-button");
          break;
        case "box-sizing":
          $("#" + value).addClass("pressed-button");
          break;
        case "object-fit":
          $("#fit-" + value).addClass("pressed-button");
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
          $("#" + value).addClass("pressed-button");
          $("#position").text(value[0].toUpperCase() + value.slice(1));
          $("#position-desc").html($("#" + value).attr("data-desc"));
          if (value !== "static") $("#position-container").show();
          else $("#position-container").hide();
          if (value === "absolute" || value === "fixed")
            $("#quick-positioning").css("display", "flex");
          else $("#quick-positioning").hide();
          break;
        case "float":
          $("#float-" + value).addClass("pressed-button");
          break;
        case "clear":
          $("#clear-" + value).addClass("pressed-button");
          break;
        case "font-family":
          $("#font").val(value);
          break;
        case "font-weight":
          $("#weight").val(value);
          break;
        case "text-align":
          $("#text-align-" + value).addClass("pressed-button");
          break;
        case "text-decoration":
          $("#decor-" + getDecor(value)["type"]).addClass("pressed-button");
          break;
        case "font-size":
          $("#font-size").val(extractValue(value));
          $("#font-size-type").attr("data-value", extractType(value));
          $("#font-size-type-text").text(extractType(value).toUpperCase());
          break;
        case "line-height":
          $("#line-height").val(extractValue(value));
          $("#line-height-type").attr("data-value", extractType(value));
          $("#line-height-type-text").text(extractType(value).toUpperCase());
          break;
        case "color":
          $("#color").val(rgbaToHex(value)["hex"]);
          $("#color-value").val(rgbaToHex(value)["hex"]);
          $("#color-alpha-range").val(rgbaToHex(value)["alpha"]);
          $("#color-alpha-value").val(rgbaToHex(value)["alpha"]);
          break;
        case "text-decoration-line":
          $("#decor-" + getDecor(value)["type"]).addClass("pressed-button");
          $("#more-line-menu").text(getTextDecor(value)["text"]);
          $("#more-line-" + getTextDecor(value)["id"]).addClass(
            "pressed-button"
          );
          break;
        case "text-decoration-style":
          $("#line-style").text(getTextDecor(value)["text"]);
          $("#line-" + getTextDecor(value)["id"]).addClass("pressed-button");
          break;
        case "text-decoration-thickness":
          $("#line-thickness-value").val(extractValue(value));
          if (value !== "auto") {
            $("#line-thickness-type").attr("data-value", extractType(value));
            $("#line-thickness-type-text").text(
              extractType(value).toUpperCase()
            );
          }
          break;
        case "text-decoration-color":
          $("#line-color").val(rgbaToHex(value)["hex"]);
          $("#line-color-value").val(rgbaToHex(value)["hex"]);
          $("#line-color-alpha-value").val(rgbaToHex(value)["alpha"]);
          $("#line-color-alpha-range").val(rgbaToHex(value)["alpha"]);
          break;
        case "text-decoration-skip-ink":
          $("#line-skip-ink").attr("data-value", value);
          $("#line-skip-ink").text(value[0].toUpperCase() + value.slice(1));
          break;
        case "letter-spacing":
          $("#letter-spacing").val(extractValue(value));
          if (value !== "normal") {
            $("#letter-spacing-type")
              .attr("data-value", extractType(value))
              .text(extractType(value).toUpperCase());
          }
          break;
        case "text-indent":
          $("#text-indent").val(extractValue(value));
          if (value !== "normal") {
            $("#text-indent-type")
              .attr("data-value", extractType(value))
              .text(extractType(value).toUpperCase());
          }
          break;
        case "column-count":
          if (value > 0) {
            $("#text-column-toggle")
              .css({
                opacity: "1",
              })
              .attr("data-desc", "");
          } else {
            $("#text-column-toggle")
              .css({
                opacity: "0.7",
              })
              .attr(
                "data-desc",
                "Set column count before adjusting the columns layout settings."
              )
              .addClass("hoverable");
          }
          $("#text-column").val(value === "auto" ? "" : value);
          break;
        case "column-rule-style":
          $("#column-rule-" + value).addClass("pressed-button");
          break;
        case "column-rule-width":
          $("#column-width-type")
            .attr("data-value", extractType(value))
            .text(extractType(value).toUpperCase());
          $("#column-width-range").val(extractValue(value));
          $("#column-width-value").val(extractValue(value));
          break;
        case "column-rule-color":
          $("#column-rule-color").val(rgbaToHex(value)["hex"]);
          $("#column-rule-color-value").val(rgbaToHex(value)["hex"]);
          $("#column-alpha-range").val(rgbaToHex(value)["alpha"]);
          $("#column-alpha-value").val(rgbaToHex(value)["alpha"]);
          break;
        case "column-span":
          $("#column-span-" + value).addClass("pressed-button");
          break;
        case "font-style":
          $("#italicize-" + value).addClass("pressed-button");
          break;
        case "text-transform":
          $("#capitalize-" + value).addClass("pressed-button");
          break;
        case "column-span":
          $("#column-span-" + value).addClass("pressed-button");
          break;
        case "direction":
          $("#text-direction-" + value).addClass("pressed-button");
          break;
        case "word-break":
          $("#word-break").text($("#word-break-" + value).text());
          $("#word-break-" + value).addClass("pressed-button");
          break;
        case "white-space":
          $("#white-space").text($("#white-space-" + value).text());
          $("#white-space-" + value).addClass("pressed-button");
          break;
        case "text-overflow":
          $("#text-overflow-" + value).addClass("pressed-button");
          break;
        case "stroke-width":
          $("#stroke-width").val(extractValue(value));
          $("#stroke-width-type").attr("data-value", extractType(value));
          $("#stroke-width-type").text(extractType(value).toUpperCase());
          break;
        case "stroke":
          $("#stroke-color").val(rgbaToHex(value)["hex"]);
          $("#stroke-color-value").val(rgbaToHex(value)["hex"]);
          $("#stroke-color-alpha").val(rgbaToHex(value)["alpha"]);
          $("#stroke-color-alpha-value").val(rgbaToHex(value)["alpha"]);
          break;
        case "text-shadow":
          $("#text-shadows").html("");
          let shadows = extractTextShadows(value);
          for (let i = 0; i < shadows.length; i++) {
            displayTextShadow(extractShadow(shadows[i]), i);
          }
          break;
        case "background-clip":
          $("#bg-clip").text($(`#bg-clip-${value}`).text());
          $(`#bg-clip-${value}`).addClass("pressed-button");
          $("#bg-clip-desc").text($(`#bg-clip-${value}`).attr("data-desc"));
          break;
        case "background-color":
          $("#bg-color").val(rgbaToHex(value)["hex"]);
          $("#bg-color-value").val(rgbaToHex(value)["hex"]);
          $("#bg-color-alpha").val(rgbaToHex(value)["alpha"]);
          $("#bg-color-alpha-value").val(rgbaToHex(value)["alpha"]);
          break;
        default:
          if (key.includes("width") || key.includes("height")) {
            if (value === "auto" || value === "none") break;
            $("#" + key).val(extractValue(value));
            $("#" + key + "-type").attr("data-value", extractType(value));
            $("#" + key + "-type-text").text(extractType(value).toUpperCase());
          } else if (key.includes("margin") || key.includes("padding")) {
            $("#" + key)
              .text(extractValue(value))
              .attr("data-value", value);
          } else if (["top", "left", "right", "bottom"].includes(key)) {
            $("#position-" + key)
              .text(extractValue(value))
              .attr("data-value", value);
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
    showMenu($("#display-options"), $("#display-ui-container"), $(this));
  });
  $("#display-ui-container").on("click", function () {
    hideMenu($("#display-options"), $("#display-ui-container"));
  });
  $("#displays").on("click", ".button", function (event) {
    event.stopPropagation();
    setStyle("display", $(this).attr("data-value"));
  });
  $("#flex-direction-container").on("click", ".button", function () {
    setDirection($(this).attr("data-value"), {
      type: "direction",
      object: $(this),
    });
  });
  $("#wrap-toggle").on("click", function () {
    showMenu($("#wrap-ui-container"), $("#wrap-options"), $(this));
  });
  $("#wrap-ui-container").on("click", function () {
    hideMenu($("#wrap-ui-container"), $("#wrap-options"));
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
        showAlignmentOptions("align-horizontal", $(this));
        break;

      case "align-y":
        showAlignmentOptions("align-vertical", $(this));
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
    hideMenu($("#type-options"), $("#type-ui-container"));
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
    setStyle("grid-auto-flow", $(this).attr("data-value"));
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
      hideMenu($("#type-options"), $("#type-ui-container"));
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
    if (val !== "auto") {
      type = $("#spacing-type").attr("data-value");
    }
    if (currentSpacing !== null) {
      setSpacing(currentSpacing, val, type);
    } else if (currentPosProp !== null) {
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
    let value = $(this).val();
    let type = $("#" + $(this).attr("id") + "-type").attr("data-value");
    if ($(this).val() === "") {
      if ($(this).attr("id").includes("max")) {
        value = "none";
        type = "";
      } else if ($(this).attr("id").includes("min")) {
        value = "0";
      } else value = "auto";
    }
    setStyle($(this).attr("id"), value, type);
  });
  $("#overflow-container").on("click", ".button", function () {
    let value = $(this).attr("data-value");
    setStyle("overflow", value);
  });
  $("#more-sizing-toggle").on("click", function () {
    toggleMore("sizing");
  });
  $("#ratio").on("click", function () {
    showMenu($("#ratio-ui-container"), $("#ratio-menu"), $(this));
  });
  $("#ratio-ui-container").on("click", function () {
    hideMenu($("#ratio-ui-container"), $("#ratio-menu"));
  });
  $("#ratio-menu").on("click", ".button", function () {
    setRatio($(this));
    refreshStylePanel();
    hideMenu($("#ratio-ui-container"), $("#ratio-menu"));
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
    setStyle("box-sizing", $(this).attr("data-value"));
  });
  $("#fill").on("click", function () {
    showMenu($("#fill-ui-container"), $("#fill-menu"), $(this));
  });
  $("#fill-ui-container").on("click", function () {
    hideMenu($("#fill-ui-container"), $("#fill-menu"));
  });
  $("#fill-menu").on("click", ".button", function () {
    setStyle("object-fit", $(this).attr("data-value"));
  });
  $("#object-position").on("click", function () {
    showMenu(
      $("#object-position-ui-container"),
      $("#object-position-menu"),
      $(this)
    );
  });
  $("#object-position-ui-container").on("click", function () {
    hideMenu($("#object-position-ui-container"), $("#object-position-menu"));
  });
  $("#object-position-box").on("click", ".button", function (event) {
    event.stopPropagation();
    resetBox("object-position");
    changeSVG("object-position", $(this).attr("data-value"));
    setObjectPosition($(this));
  });
  $("#position").on("click", function () {
    showMenu($("#position-ui-container"), $("#position-menu"), $(this));
  });
  $("#position-ui-container").on("click", function () {
    hideMenu($("#position-ui-container"), $("#position-menu"));
  });
  $("#position-menu").on("click", ".button", function () {
    let attr = $(this).attr("data-value");
    if (attr !== "static") $("#position-container").show();
    else $("#position-container").hide();
    if (attr === "absolute" || attr === "fixed")
      $("#quick-positioning").css("display", "flex");
    else $("#quick-positioning").hide();
    setStyle("position", $(this).attr("data-value"));
  });
  $("#position-container").on("click", ".toggle", function () {
    currentPosProp = $(this).attr("data-type");
    $("#spacing-type").attr("data-type", "position");
    showSpacingSettings($(this).attr("data-value"), $(this));
  });
  $("#quick-positioning").on("click", ".button", function () {
    let pos = JSON.parse($(this).attr("data-value"));
    setPositionDetails("left", pos["left"]);
    setPositionDetails("top", pos["top"]);
    setPositionDetails("right", pos["right"]);
    setPositionDetails("bottom", pos["bottom"]);
  });
  $("#float-clear-toggle").on("click", function () {
    toggleFloatClear();
  });
  $("#float-container").on("click", ".button", function () {
    setStyle("float", $(this).attr("data-value"));
  });
  $("#clear-container").on("click", ".button", function () {
    setStyle("clear", $(this).attr("data-value"));
  });
  $("#font").on("change", function () {
    setStyle("font-family", $(this).val());
  });
  $("#weight").on("change", function () {
    setStyle("font-weight", $(this).val());
  });
  $("#align-text").on("click", ".button", function () {
    setStyle("text-align", $(this).attr("data-value"));
  });
  $("#decor").on("click", ".button", function () {
    setStyle("text-decoration-line", $(this).attr("data-value"));
  });
  $("#font-size").on("input", function () {
    let type = $("#font-size-type").attr("data-value");
    setStyle("font-size", $(this).val(), type);
  });
  $("#line-height").on("input", function () {
    let type = $("#line-height-type").attr("data-value");
    setStyle("line-height", $(this).val(), type);
  });
  $("#color").on("input", function () {
    let value = $(this).val();
    let alpha = $("#color-alpha-range").val();
    $("#color-value").val(value);
    setStyle("color", hexToRgba(value, alpha));
  });
  $("#color-value").on("input", function () {
    let value = $(this).val();
    let alpha = $("#color-alpha-range").val();
    if (/^#([0-9a-fA-F]{6})$/.test(value)) {
      $("#color").val(value);
      setStyle("color", hexToRgba(value, alpha));
    }
  });
  $("#color-alpha-range").on("input", function () {
    let color = $("#color").val();
    let value = $(this).val();
    $("#color-alpha-value").val(value);
    setStyle("color", hexToRgba(color, value));
  });
  $("#color-alpha-value").on("input", function () {
    let color = $("#color").val();
    let value = $(this).val();
    $("#color-alpha-range").val(value);
    setStyle("color", hexToRgba(color, value));
  });
  $("#more-decor").on("click", function () {
    showMenu($("#decor-ui-container"), $("#decor-menu"), $(this), "grid");
  });
  $("#decor-ui-container").on("click", function (event) {
    event.stopPropagation();
    if (event.target === $(this).get(0))
      hideMenu($("#decor-ui-container"), $("#decor-menu"));
  });
  $("#inner-decor-ui-container").on("click", function () {
    hideMenu($("#inner-decor-ui-container"), $("#decor-line-style"));
    hideMenu($("#inner-decor-ui-container"), $("#more-line"));
  });
  $("#more-line-menu").on("click", function (event) {
    event.stopPropagation();
    showMoreLine($(this));
  });
  $("#more-line").on("click", ".button", function (event) {
    event.stopPropagation();
    $("#more-line-menu").attr("data-value", $(this).attr("data-value"));
    setStyle("text-decoration-line", $(this).attr("data-value"));
    hideMenu($("#inner-decor-ui-container"), $("#more-line"));
  });
  $("#line-style").on("click", function (event) {
    event.stopPropagation();
    showLineStyle($(this));
  });
  $("#decor-line-style").on("click", ".button", function (event) {
    event.stopPropagation();
    $("#line-style").attr("data-value", $(this).attr("data-value"));
    setStyle("text-decoration-style", $(this).attr("data-value"));
    hideMenu($("#inner-decor-ui-container"), $("#decor-line-style"));
  });
  $("#line-color").on("input", function () {
    let value = $(this).val();
    let alpha = $("#line-color-alpha-value").val();
    $("#line-color-value").val(value);
    setStyle("text-decoration-color", hexToRgba(value, alpha));
  });
  $("#line-color-value").on("input", function () {
    let value = $(this).val();
    let alpha = $("#line-color-alpha-value").val();
    if (/^#([0-9a-fA-F]{6})$/.test(value)) {
      $("#line-color").val(value);
      setStyle("text-decoration-color", hexToRgba(value, alpha));
    }
  });
  $("#line-color-alpha-range").on("input", function () {
    let value = $(this).val();
    $("#line-color-alpha-value").val(value);
    setStyle("text-decoration-color", hexToRgba($("#line-color").val(), value));
  });
  $("#line-color-alpha-value").on("input", function () {
    let value = $(this).val();
    $("#line-color-alpha-range").val(value);
    setStyle("text-decoration-color", hexToRgba($("#line-color").val(), value));
  });
  $("#line-thickness-value").on("input", function () {
    setStyle(
      "text-decoration-thickness",
      $(this).val() + $("#line-thickness-type").attr("data-value")
    );
  });
  $("#line-skip-ink").on("click", function () {
    toggleSkipInk($(this));
  });
  $("#auto-thickness").on("click", function () {
    $("#line-thickness-value").val("Auto");
    setStyle("text-decoration-thickness", "auto");
  });
  $("#letter-spacing").on("input", function () {
    setLetterSpacing(
      $(this).val(),
      $("#letter-spacing-type").attr("data-value")
    );
  });
  $("#text-indent").on("input", function () {
    setTextIndent($(this).val(), $("#text-indent-type").attr("data-value"));
  });
  $("#text-column").on("input", function () {
    setTextColumn($(this).val());
  });
  $("#text-column-toggle").on("click", function () {
    if (
      selectedDomObject.css("display") !== "flex" &&
      parseFloat($("#text-column").val()) > 0
    ) {
      showTextColumnSettings($(this));
    }
  });
  $("#column-ui-container").on("click", function (event) {
    if (event.target === $(this).get(0))
      hideMenu($("#column-ui-container"), $("#column-menu"));
  });
  $("#text-column-gap-range").on("input", function () {
    $("#text-column-gap-value").val($(this).val());
    setStyle(
      "column-gap",
      $(this).val(),
      $("#text-column-gap-type").attr("data-value")
    );
  });
  $("#text-column-gap-value").on("input", function () {
    $("#text-column-gap-range").val($(this).val());
    setStyle(
      "column-gap",
      $(this).val(),
      $("#text-column-gap-type").attr("data-value")
    );
  });
  $("#column-rule").on("click", ".button", function () {
    setStyle("column-rule-style", $(this).attr("data-value"));
  });
  $("#column-width-range").on("input", function () {
    $("#column-width-value").val($(this).val());
    setStyle(
      "column-rule-width",
      $(this).val(),
      $("#column-width-type").attr("data-value")
    );
  });
  $("#column-width-value").on("input", function () {
    $("#column-width-range").val($(this).val());
    setStyle(
      "column-rule-width",
      $(this).val(),
      $("#column-width-type").attr("data-value")
    );
  });
  $("#column-rule-color").on("input", function () {
    let value = $(this).val();
    let alpha = $("#column-alpha-range").val();
    $("#column-rule-color-value").val(value);
    setStyle("column-rule-color", hexToRgba(value, alpha));
  });
  $("#column-rule-color-value").on("input", function () {
    let value = $(this).val();
    let alpha = $("#column-rule-color").val();
    if (/^#([0-9a-fA-F]{6})$/.test(value)) {
      $("#column-rule-color").val(value);
      setStyle("column-rule-color", hexToRgba(value, alpha));
    }
  });
  $("#column-alpha-range").on("input", function () {
    let value = $("#column-rule-color").val();
    let alpha = $(this).val();
    $("#column-alpha-value").val(alpha);
    setStyle("column-rule-color", hexToRgba(value, alpha));
  });
  $("#column-alpha-value").on("input", function () {
    let value = $("#column-rule-color").val();
    let alpha = $(this).val();
    $("#column-alpha-range").val(alpha);
    setStyle("column-rule-color", hexToRgba(value, alpha));
  });
  $("#column-child-span").on("click", ".button", function () {
    if (
      selectedDomObject.parent().css("column-count") !== "auto" ||
      selectedDomObject.parent().css("column-count") > 0
    )
      setStyle("column-span", $(this).attr("data-value"));
  });
  $("#italicize").on("click", ".button", function () {
    setStyle("font-style", $(this).attr("data-value"));
  });
  $("#capitalize").on("click", ".button", function () {
    setStyle("text-transform", $(this).attr("data-value"));
  });
  $("#text-direction").on("click", ".button", function () {
    setStyle("direction", $(this).attr("data-value"));
  });
  $("#word-break").on("click", function () {
    showMenu($("#word-break-ui-container"), $("#word-break-menu"), $(this));
  });
  $("#word-break-ui-container").on("click", function (event) {
    if (event.target === $(this).get(0)) {
      hideMenu($("#word-break-ui-container"), $("#word-break-menu"));
    }
  });
  $("#word-break-menu").on("click", ".button", function () {
    setStyle("word-break", $(this).attr("data-value"));
    hideMenu($("#word-break-ui-container"), $("#word-break-menu"));
  });
  $("#word-break-menu").on("mouseenter", ".button", function () {
    $("#word-break-desc").text($(this).attr("data-desc"));
  });
  $("#white-space").on("click", function () {
    showMenu($("#white-space-ui-container"), $("#white-space-menu"), $(this));
  });
  $("#white-space-ui-container").on("click", function (event) {
    if (event.target === $(this).get(0)) {
      hideMenu($("#white-space-ui-container"), $("#white-space-menu"));
    }
  });
  $("#white-space-menu").on("click", ".button", function () {
    setStyle("white-space", $(this).attr("data-value"));
    hideMenu($("#white-space-ui-container"), $("#white-space-menu"));
  });
  $("#white-space-menu").on("mouseenter", ".button", function () {
    $("#white-space-desc").text($(this).attr("data-desc"));
  });
  $("#text-overflow").on("click", ".button", function () {
    setStyle("text-overflow", $(this).attr("data-value"));
  });
  $("#stroke-width").on("input", function () {
    let value = $(this).val();
    if (!isNaN(parseFloat(value))) {
      setStyle(
        "stroke-width",
        value,
        $("#stroke-width-type").attr("data-value")
      );
    }
  });
  $("#stroke-color").on("input", function () {
    $("#stroke-color-value").val($(this).val());
    let value = $(this).val();
    let alpha = $("#stroke-color-alpha").val();
    setStyle("stroke", hexToRgba(value, alpha));
  });
  $("#stroke-color-value").on("input", function () {
    let value = $(this).val();
    let alpha = $("#stroke-color-alpha").val();
    if (/^#([0-9a-fA-F]{6})$/.test(value)) {
      $("#stroke-color").val(value);
      setStyle("stroke", hexToRgba(value, alpha));
    }
  });
  $("#stroke-color-alpha").on("input", function () {
    $("#stroke-color-alpha-value").val($(this).val());
    let value = $("#stroke-color").val();
    let alpha = $("#stroke-color-alpha").val();
    setStyle("stroke", hexToRgba(value, alpha));
  });
  $("#stroke-color-alpha-value").on("input", function () {
    $("#stroke-color-alpha").val($(this).val());
    let value = $("#stroke-color").val();
    let alpha = $("#stroke-color-alpha").val();
    setStyle("stroke", hexToRgba(value, alpha));
  });
  $("#more-type-toggle").on("click", function () {
    toggleMore("type");
  });
  $("#text-shadow-toggle").on("click", function () {
    textShadow = selectedDomObject.css("text-shadow");
    showMenu(
      $("#text-shadow-ui-container"),
      $("#text-shadow-menu"),
      $(this),
      "grid"
    );
  });
  $("#text-shadow-ui-container").on("click", function (event) {
    if (event.target === $(this).get(0))
      hideMenu($(this), $("#text-shadow-menu"));
  });
  $("#text-shadow-menu").on(
    "input",
    'input[type="range"], #text-shadow-color, #text-shadow-color-value',
    function () {
      $("#" + $(this).attr("id") + "-value").val($(this).val());
      if (!editingTextShadow) setTextShadow();
    }
  );
  $("#text-shadows").on("click", ".button.remove", function () {
    let shadow = $("#text-shadow-" + $(this).attr("data-value")).attr(
      "data-value"
    );
    removeTextShadow(shadow);
  });
  $("#text-shadows").on("click", ".button.hide", function () {
    let shadow = $("#text-shadow-" + $(this).attr("data-value")).attr(
      "data-value"
    );
    let newShadow = toggleTextShadow(shadow);
    $("#text-shadow-" + $(this).attr("data-value")).attr(
      "data-value",
      newShadow
    );
  });
  /* $("#text-shadows").on("click", ".button.edit", function () {
    editTextShadow(
      $(this).parent().attr("data-value"),
      $(this).parent().attr("id")
    );
  }); */
  $("#bg-clip").on("click", function () {
    showMenu($("#bg-clip-ui-container"), $("#bg-clip-menu"), $(this));
  });
  $("#bg-clip-ui-container").on("click", function (event) {
    if (event.target === $(this).get(0)) {
      hideMenu($(this), $("#bg-clip-menu"));
    }
  });
  $("#bg-clip-menu").on("mouseenter", ".button", function () {
    $("#bg-clip-desc").text($(this).attr("data-desc"));
  });
  $("#bg-clip-menu").on("click", ".button", function () {
    setStyle("background-clip", $(this).attr("data-value"));
    hideMenu($("#bg-clip-ui-container"), $("#bg-clip-menu"));
  });
  $("#bg-color").on("input", function () {
    $("#bg-color-value").val($(this).val());
    setStyle(
      "background-color",
      hexToRgba($(this).val(), $("#bg-color-alpha").val())
    );
  });
  $("#bg-color-value").on("input", function () {
    $("#bg-color").val($(this).val());
    setStyle(
      "background-color",
      hexToRgba($(this).val(), $("#bg-color-alpha").val())
    );
  });
  $("#bg-color-alpha").on("input", function () {
    $("#bg-color-alpha-value").val($(this).val());
    setStyle(
      "background-color",
      hexToRgba($("#bg-color").val(), $(this).val())
    );
  });
  $("#bg-color-alpha-value").on("input", function () {
    $("#bg-color-alpha").val($(this).val());
    setStyle(
      "background-color",
      hexToRgba($("#bg-color").val(), $(this).val())
    );
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
      setStyle(currentSizing, value, type);
      break;
    case "position":
      value = $("#spacing-range").val();
      setPositionDetails(currentPosProp, value, type, button);
      break;
    case "font-size":
      value = parseFloat($("#font-size").val());
      setStyle("font-size", value, type);
      break;
    case "line-height":
      value = $("#line-height").val();
      setStyle("line-height", value, type);
      break;
    case "line-thickness":
      value = $("#line-thickness-value").val();
      setStyle("text-decoration-thickness", value + type);
      break;
    case "letter-spacing":
      value = $("#letter-spacing").val();
      if (value === "") value = 0;
      setLetterSpacing(value, type);
      break;
    case "text-indent":
      value = $("#text-indent").val();
      if (value === "") value = 0;
      setTextIndent(value, type);
      break;
    case "text-column-gap":
      value = $("#text-column-gap-range").val();
      setStyle("column-gap", value, type);
      break;
    case "column-width":
      value = $("#column-width-range").val();
      setStyle("column-rule-width", value, type);
      break;
    case "stroke-width":
      value = $("#stroke-width").val();
      setStyle("stroke-width", value, type);
      break;
    default:
      if (currentType.includes("text-shadow")) {
        $("#" + currentType + "-type").text(
          button.attr("data-value").toUpperCase()
        );
        setTextShadow();
        break;
      }
      console.error("Can't handle unknown type: ", currentType);
  }
  if (currentType === "sizing") currentType = currentSizing;
  $("#" + currentType + "-type").attr("data-value", button.attr("data-value"));
  $("#" + currentType + "-type-text").text(
    button.attr("data-value").toUpperCase()
  );
  handleDisplay(button.parent().find(".button"), button);
  hideMenu($("#type-options"), $("#type-ui-container"));
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

function restrictFloat(value) {
  if (value === "flex") {
    $("#float-container").attr(
      "data-desc",
      "Elements with display set to flex cannot be floated"
    );
    $("#float-container .button")
      .css("opacity", ".3")
      .css("pointer-events", "none");
  } else {
    $("#float-container").removeAttr("data-desc");
    $("#float-container .button")
      .css("opacity", "1")
      .css("pointer-events", "auto");
  }
}

function restrictTextColumn(value) {
  if (value === "flex") {
    $("#text-column-container").attr(
      "data-desc",
      "Elements with display set to flex cannot be floated"
    );
    $("#text-column-container input,#text-column-container .toggle")
      .css("opacity", ".3")
      .css("pointer-events", "none");
  } else {
    $("#text-column-container").removeAttr("data-desc");
    $("#text-column-container input,#text-column-container .toggle")
      .css("opacity", "1")
      .css("pointer-events", "auto");
  }
}

function hexToRgba(hex, alpha = 1) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return parseFloat(alpha) === 100
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
}

function rgbaToHex(rgbaString) {
  const toHex = (value) => Math.round(value).toString(16).padStart(2, "0");
  if (!rgbaString.includes("rgba")) {
    const match = rgbaString.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (!match) {
      throw new Error("Érvénytelen RGBA formátum");
    }

    const [, r, g, b] = match.map((v, i) => (i === 0 ? v : parseFloat(v)));

    return {
      hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
      alpha: 100,
    };
  } else {
    const match = rgbaString.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/
    );

    if (!match) {
      throw new Error("Érvénytelen RGBA formátum");
    }

    const [, r, g, b, a] = match.map((v, i) => (i === 0 ? v : parseFloat(v)));

    return {
      hex: `#${toHex(r)}${toHex(g)}${toHex(b)}`,
      alpha: Math.round(a * 100),
    };
  }
}
