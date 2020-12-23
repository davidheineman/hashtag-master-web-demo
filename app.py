from flask import Flask, jsonify, render_template, request, send_file
from execute import Segmenter
from config import get_server_config, get_max_content_length
import re

# Not sure if I need these
import os
from io import BytesIO, StringIO
import csv

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

@app.route('/bulk')
def bulk_index():
    return render_template('bulk.html')

@app.route('/bulk', methods=['POST'])
def bulk_predict():
    # With bulk predictions, would it be more efficient to evaluate them in batches?
    # From what I understand, only alphabet characters and numbers are allowed in a hashtag
    up_file = request.files.get('file')
    if up_file:
        file_ext = os.path.splitext(up_file.filename)[1]
        if file_ext.lower not in app.config['UPLOAD_EXTENSIONS']:
            return 'The file format is not accepted', 400
        elif file_ext.lower == '.csv':
            stream = StringIO(up_file.stream.read().decode("UTF8"), newline=None)
            csv_input = csv.reader(stream)
            output = []
            for row in csv_input:
                for val in row:
                    output.append(my_segmenter.evaluate(val))
            return jsonify(output)
        
        # return send_file(BytesIO(up_file.read()), attachment_filename='output.csv')
    # Should determine if textarea input is used
    elif True:
        input_data = re.sub('[^0-9a-zA-Z,]', '', request.get_data(as_text=True))
        print(input_data)
        output = []
        for val in input_data.split(","):
            if len(val) > 1:
                output.append(my_segmenter.evaluate(val))
            else:
                # Doesn't handle the case of a long hashtag
                output.append([val])
        return jsonify(output)
    else:
        return "Invalid input text", 400