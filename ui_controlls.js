function showWrapOptions() {
  $("#wrap-ui-container").show();
  $("#wrap-options").show();
}

function hideWrapOptions() {
  $("#wrap-ui-container").hide();
  $("#wrap-options").hide();
}

function showDisplayOptions() {
  $("#display-options").show();
  $("#display-ui-container").show();
}

function hideDisplayOptions() {
  $("#display-options").hide();
  $("#display-ui-container").hide();
}

function showAlignmentOptions(axis) {
  $("#alignment-ui-container").show();
  $("#alignment-options").css("display", "flex");
  $("#" + axis).show();
}

function hideAlignmentOptions() {
  $("#alignment-ui-container").hide();
  $("#align-horizontal").hide();
  $("#align-vertical").hide();
}

function showSpacingSettings(value) {
  if (currentSpacing.includes("padding")) {
    $("#spacing-auto").hide();
  } else {
    $("#spacing-auto").show();
  }
  $("#spacing-range").val(extractValue(value));
  $("#spacing-value").val(extractValue(value));
  if (value !== "auto") {
    $("#spacing-type").attr("data-value", extractType(value));
    $("#spacing-type-text").text(extractType(value).toUpperCase());
  } else {
    $("#spacing-type").attr("data-value", "px");
    $("#spacing-type-text").text("PX");
  }
  $("#spacing-setting-ui").css("display", "flex");
  $("#spacing-ui-container").show();
}

function hideSpacingSettings() {
  $("#spacing-setting-ui").hide();
  $("#spacing-ui-container").hide();
}
/**
 * Shows type settings and sets current type ot use
 * @param {string} type Type of the element to change (gap, margin, padding, etc)
 */
function showTypeOptions(caller) {
  $("#type-options").show();
  $("#type-ui-container").show();
  $("#type-options .button").removeClass("pressed-button");
  let btn =
    caller.attr("data-value") === "%" ? "percent" : caller.attr("data-value");
  $("#" + btn).addClass("pressed-button");
  currentType = caller.attr("data-type");
  checkPos(caller, $("#type-options"));
}

function hideTypeOptions() {
  $("#type-options").hide();
  $("#type-ui-container").hide();
}

function hideGridSettings() {
  $("#grid-text").hide();
  $("#grid-layout").hide();
  $("#grid-layout-container").hide();
  $("#grid-direction-container").hide();
  $("#more-grid-options-container").hide();
}
function showGridSettings() {
  $("#grid-text").show();
  $("#grid-layout").show();
  $("#grid-layout-container").show();
  $("#grid-direction-container").show();
  $("#more-grid-options-container").show();
}

function toggleMore(value) {
  switch (value) {
    case "grid":
      if ($("#more-grid-options").css("display") !== "none") {
        $("#more-grid-options").hide();
      } else $("#more-grid-options").css("display", "grid");
      break;
    case "sizing":
      if ($("#more-sizing-options").css("display") !== "none") {
        $("#more-sizing-options").hide();
      } else $("#more-sizing-options").css("display", "grid");
      break;
  }
}

function showRatioSettings(caller) {
  $("#ratio-menu").show();
  $("#ratio-ui-container").show();
  checkPos(caller, $("#ratio-menu"));
  /* let a = selectedDomObject.css("aspect-ratio");
  $("#ratio-" + extractRatio(a, false)).addClass("pressed-button"); */
}

function hideRatioSettings() {
  $("#ratio-menu").hide();
  $("#ratio-ui-container").hide();
}

function showCustomRatio() {
  $("#custom-ratio").css("display", "grid");
}

function hideCustomRatio() {
  $("#custom-ratio").hide();
}

function toggleGapOptions() {
  if ($("#gap-unlocked").css("display") !== "none") {
    $("#gap-unlocked").hide();
    $("#gap-default").show();
    $("#gap-lock").html('<span class="material-symbols-outlined">lock</span>');
    let gap = {
      value: $("#gap-value").val(),
      type: $("#gap-type").attr("data-value"),
    };
    setGap(gap.value, gap.type);
  } else {
    $("#gap-unlocked").css("display", "flex");
    $("#gap-default").hide();
    $("#gap-lock").html(
      '<span class="material-symbols-outlined">lock_open_right</span>'
    );
    let row = {
      value: $("#row-gap-value").val(),
      type: $("#row-gap-type").attr("data-value"),
    };
    let col = {
      value: $("#column-gap-value").val(),
      type: $("#column-gap-type").attr("data-value"),
    };
    setGap(row.value, row.type, null, "row-gap");
    setGap(col.value, col.type, null, "column-gap");
  }
}

function checkForShowDisplaySettings(value) {
  if (value === "flex" || value === "inline-flex") {
    $("#secondary-display-settings").css("display", "grid");
    $("#flex-direction-container").show();
    hideGridSettings();
  } else if (value === "block" || value === "inline-block") {
    $("#secondary-display-settings").hide();
    $("#flex-direction-container").hide();
    hideGridSettings();
  } else if (value === "grid" || value === "inline-grid") {
    $("#secondary-display-settings").css("display", "grid");
    $("#flex-direction-container").hide();
    showGridSettings();
  } else if (value === "inline") {
    $("#secondary-display-settings").hide();
    $("#flex-direction-container").hide();
    hideGridSettings();
  } else {
    $("#flex-direction-container").hide();
  }
}

function getDisplayName(display) {
  switch (display) {
    case "inline-block":
      return "In-bk";
    case "inline-grid":
      return "In-gr";
    case "inline-flex":
      return "In-fl";
    case "inline":
      return "Inline";
    case "none":
      return "None";
    default:
      console.error("Unkown display type: " + display);
  }
}

function getElementName(element) {
  return element.attr("id")[0].toUpperCase() + element.attr("id").slice(1);
}
/**
 *
 * @param {object} objects Dom elements to reset
 * @param {*} button Dom element to set as active
 * @param {*} type CSS property that identifies the button
 */
function handleDisplay(objects, button) {
  if (button && button.object) {
    button = button.object;
  }
  objects.removeClass("pressed-button");
  if (button.hasClass("menu-button")) {
    switch (button.attr("data-type")) {
      case "display-button":
        $("#other-display").attr("data-desc", button.attr("data-desc"));
        break;
      case "wrap-button":
        $("#wrap-text").text(button.text());
        $("#wrap").addClass("pressed-button");
        $("#wrap").attr("data-desc", button.attr("data-desc"));
        hideWrapOptions();
        break;
      default:
        console.error("Unkown button type: " + button.attr("data-type"));
        break;
    }
  }
  button.addClass("pressed-button");
}

function displaySelectedWrapOption(button) {
  if (button) {
    switch (button.attr("data-value")) {
      case "ltr-wrap-down":
        $("#ltr-wrap-down").addClass("pressed-button");
        $("#wrap-text").text("Wrap down");
        break;
      case "ltr-wrap-up":
        $("#ltr-wrap-up").addClass("pressed-button");
        $("#wrap-text").text("Wrap up");
        break;
      case "rtl-single-row":
        $("#rtl-single-row").addClass("pressed-button");
        $("#wrap-text").text("Single row");
        break;
      case "rtl-wrap-down":
        $("#rtl-wrap-down").addClass("pressed-button");
        $("#wrap-text").text("Wrap down");
        break;
      case "rtl-wrap-up":
        $("#rtl-wrap-up").addClass("pressed-button");
        $("#wrap-text").text("Wrap up");
        break;
      case "ttb-wrap-right":
        $("#ttb-wrap-right").addClass("pressed-button");
        $("#wrap-text").text("Wrap right");
        break;
      case "ttb-wrap-left":
        $("#ttb-wrap-left").addClass("pressed-button");
        $("#wrap-text").text("Wrap left");
        break;
      case "btt-single-column":
        $("#btt-single-column").addClass("pressed-button");
        $("#wrap-text").text("Single column");
        break;
      case "btt-wrap-right":
        $("#btt-wrap-right").addClass("pressed-button");
        $("#wrap-text").text("Wrap right");
        break;
      case "btt-wrap-left":
        $("#btt-wrap-left").addClass("pressed-button");
        $("#wrap-text").text("Wrap left");
        break;
      default:
        console.error("Unknown wrap id: " + id);
        break;
    }
  }
}

function resetAlingmentBox() {
  $("#align-box .button").each(function () {
    $(this).html('<rect class="rect"></rect>');
  });
}

/**
 * Extracts the unit of measure from the string ("12px" -> "px")
 * @param {string} string The string to extract from
 * @returns {string} The unit of measure
 */
function extractType(string) {
  let type = "";
  for (let i = 0; i < string.length; i++) {
    if (isNaN(parseInt(string[i], 10))) {
      type += string[i];
    }
  }
  return type;
}
/**
 * Extract the numbers from a string
 * @param {string} string The string to extract from
 * @returns The extracted numbers in a string
 */
function extractValue(string) {
  if (string === "auto") return "Auto";
  let value = "";
  for (let i = 0; i < string.length; i++) {
    if (!isNaN(parseInt(string[i], 10))) {
      value += string[i];
    }
  }
  return value;
}

/**
 *
 * @param {string} value Value of the place-content attribute
 * @returns Object of the separated values ({"align-content": "xXx", "justify-content": "xXx"})
 */
function extractPlaceContentValue(value) {
  let alighContent = "";
  let justifyContent = "";
  let trigger = false;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === " ") {
      trigger = true;
    } else if (!trigger) alighContent += value[i];
    else justifyContent += value[i];
  }
  return { "align-content": alighContent, "justify-content": justifyContent };
}

/**
 * Counts the rows or columns
 * @param {string} value grid-template-rows | grid-template-columns
 * @returns The number of rows or columns
 */
function countGridColsRows(value) {
  let count = 0;
  for (let index = 0; index < value.length; index++) {
    if (value[index] === " ") count++;
  }
  return count;
}

function checkPos(tglButton, menu) {
  let x = tglButton.offset()["left"],
    y = tglButton.offset()["top"],
    w = menu.outerWidth(),
    h = menu.outerHeight(),
    right = false,
    bot = false;
  if (x + w > window.innerWidth) {
    right = true;
  }
  if (y + h > window.innerHeight) {
    bot = true;
  }

  menu.css(bot ? { top: "", bottom: ".5rem" } : { top: y, bottom: "" });
  menu.css(right ? { left: "", right: ".5rem" } : { left: x, right: "" });
}
/**
 *
 * @param {string} value Value of the aspect-ratio css property (ex.:16 / 9)
 * @param {boolean} [name=true] Boolean to return name, if false, aspect-ratio in x-y format
 * @returns If [name] true, the name of the aspect-ratio, otherwise aspect-ratio in x-y format (ex.: 16-9)
 */
function extractRatio(value, name = true, separated = false) {
  let c = false;
  let a = "";
  let b = "";
  for (let i = 0; i < value.length; i++) {
    if (value[i] === " ") continue;
    if (value[i] === "/") {
      if (separated) {
        c = true;
        i += 1;
      } else {
        a += "-";
        i += 2;
      }
    }
    if (c) b += value[i];
    else a += value[i];
  }
  if (separated) {
    return value === "auto" ? { w: "1", h: "1" } : { w: a, h: b };
  }
  const ratioMap = {
    auto: "Auto",
    "2.39-1": "Anamorphic(2.39:1)",
    "2-1": "Univisum/Netflix(2:1)",
    "16-9": "Widescreen",
    "3-2": "Landscape",
    "2-3": "Portrait",
    "1-1": "Square",
  };
  if (ratioMap[a]) {
    return name ? ratioMap[a] : a;
  }
  return "Custom";
}
