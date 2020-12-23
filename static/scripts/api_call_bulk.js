$(function () {
    $('button#input_area_submit').on('click', function () {
        $.ajax({
            type: 'POST',
            url: '/bulk',
            data: $('textarea#input_area').val(),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                document.getElementById('pred_container').innerHTML = '';
                $('#pred_container').text(data.forEach(function (e) {
                    var linebreak = document.createElement("br");
                    var newelem = document.createElement('span');
                    newelem.innerHTML = e;
                    document.getElementById('pred_container').appendChild(newelem);
                    document.getElementById('pred_container').appendChild(linebreak);
                }))
                return false;
            }
        });
    });
});

$(function () {
    $('button#file_submit').on('click', function () {
        var form_data = new FormData();
        form_data.append('file', $('input#file_area').prop('files')[0])
        $.ajax({
            type: 'POST',
            url: '/bulk',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                document.getElementById('pred_container').innerHTML = '';
                $('#pred_container').text(data.forEach(function (e) {
                    var linebreak = document.createElement("br");
                    var newelem = document.createElement('span');
                    newelem.innerHTML = e;
                    document.getElementById('pred_container').appendChild(newelem);
                    document.getElementById('pred_container').appendChild(linebreak);
                }))
                return false;
            }
        });
    });
});