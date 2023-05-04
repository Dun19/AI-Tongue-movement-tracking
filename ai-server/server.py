from sanic import Sanic
from sanic.response import json, text

app = Sanic("Tongue-Detection-Server")

@app.route("/",methods=['GET'])
def index_page(request):
    return text("Hello world1")

@app.route("/detect",methods=['POST'])
def detect(request):
    print(request)
    return json({'result':'TODO'})

app.run(port=8100,single_process=True)