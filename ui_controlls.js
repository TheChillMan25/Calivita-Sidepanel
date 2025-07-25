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

function showFlexGapOptions(type) {
  switch (type) {
    case "gap":
      $("#flex-gap-options").show();
      $("#flex-gap-ui-container").show();
      break;
    case "row-gap":
      $("#flex-row-gap-options").show();
      $("#flex-gap-ui-container").show();
      break;
    case "column-gap":
      $("#flex-column-gap-options").show();
      $("#flex-gap-ui-container").show();
      break;
  }
}

function hideFlexGapOptions() {
  $("#flex-gap-options").hide();
  $("#flex-gap-ui-container").hide();
  $("#flex-row-gap-options").hide();
  $("#flex-column-gap-options").hide();
}

function toggleFlexGapOptions() {
  if ($("#flex-gap-unlocked").css("display") !== "none") {
    $("#flex-gap-unlocked").hide();
    $("#flex-gap-default").show();
  } else {
    $("#flex-gap-unlocked").css("display", "flex");
    $("#flex-gap-default").hide();
  }
}

function checkForShowDisplaySettings(value) {
  if (value === "flex" || value === "inline-flex") {
    $("#flex-settings").css("display", "grid");
  } else if (value === "block" || value === "inline-block") {
    $("#flex-settings").css("display", "none");
  } else if (value === "grid" || value === "inline-grid") {
    $("#flex-settings").css("display", "none");
  } else if (value === "inline") {
    $("#flex-settings").css("display", "none");
  } else {
    $("#flex-settings").css("display", "none");
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
 * @param {*} objects Dom elements to reset
 * @param {*} button Dom element to set as active
 * @param {*} type CSS property that identifies the button
 */
function handleDisplay(objects, button, type) {
  if (button && button.object) {
    button = button.object;
  }
  objects.removeClass("pressed-button");
  switch (type) {
    case "display":
      selectedDisplayObject = button;
      break;
    case "direction":
      selectedDirectionObject = button;
      if ($("#wrap").hasClass("pressed-button")) {
        $("#wrap").removeClass("pressed-button");
      }
      break;
    case "wrap":
      selectedWrapObject = button;
      break;
    case "alignment":
      selectedAlignmentObject = button;
      resetAlingmentBox();
      selectedAlignmentObject.html(
        '<span class="material-symbols-outlined">align_justify_center</span>'
      );
      break;
    case "gap":
      selectedFlexGapObject = button;
      hideFlexGapOptions("gap");
      break;
    case "row-gap":
      selectedFlexRowGapObject = button;
      hideFlexGapOptions("row-gap");
      break;
    case "column-gap":
      selectedFlexColumnGapObject = button;
      hideFlexGapOptions("column-gap");
      break;
    default:
      console.error("Unkown case name: " + type);
      break;
  }
  if (button.hasClass("menu-button")) {
    switch (button.attr("type")) {
      case "display-button":
        $("#od-text").text(getDisplayName(selectedDisplayObject.attr("value")));
        $("#other-display").addClass("pressed-button");
        hideDisplayOptions();
        break;
      case "wrap-button":
        $("#wrap-text").text(selectedWrapObject.text());
        $("#wrap").addClass("pressed-button");
        hideWrapOptions();
        break;
      default:
        console.error("Unkown button type: " + button.attr("type"));
        break;
    }
  }
  button.addClass("pressed-button");
}

function displaySelectedWrapOption() {
  if (selectedWrapObject) {
    switch (selectedWrapObject.attr("value")) {
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
