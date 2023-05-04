from sanic import Sanic
from sanic.response import json, text
import cv2



app = Sanic("Tongue-Detection-Server")

@app.route("/",methods=['GET'])
def index_page(request):
    return text("Hello world1")

@app.route("/detect",methods=['POST'])
def detect(request):
    print(request.json)
    filename = request.json['filename']
    filePath = '../web-server/uploads/'+str(filename)
    img = cv2.imread(filePath)

    return json({'result':"todo"})

app.run(port=8100,single_process=True)

