from sanic import Sanic
from sanic.response import json, text
import numpy as np
import model
import os
app = Sanic("Tongue-Detection-Server")


@app.route("/detect", methods=['POST'])
def detect(request):

    filename = request.json['filename']

    filePath = os.path.join('..', 'web-server', 'uploads', str(filename))

    filename_result = model.diagnose(filePath, r'..\web-server\result')
    mimetype = ''
    if model.is_video(filename_result):
        mimetype = 'video'
    if model.is_image(filename_result):
        mimetype = 'image'

    # filename_result = os.path.join('..', 'ai-server', str(filename_result)) 1

    return json({'result_path': filename_result, 'mimetype': mimetype})


app.run(port=8100, single_process=True)
