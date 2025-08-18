/**
 *Show MENU
 * @param {string} ui The container of the menu
 * @param {string} menu The menu to be shown
 * @param {string} caller The button that called the function
 * @param {string} special CSS display value to be set if needed
 */
function showMenu(ui, menu, caller, special = "") {
  ui.show();
  if (special !== "") menu.css("display", special);
  else menu.show();
  checkPos(caller, menu);
}
/**
 * Hide MENU
 * @param {string} ui The container of the menu
 * @param {string} menu The menu to hid
 */
function hideMenu(ui, menu) {
  ui.hide();
  menu.hide();
}

function showAlignmentOptions(axis, button) {
  $("#alignment-ui-container").show();
  $("#alignment-options").css("display", "flex");
  $("#" + axis).show();
  checkPos(button, $("#" + axis));
}

function hideAlignmentOptions() {
  $("#alignment-ui-container").hide();
  $("#align-horizontal").hide();
  $("#align-vertical").hide();
}

function showSpacingSettings(value, button) {
  if (currentSpacing && currentSpacing.includes("padding")) {
    $("#spacing-auto").hide();
  } else {
    $("#spacing-auto").show();
  }
  $("#spacing-range").val(extractValue(value));
  $("#spacing-value").val(extractValue(value));
  if (value !== "auto" && value !== $("#spacing-type").attr("data-value")) {
    $("#spacing-type").attr("data-value", extractType(value));
    $("#spacing-type-text").text(extractType(value).toUpperCase());
  } else {
    $("#spacing-type").attr("data-value", "px");
    $("#spacing-type-text").text("PX");
  }
  $("#spacing-setting-ui").css("display", "flex");
  $("#spacing-ui-container").show();
  checkPos(button, $("#spacing-setting-ui"));
}

function hideSpacingSettings() {
  $("#spacing-setting-ui").hide();
  $("#spacing-ui-container").hide();
  currentSpacing = null;
  currentPosProp = null;
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
    case "type":
      if ($("#more-type-options").css("display") !== "none") {
        $("#more-type-options").hide();
      } else $("#more-type-options").css("display", "grid");
      break;
  }
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

function toggleFloatClear() {
  if ($("#float-clear").css("display") !== "none") $("#float-clear").hide();
  else $("#float-clear").css("display", "grid");
}

function showMoreLine(button) {
  $("#more-line").show();
  $("#inner-decor-ui-container").show();
  $("#more-line").css("background-color", "#444");
  checkPos(button, $("#more-line"));
}

function showLineStyle(button) {
  $("#inner-decor-ui-container").show();
  $("#decor-line-style").show();
  $("#decor-line-style").css("background-color", "#444");
  checkPos(button, $("#decor-line-style"));
}

function showTextColumnSettings(button) {
  $("#column-ui-container").show();
  $("#column-menu").css("display", "grid");
  console.log(selectedDomObject.parent().css("column-count"));
  if (
    selectedDomObject.parent().css("column-count") === "auto" ||
    selectedDomObject.parent().css("column-count") < 1
  ) {
    $("#column-child-container")
      .css("opacity", "0.7")
      .attr(
        "data-desc",
        "This element needs to be in a multy-column parent to span across columns."
      );
  } else {
    $("#column-child-container").css("opacity", "1").removeAttr("data-desc");
  }
  checkPos(button, $("#column-menu"));
}

//////////////////////////////////////////////
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
        hideMenu$($("#wrap-ui-container"), $("#wrap-options"));
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

function resetBox(value) {
  $("#" + value + "-box .button").each(function () {
    $(this).html('<div class="rect"></div>');
  });
}

/**
 * Extracts the unit of measure from the string ("12px" -> "px")
 * @param {string} string The string to extract from
 * @returns {string} The unit of measure
 */
function extractType(string) {
  if (string === "auto") return "";
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
  let x;
  if (menu.attr("id") !== "type-options")
    x = tglButton.parent().offset()["left"];
  else x = tglButton.offset()["left"];
  let y = tglButton.offset()["top"],
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
  if (value === "auto" && !name) return "auto";
  let c = false;
  let a = "";
  let b = "";
  for (let i = 0; i < value.length; i++) {
    if (value[i] === " ") i += 1;
    if (value[i] === ".") {
      a += "-";
      i += 1;
    }
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
    "2-39-1": "Anamorphic(2.39:1)",
    "2-1": "Univisum/Netflix(2:1)",
    "16-9": "Widescreen",
    "3-2": "Landscape",
    "2-3": "Portrait",
    "1-1": "Square",
  };
  if (ratioMap[a]) {
    return name ? ratioMap[a].trim() : a.trim();
  }
  return "Custom";
}

function changeSVG(type, value) {
  switch (type) {
    case "align":
      break;
    case "object-position":
      changeObjectPosSVG(value);
      break;
    default:
      console.error("Can't change svg for '", type, "'");
  }
}

function changeObjectPosSVG(value) {
  switch (value) {
    case "top-left":
      $("#object-position-top-left").html(
        '<svg data-wf-icon="TransformOriginTopLeftIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0001 7.50004C10.0001 8.32846 9.32853 9.00004 8.5001 9.00004C7.67167 9.00004 7.0001 8.32846 7.0001 7.50004C7.0001 6.67161 7.67167 6.00004 8.5001 6.00004C9.32853 6.00004 10.0001 6.67161 10.0001 7.50004Z" fill="currentColor"></path><path d="M8.5001 14.2071L11.3537 11.3536L10.6465 10.6465L8.5001 12.7929L6.35365 10.6465L5.64655 11.3536L8.5001 14.2071Z" fill="currentColor"></path><path d="M15.2072 7.50004L12.3537 4.64648L11.6465 5.35359L13.793 7.50004L11.6465 9.64648L12.3537 10.3536L15.2072 7.50004Z" fill="currentColor"></path></svg>'
      );
      break;
    case "top-center":
      $("#object-position-top-center").html(
        '<svg data-wf-icon="TransformOriginTopIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.79297 7.50004L4.64652 4.64648L5.35363 5.35359L3.20718 7.50004L5.35363 9.64648L4.64652 10.3536L1.79297 7.50004Z" fill="currentColor"></path><path d="M10.0001 7.50004C10.0001 8.32846 9.3285 9.00004 8.50008 9.00004C7.67165 9.00004 7.00008 8.32846 7.00008 7.50004C7.00008 6.67161 7.67165 6.00004 8.50008 6.00004C9.3285 6.00004 10.0001 6.67161 10.0001 7.50004Z" fill="currentColor"></path><path d="M8.50008 14.2071L11.3536 11.3536L10.6465 10.6465L8.50008 12.7929L6.35363 10.6465L5.64652 11.3536L8.50008 14.2071Z" fill="currentColor"></path><path d="M15.2072 7.50004L12.3536 4.64648L11.6465 5.35359L13.793 7.50004L11.6465 9.64648L12.3536 10.3536L15.2072 7.50004Z" fill="currentColor"></path></svg>'
      );
      break;
    case "top-right":
      $("#object-position-top-right").html(
        '<svg data-wf-icon="TransformOriginTopRightIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.79297 7.50004L4.64652 4.64648L5.35363 5.35359L3.20718 7.50004L5.35363 9.64648L4.64652 10.3536L1.79297 7.50004Z" fill="currentColor"></path><path d="M10.0001 7.50004C10.0001 8.32846 9.3285 9.00004 8.50008 9.00004C7.67165 9.00004 7.00008 8.32846 7.00008 7.50004C7.00008 6.67161 7.67165 6.00004 8.50008 6.00004C9.3285 6.00004 10.0001 6.67161 10.0001 7.50004Z" fill="currentColor"></path><path d="M8.50008 14.2071L11.3536 11.3536L10.6465 10.6465L8.50008 12.7929L6.35363 10.6465L5.64652 11.3536L8.50008 14.2071Z" fill="currentColor"></path></svg>'
      );
      break;
    case "left":
      $("#object-position-left").html(
        '<svg data-wf-icon="TransformOriginTopRightIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.79297 7.50004L4.64652 4.64648L5.35363 5.35359L3.20718 7.50004L5.35363 9.64648L4.64652 10.3536L1.79297 7.50004Z" fill="currentColor"></path><path d="M10.0001 7.50004C10.0001 8.32846 9.3285 9.00004 8.50008 9.00004C7.67165 9.00004 7.00008 8.32846 7.00008 7.50004C7.00008 6.67161 7.67165 6.00004 8.50008 6.00004C9.3285 6.00004 10.0001 6.67161 10.0001 7.50004Z" fill="currentColor"></path><path d="M8.50008 14.2071L11.3536 11.3536L10.6465 10.6465L8.50008 12.7929L6.35363 10.6465L5.64652 11.3536L8.50008 14.2071Z" fill="currentColor"></path></svg>'
      );
      break;
    case "center":
      $("#object-position-center").html(
        '<svg data-wf-icon="TransformOriginCenterIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.50008 0.792969L11.3536 3.64652L10.6465 4.35363L8.50008 2.20718L6.35363 4.35363L5.64652 3.64652L8.50008 0.792969Z" fill="currentColor"></path><path d="M1.79297 7.50008L4.64652 4.64652L5.35363 5.35363L3.20718 7.50008L5.35363 9.64652L4.64652 10.3536L1.79297 7.50008Z" fill="currentColor"></path><path d="M10.0001 7.50008C10.0001 8.3285 9.3285 9.00008 8.50008 9.00008C7.67165 9.00008 7.00008 8.3285 7.00008 7.50008C7.00008 6.67165 7.67165 6.00008 8.50008 6.00008C9.3285 6.00008 10.0001 6.67165 10.0001 7.50008Z" fill="currentColor"></path><path d="M8.50008 14.2072L11.3536 11.3536L10.6465 10.6465L8.50008 12.793L6.35363 10.6465L5.64652 11.3536L8.50008 14.2072Z" fill="currentColor"></path><path d="M15.2072 7.50008L12.3536 4.64652L11.6465 5.35363L13.793 7.50008L11.6465 9.64652L12.3536 10.3536L15.2072 7.50008Z" fill="currentColor"></path></svg>'
      );
      break;
    case "right":
      $("#object-position-right").html(
        '<svg data-wf-icon="TransformOriginRightIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.50008 0.792969L5.64652 3.64652L6.35363 4.35363L8.50008 2.20718L10.6465 4.35363L11.3536 3.64652L8.50008 0.792969Z" fill="currentColor"></path><path d="M1.79297 7.50008L4.64652 4.64652L5.35363 5.35363L3.20718 7.50008L5.35363 9.64652L4.64652 10.3536L1.79297 7.50008Z" fill="currentColor"></path><path d="M8.50008 9.00008C7.67165 9.00008 7.00008 8.3285 7.00008 7.50008C7.00008 6.67165 7.67165 6.00008 8.50008 6.00008C9.3285 6.00008 10.0001 6.67165 10.0001 7.50008C10.0001 8.3285 9.3285 9.00008 8.50008 9.00008Z" fill="currentColor"></path><path d="M8.50008 14.2072L5.64652 11.3536L6.35363 10.6465L8.50008 12.793L10.6465 10.6465L11.3536 11.3536L8.50008 14.2072Z" fill="currentColor"></path></svg>'
      );
      break;
    case "bottom-left":
      $("#object-position-bottom-left").html(
        '<svg data-wf-icon="TransformOriginBottomLeftIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.50004 0.792969L11.3536 3.64652L10.6465 4.35363L8.50004 2.20718L6.35359 4.35363L5.64648 3.64652L8.50004 0.792969Z" fill="currentColor"></path><path d="M15.2071 7.50008L12.3536 4.64652L11.6465 5.35363L13.7929 7.50008L11.6465 9.64652L12.3536 10.3536L15.2071 7.50008Z" fill="currentColor"></path><path d="M10 7.50008C10 8.3285 9.32846 9.00008 8.50004 9.00008C7.67161 9.00008 7.00004 8.3285 7.00004 7.50008C7.00004 6.67165 7.67161 6.00008 8.50004 6.00008C9.32846 6.00008 10 6.67165 10 7.50008Z" fill="currentColor"></path></svg>'
      );
      break;
    case "bottom-center":
      $("#object-position-bottom-center").html(
        '<svg data-wf-icon="TransformOriginBottomIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.50008 0.792969L11.3536 3.64652L10.6465 4.35363L8.50008 2.20718L6.35363 4.35363L5.64652 3.64652L8.50008 0.792969Z" fill="currentColor"></path><path d="M1.79297 7.50008L4.64652 4.64652L5.35363 5.35363L3.20718 7.50008L5.35363 9.64652L4.64652 10.3536L1.79297 7.50008Z" fill="currentColor"></path><path d="M10.0001 7.50008C10.0001 8.3285 9.3285 9.00008 8.50008 9.00008C7.67165 9.00008 7.00008 8.3285 7.00008 7.50008C7.00008 6.67165 7.67165 6.00008 8.50008 6.00008C9.3285 6.00008 10.0001 6.67165 10.0001 7.50008Z" fill="currentColor"></path><path d="M15.2072 7.50008L12.3536 4.64652L11.6465 5.35363L13.793 7.50008L11.6465 9.64652L12.3536 10.3536L15.2072 7.50008Z" fill="currentColor"></path></svg>'
      );
      break;
    case "bottom-right":
      $("#object-position-bottom-right").html(
        '<svg data-wf-icon="TransformOriginBottomRightIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.50008 0.792969L11.3536 3.64652L10.6465 4.35363L8.50008 2.20718L6.35363 4.35363L5.64652 3.64652L8.50008 0.792969Z" fill="currentColor"></path><path d="M1.79297 7.50008L4.64652 4.64652L5.35363 5.35363L3.20718 7.50008L5.35363 9.64652L4.64652 10.3536L1.79297 7.50008Z" fill="currentColor"></path><path d="M10.0001 7.50008C10.0001 8.3285 9.3285 9.00008 8.50008 9.00008C7.67165 9.00008 7.00008 8.3285 7.00008 7.50008C7.00008 6.67165 7.67165 6.00008 8.50008 6.00008C9.3285 6.00008 10.0001 6.67165 10.0001 7.50008Z" fill="currentColor"></path></svg>'
      );
      break;
  }
}

function getTextDecor(string) {
  switch (string) {
    case "underline overline":
      return { text: "Underline + overline", id: "uo" };
    case "underline line-through":
      return { text: "Underline + strikethrough", id: "ul" };
    case "overline line-through":
      return { text: "Overline + strikethrough", id: "ol" };
    case "underline overline line-through":
      return { text: "All", id: "all" };
    default:
      if (string === "line-through")
        return { text: "Strikethrough", id: string };
      return { text: string[0].toUpperCase() + string.slice(1), id: string };
  }
}

function getDecor(string) {
  let type = true,
    style = false,
    color = false;
  let lineType = "",
    lineStyle = "",
    lineColor = "";
  for (let i = 0; i < string.length; i++) {
    if (string[i] === " ") {
      if (
        string[i + 1] === "s" ||
        string[i + 1] === "d" ||
        string[i + 1] === "w"
      ) {
        style = true;
        type = false;
        color = false;
      } else if (string[i + 1] === "r") {
        color = true;
        type = false;
        style = false;
      }
      if (!type) continue;
    }
    if (type) lineType += string[i];
    else if (style) lineStyle += string[i];
    else lineColor += string[i];
  }
  return { type: lineType, style: lineStyle, color: lineColor };
}
/**
 *
 * @param {string} value
 * @returns The shadows in an array
 */
function extractTextShadows(value) {
  let shadows = [];
  let rgba = true;
  for (let i = 0, j = 0; i < value.length; i++) {
    if (value[i] === "r") rgba = true;
    if (value[i] === ")") rgba = false;
    if (value[i] === "," && !rgba) {
      j++;
      i++;
      if (value[i] === " ") continue;
    }
    if (shadows[j] === undefined) shadows[j] = "";
    shadows[j] += value[i];
  }
  return shadows;
}

function extractShadow(value) {
  let color = "";
  let pos = { x: "", y: "", blur: "" };
  let x = false,
    y = false,
    b = false;
  let c = true;
  for (let i = 0; i < value.length; i++) {
    if (c) color += value[i];
    if (!c) {
      if (x) {
        if (value[i] === " ") {
          x = false;
          y = true;
          continue;
        }
        pos["x"] += value[i];
      }
      if (y) {
        if (value[i] === " ") {
          y = false;
          b = true;
          continue;
        }
        pos["y"] += value[i];
      }
      if (b) {
        pos["blur"] += value[i];
      }
    }
    if (value[i] === ")" && c) {
      c = false;
      x = true;
      i++;
      continue;
    }
  }
  return { color: color, pos: pos };
}

function displayTextShadow(shadow, n) {
  let show = `<svg
            data-wf-icon="ShowIcon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 9.5C8.82843 9.5 9.5 8.82843 9.5 8C9.5 7.17157 8.82843 6.5 8 6.5C7.17157 6.5 6.5 7.17157 6.5 8C6.5 8.82843 7.17157 9.5 8 9.5Z"
              fill="currentColor"></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.00004 4C5.37598 4 3.11613 5.55492 2.08964 7.79148C2.02887 7.92388 2.02888 8.07621 2.08965 8.20861C3.11615 10.4451 5.37597 12 8.00001 12C10.6241 12 12.8839 10.4451 13.9104 8.20852C13.9712 8.07612 13.9712 7.92379 13.9104 7.79139C12.8839 5.55488 10.6241 4 8.00004 4ZM8.00001 11C5.86346 11 4.01048 9.78173 3.09961 8.00004C4.01047 6.21831 5.86347 5 8.00004 5C10.1366 5 11.9896 6.21827 12.9004 7.99996C11.9896 9.78169 10.1366 11 8.00001 11Z"
              fill="currentColor">
            </path>
          </svg>`;
  let hide = `<svg data-wf-icon="HideIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.705 11.4122L13.6464 14.3536L14.3535 13.6465L2.35353 1.64648L1.64642 2.35359L4.38807 5.09524C3.39352 5.76124 2.59317 6.69436 2.08962 7.79152C2.02885 7.92392 2.02885 8.07624 2.08962 8.20865C3.11613 10.4452 5.37595 12 7.99998 12C8.96537 12 9.88147 11.7896 10.705 11.4122ZM9.9407 10.6479L5.11149 5.81865C4.25762 6.3466 3.55885 7.10172 3.09959 8.00007C4.01046 9.78177 5.86344 11 7.99998 11C8.68305 11 9.33713 10.8755 9.9407 10.6479Z" fill="currentColor"></path><path d="M13.9104 8.20856C13.5777 8.93353 13.1153 9.58688 12.553 10.1389L11.846 9.43184C12.2702 9.01685 12.6276 8.5337 12.9004 8C11.9895 6.21831 10.1366 5.00004 8.00002 5.00004C7.81171 5.00004 7.62559 5.0095 7.44213 5.02798L6.57164 4.15749C7.03124 4.05443 7.50926 4.00004 8.00002 4.00004C10.6241 4.00004 12.8839 5.55491 13.9104 7.79143C13.9712 7.92383 13.9712 8.07616 13.9104 8.20856Z" fill="currentColor"></path></svg>`;
  let icon;
  try {
    const colorInfo = rgbaToHex(shadow.color);
    icon = colorInfo.alpha === 0 ? hide : show;
  } catch (e) {
    console.error("Hiba a szín elemzésekor:", e);
    icon = hide;
  }

  $("#text-shadows").append(
    `<div id="text-shadow-${n}" class="text-shadow" data-value="${shadow.color} ${shadow.pos.x} ${shadow.pos.y} ${shadow.pos.blur}">
      <div id="edit-text-shadow-${n}" class="text-shadow-color toggle">
        <div style="background-color: ${shadow.color};"></div>
      </div>
      <span>Shadow:
        <span class="text-shadow-value-text"
          >${shadow.pos.x} ${shadow.pos.y} ${shadow.pos.blur}</span>
        </span>
      <div class="tsh-actions">
        <span class="button hide" data-value="${n}">
          ${icon}
        </span>
        <span class="button remove" data-value="${n}">
          <svg
            data-wf-icon="DeleteIcon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7 2C6.44772 2 6 2.44772 6 3V4H3V5H4V11.5C4 12.3284 4.67157 13 5.5 13H11.5C12.3284 13 13 12.3284 13 11.5V5H14V4H11V3C11 2.44772 10.5523 2 10 2H7ZM10 4V3H7V4H10ZM5 11.5V5H12V11.5C12 11.7761 11.7761 12 11.5 12H5.5C5.22386 12 5 11.7761 5 11.5Z"
              fill="currentColor">
            </path>
          </svg>
        </span>
      </div>
    </div>`
  );
}
function removeTextShadow(value) {
  let current = extractTextShadows(selectedDomObject.css("text-shadow"));
  if (current.includes(value)) {
    let filtered = [];
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== value) {
        filtered.push(current[i]);
      }
    }
    setStyle("text-shadow", filtered.join(", "));
  }
}

function toggleTextShadow(value) {
  let current = extractTextShadows(selectedDomObject.css("text-shadow"));
  if (current.includes(value)) {
    for (let i = 0; i < current.length; i++) {
      if (current[i] === value) {
        let shadow = extractShadow(value);
        let newColor = rgbaToHex(shadow.color);
        newColor.alpha = newColor.alpha === 0 ? 100 : 0;
        shadow.color = hexToRgba(newColor.hex, newColor.alpha);
        current[i] =
          shadow.color +
          " " +
          shadow.pos.x +
          " " +
          shadow.pos.y +
          " " +
          shadow.pos.blur;
        value = current[i];
      }
    }
    setStyle("text-shadow", current.join(", "));
    return value;
  }
}

/* function editTextShadow(value, id) {
  editingTextShadow = true;
  let current = extractTextShadows(selectedDomObject.css("text-shadow"));
  if (current.includes(value)) {
    for (let i = 0; i < current.length; i++) {
      if (current[i] === value) {
        showMenu(
          $("#text-shadow-ui-container"),
          $("#text-shadow-menu"),
          $(`#${id}`),
          "grid"
        );
        let shadow = extractShadow(value);
        let color = rgbaToHex(shadow.color);
        $("#text-shadow-x").val(extractValue(shadow.pos.x));
        $("#text-shadow-y").val(extractValue(shadow.pos.y));
        $("#text-shadow-blur").val(extractValue(shadow.pos.blur));
        $("#text-shadow-x-value").val(extractValue(shadow.pos.x));
        $("#text-shadow-y-value").val(extractValue(shadow.pos.y));
        $("#text-shadow-blur-value").val(extractValue(shadow.pos.blur));
        $("#text-shadow-color").val(color.hex);
        $("#text-shadow-color-value").val(color.hex);
        $("#text-shadow-color-alpha").val(color.alpha);
        $("#text-shadow-color-alpha-value").val(color.alpha);
      }
    }
  }
  editingTextShadow = false;
} */
