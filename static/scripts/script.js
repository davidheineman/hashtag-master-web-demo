$("input#hashtag").on('change blur mouseup focus keydown keyup', function (evt) {
  var $el = $(evt.target);
  if (!$el.css("caret-color")) return;
  var caretIndex = $el[0].selectionStart;
  var textBeforeCarret = $el.val().substring(0, caretIndex);

  var bgr = getBackgroundStyle($el, textBeforeCarret);
  $el.css("background", bgr);
  clearInterval(window.blinkInterval);
  window.blinkInterval = setInterval(blink, 600);
})

function blink() {
  $("input#hashtag").each((index, el) => {
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
  if (canvas == null) {
    canvas = document.createElement("canvas");
    $el.data("carretCanvas", canvas);
    var ctx = canvas.getContext("2d");
    ctx.font = font;
    ctx.strokeStyle = $el.css("color");
    ctx.lineWidth = Math.ceil(parseInt(fontSize) / 5);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(parseInt(fontSize) / 2, 0);
    ctx.stroke();
  }
  var offsetLeft = canvas.getContext("2d").measureText(text).width + parseInt($el.css("padding-left"));
  return "#efefef url(" + canvas.toDataURL() + ") no-repeat " +
    (offsetLeft - $el.scrollLeft()) + "px " +
    ($el.height() + parseInt($el.css("padding-top")) - 15) + "px";
}

$("#more").on('click', function (evt) {
  var offset = 70;
  var el = document.querySelector('#about');
  window.scroll({ top: (el.offsetTop - offset), left: 0, behavior: 'smooth' });
});

var tweetConts = document.getElementsByClassName("tweet-contents");
var hashConts = document.getElementsByClassName("tweet-hashtags");
var segConts = document.getElementsByClassName("tweet-segmented");
var replayButton = document.getElementsByClassName("replay-button");

function animation() {
  var k = -1;
  for (var i = 0; i < hashConts.length; i++) {
    for (var j = 0; j < hashConts[i].children.length; j++) {
      k++;
      var currTweet = tweetConts[i].children[j];
      var currHash = hashConts[i].children[j];
      var currSeg = segConts[i].children[j];
      const tweetLoc = currTweet.getBoundingClientRect();
      const segLoc = currSeg.getBoundingClientRect();
      const hashLoc = currHash.getBoundingClientRect();
      var action = anime
        .timeline({
          easing: "easeInOutQuad"
        })
        .add({
          targets: [currHash, currSeg, replayButton],
          opacity: 0,
          delay: 0,
          duration: 100
        })
        .add({
          targets: currTweet,
          translateX: hashLoc.left - tweetLoc.left + 55,
          translateY: hashLoc.top - tweetLoc.top + 7,
          easing: "easeInOutQuad",
          delay: 300 * k,
          scale: 1.6
        })
        .add({
          targets: currTweet,
          opacity: 0,
          delay: 4000,
          duration: 1
        })
        .add({
          targets: currHash,
          opacity: 1,
          delay: 0,
          duration: 1
        })
        .add({
          targets: currHash,
          translateX: segLoc.left - hashLoc.left - 40,
          translateY: segLoc.top - hashLoc.top,
          easing: "easeInOutQuad",
          delay: 300
        })
        .add({
          targets: currHash,
          opacity: 0,
          delay: 2000 + 400 * k,
          duration: 1
        })
        .add({
          targets: currSeg,
          opacity: 1,
          delay: 0,
          duration: 1
        })
        .add({
          targets: [currHash, currTweet],
          translateX: 0,
          translateY: 0
        })
        .add({
          delay: 5000 - 700 * k,
          targets: [currHash, currTweet],
          opacity: 1
        })
        .add({
          delay: 2000,
          targets: replayButton,
          opacity: 1
        });
    }
  }
}

$("#replay").on("click", function (evt) {
  if ($(evt.target).parent().css("opacity") == 1) {
    animation();
  }
});

var ranAnime = false;
var observer = new IntersectionObserver(
  function (entries) {
    if (entries[0].isIntersecting === true && ranAnime === false) {
      animation();
      ranAnime = true;
    }
  }, { threshold: [0.5] }
);

observer.observe(document.querySelector("#about"));

'use strict';

;( function ( document, window, index )
{
	var inputs = document.querySelectorAll( '.inputfile' );
	Array.prototype.forEach.call( inputs, function( input )
	{
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e )
		{
			var fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();

			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
		});

		// Firefox bug fix
		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
	});
}( document, window, 0 ));


$(document).ready(function() {
  $(window).scroll(function () {
    if ($(window).scrollTop() > 20) {
      $('#navbar-sticky').addClass('navbar-sticky');
    }
    if ($(window).scrollTop() < 21) {
      $('#navbar-sticky').removeClass('navbar-sticky');
    }
  });
});