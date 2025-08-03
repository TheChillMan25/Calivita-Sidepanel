let selectedDomObject = null;
let currentSpacing = null;
let isDragging = false;
let startX, startY;
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
      let posLeft = $(this).position()["left"] - dif;
      if (posLeft + $("#tooltip").width() > window.innerWidth) {
        posLeft = window.innerWidth - $("#tooltip").width() - 8;
        $("#tooltip").css("right", ".5rem");
      }
      if ($("#tooltip").width() > 150) {
        $("#tooltip").css("right", ".5rem");
        posLeft = window.innerWidth - 14.5 * 16;
      }
      let posTop = window.innerHeight - $(this).position()["top"] + 10;
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
          break;
        case "align-items":
          resetAlingmentBox();
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
            $("#gap-percent").addClass("pressed-button");
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
            $("#row-gap-percent").addClass("pressed-button");
          }
          $("#row-gap-value").val(parseInt(value));
          $("#row-gap-type-text").text(extractType(value).toUpperCase());
          $("#row-gap-type").attr("data-value", extractType(value));
          break;
        case "column-gap":
          if (extractType(value) !== "%") {
            $("#column-gap-" + extractType(value)).addClass("pressed-button");
          } else {
            $("#column-gap-percent").addClass("pressed-button");
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
        default:
          console.warn("Unknown style key: " + key);
      }
    }
  } catch (error) {
    console.log(error);
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
    $(alignmentMap[key]).addClass("pressed-button");
    if (
      selectedDomObject.css("flex-direction") === "row" ||
      selectedDomObject.css("flex-direction") === "row-reverse"
    ) {
    }
    $(alignmentMap[key]).html(alignBoxMarkerCenter);
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

function setUpControlls() {
  console.log("Setting up controls");
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
  $("#gap-type").on("click", function () {
    showGapOptions("gap");
  });
  $("#gap-ui-container").on("click", function () {
    hideGapOptions();
  });
  $("#gap-options").on("click", ".button", function (event) {
    event.stopPropagation();
    let gapValue = $("#gap-range").val();
    let gapType = $(this).attr("data-value");
    setGap(gapValue, gapType, $(this));
  });
  $("#gap-lock").on("click", function () {
    toggleGapOptions();
  });
  $("#row-gap-type").on("click", function () {
    showGapOptions("row-gap");
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
  $("#row-gap-options").on("click", ".button", function (event) {
    event.stopPropagation();
    let gapValue = $("#row-gap-value").val();
    let gapType = $(this).attr("data-value");
    setGap(gapValue, gapType, $(this), "row-gap");
  });
  $("#column-gap-type").on("click", function () {
    showGapOptions("column-gap");
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
  $("#column-gap-options").on("click", ".button", function (event) {
    event.stopPropagation();
    let gapValue = $("#column-gap-value").val();
    let gapType = $(this).attr("data-value");
    setGap(gapValue, gapType, $(this), "column-gap");
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
    console.log("asd");
    currentSpacing = $(this).attr("id");
    showSpacingSettings($(this).attr("data-value"));
  });
  $("#spacing-type").on("click", function () {
    showSpacingType();
  });
  $("#spacing-ui-container").on("click", function (event) {
    event.stopPropagation();
    if ($("#spacing-type-options").css("display") !== "none") {
      hideSpacingType();
      return;
    }
    hideSpacingSettings();
    currentSpacing = null;
  });
  $("#spacing-range").on("input", function () {
    let val = $(this).val();
    let type = $("#spacing-type").attr("data-value");
    setSpacing(currentSpacing, val, type);
  });
  $("#spacing-type-options").on("click", ".button", function (event) {
    $("#spacing-type").attr("data-value", $(this).attr("data-value"));
    $("#spacing-type-text").text($(this).attr("data-value").toUpperCase());
    event.stopPropagation();
    let val = $("#spacing-range").val();
    let type = $(this).attr("data-value");
    setSpacing(currentSpacing, val, type, $(this));
  });
  $("#spacing-button-container").on("click", ".button", function () {
    $("#spacing-value").val($(this).attr("data-value"));
    $("#spacing-range").val($(this).attr("data-value"));
    let val = $(this).attr("data-value");
    let type = $("#spacing-type").attr("data-value");
    setSpacing(currentSpacing, val, type);
  });
  $("#spacing-reset").on("click", function () {
    $("#spacing-range").val(0);
    setSpacing(currentSpacing, 0, "px");
    hideSpacingSettings();
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
