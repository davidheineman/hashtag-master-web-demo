from flask import Flask, jsonify, render_template, request
from execute import segmenter
app = Flask(__name__)

mySegmenter = segmenter('mse_multi',
                        'static/trained_models/',
                        'static/data/small_gt.bin',
                        10)

@app.route('/', methods=['POST', 'GET'])
def predict():
    if (request.args.get('hashtag', 0) != 0):
        inputdata = request.args.get('hashtag')[:30]
        return jsonify(mySegmenter.evaluate(inputdata))

    return render_template('main.html')