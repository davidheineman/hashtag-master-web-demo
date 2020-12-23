const ALLOWED_CHARS = /[^0-9a-zA-Z,]+/;

$(function () {
    $('input#hashtag').on('keypress', event => {
        if (ALLOWED_CHARS.test(event.key)) {
            event.preventDefault();
        }
    });

    $('input#hashtag').on('input', function () {        
        if ($('input[name="hashtag"]').val().length < 2) {
            document.getElementById('pred_container').innerHTML = "";
            if ($('input[name="hashtag"]').val().length == 1) {
                var newelem = document.createElement('span');
                newelem.innerHTML = $('input[name="hashtag"]').val();
                newelem.className = 'prediction';
                document.getElementById('pred_container').appendChild(newelem);
            }
        } else {
            $.getJSON('/?hashtag=' + $('input[name="hashtag"]').val(),
                function (data) {
                    var coloridx = 0;
                    document.getElementById('pred_container').innerHTML = "";
                    $("#predhere").text(data.forEach(function (e) {
                        var linebreak = document.createElement("br");
                        var newelem = document.createElement('span');
                        newelem.innerHTML = e;
                        newelem.className = 'prediction';
                        newelem.style.color = 'rgb(' + coloridx + ' ' + coloridx + ' ' + coloridx + ')';
                        document.getElementById('pred_container').appendChild(newelem);
                        document.getElementById('pred_container').appendChild(linebreak);
                        coloridx += 26;
                    }));
                });
        }
        return false;
    });
});