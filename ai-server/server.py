from sanic import Sanic
from sanic.response import json, text
import numpy as np
import model
import os
app = Sanic("Tongue-Detection-Server")


@app.route("/detect", methods=['POST'])
def detect(request):
    try:
        in_file_path = request.json['in_file_path']
        out_file_path = request.json['out_file_path']
        model.diagnose(in_file_path, out_file_path)
        return json({})
    except Exception as err:
        return json({'error': str(err)})


app.run(port=8100, single_process=True)
