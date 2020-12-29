from flask import Flask, jsonify, render_template, request, send_file
from execute import Segmenter
from config import get_server_config, get_max_content_length
from io import StringIO
import flask_excel as excel
import re, os, csv

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = get_max_content_length()
app.config['UPLOAD_EXTENSIONS'] = ['.csv', '.tsv']

my_segmenter = Segmenter(get_server_config())

@app.errorhandler(413)
def too_large(e):
    return "File is too large", 413

@app.route('/')
def index():
    if request.args.get('hashtag', 0) != 0:
        input_data = re.sub('[^0-9a-zA-Z,]', '', request.args.get('hashtag')[:30])
        return jsonify(my_segmenter.evaluate(input_data))
    return render_template('main.html')

@app.route('/bulk', methods=['POST'])
def bulk_predict():
    up_file = request.files.get('file')
    if up_file:
        file_ext = os.path.splitext(up_file.filename)[1]
        if file_ext not in app.config['UPLOAD_EXTENSIONS']:
            return 'The file format is not accepted', 400
        stream = StringIO(up_file.stream.read().decode("UTF8"), newline=None)
        if file_ext == '.csv':
            csv_input = csv.reader(stream)
        elif file_ext == '.tsv':
            csv_input = csv.reader(stream, delimiter="\t")
        output = []
        for row in csv_input:
            for val in row:
                output.append(my_segmenter.evaluate(re.sub('[^0-9a-zA-Z,]', '', val)))
    else:
        input_data = re.sub('[^0-9a-zA-Z,]', '', request.get_data(as_text=True))
        output = []
        for val in input_data.split(","):
            if len(val) > 1:
                output.append(my_segmenter.evaluate(val))
            else:
                # Doesn't handle the case of a long hashtag
                output.append([val])
    excel.init_excel(app)
    return excel.make_response_from_array(output, file_type='csv', file_name='output')