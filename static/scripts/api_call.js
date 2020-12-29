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

    $('button#input_area_submit').on('click', function () {
        if (document.getElementById("file_area").files.length == 0) {
            $.ajax({
                type: 'POST',
                url: '/bulk',
                data: $('textarea#input_area').val(),
                contentType: 'text/csv',
                cache: false,
                processData: false,
                success: function(response) {
                    const blob = new Blob([response], {type: 'text/csv', encoding: 'UTF-8'});
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'output.csv';
                    link.click();
                }
            });
        } else {
            var form_data = new FormData();
            form_data.append('file', $('input#file_area').prop('files')[0])
            $.ajax({
                type: 'POST',
                url: '/bulk',
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                success: function(response) {
                    const blob = new Blob([response], {type: 'text/csv', encoding: 'UTF-8'});
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'output.csv';
                    link.click();
                }
            });
        }
    });
});