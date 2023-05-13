import cv2
import numpy as np
from scipy import stats
img = cv2.imread('tongue.jpeg')

gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
edges= cv2.Canny(gray,50,200,apertureSize=3)
minLineLength=1
maxLineGap=0


_, binary = cv2.threshold(
        gray, 10, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(
        binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

areas = [cv2.contourArea(c) for c in contours]
max_index = np.argmax(areas)
cnt = contours[max_index]

print(edges)
lines=cv2.HoughLinesP(edges,1,np.pi/180,50,minLineLength,maxLineGap)
x=[]
y=[]
for line in lines:
    [[x1,y1,x2,y2]]=line
    x.append(x1)
    x.append(x2)
    y.append(y1)
    y.append(y2)
    cv2.line(img,(x1,y1),(x2,y2),(0,255,0),2)

        
slope, intercept, r, p, std_err = stats.linregress(x, y)
def myfunc(x):
    return slope * x + intercept

y1=int(myfunc(x[0]))
y2=int(myfunc(x[1]))
print(y1,y2)
cv2.line(img,(x[0],y1),(x[1],y2),(255,0,0),2)
cv2.imshow('houghlines.jpg',img)
cv2.imshow('edges',edges)
cv2.waitKey(0)
cv2.destroyAllWindows()