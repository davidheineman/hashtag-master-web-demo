$("input").on('change blur mouseup focus keydown keyup', function (evt) {
  var $el = $(evt.target);
  //check if the carret can be hidden
  //AFAIK from the modern mainstream browsers
  //only Safari doesn't support caret-color
  if (!$el.css("caret-color")) return;
  var caretIndex = $el[0].selectionStart;
  var textBeforeCarret = $el.val().substring(0, caretIndex);

  var bgr = getBackgroundStyle($el, textBeforeCarret);
  $el.css("background", bgr);
  clearInterval(window.blinkInterval);
  window.blinkInterval = setInterval(blink, 600);
})

function blink() {
  $("input").each((index, el) => {
    var $el = $(el);
    if ($el.css("background-blend-mode") != "normal") {
      $el.css("background-blend-mode", "normal");
    } else {
      $el.css("background-blend-mode", "hue");
    }
  });
}

function getBackgroundStyle($el, text) {
  var fontSize = $el.css("font-size");
  var fontFamily = $el.css("font-family");

  var font = fontSize + " " + fontFamily;
  var canvas = $el.data("carretCanvas");
  //cache the canvas for performance reasons
  //it is a good idea to invalidate if the input size changes because of the browser text resize/zoom)
  if (canvas == null) {
    canvas = document.createElement("canvas");
    $el.data("carretCanvas", canvas);
    var ctx = canvas.getContext("2d");
    ctx.font = font;
    ctx.strokeStyle = $el.css("color");
    ctx.lineWidth = Math.ceil(parseInt(fontSize) / 5);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    //aproximate width of the caret
    ctx.lineTo(parseInt(fontSize) / 2, 0);
    ctx.stroke();
  }
  var offsetLeft = canvas.getContext("2d").measureText(text).width + parseInt($el.css("padding-left"));
  return "#efefef url(" + canvas.toDataURL() + ") no-repeat " +
    (offsetLeft - $el.scrollLeft()) + "px " +
    ($el.height() + parseInt($el.css("padding-top")) - 15) + "px";
}