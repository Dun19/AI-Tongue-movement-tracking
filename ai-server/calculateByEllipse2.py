import cv2
import math
import numpy as np
from ultralytics import YOLO
import mimetypes
import os

def find_center_point(img: cv2.Mat):
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    _, img_binary = cv2.threshold(img_gray, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(
        img_binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cnt = contours[0]
    M = cv2.moments(cnt, True)

    cx = int(M['m10']/M['m00'])
    cy = int(M['m01']/M['m00'])
    return (cx, cy)


def find_distance_of_two_points(point1, point2):
    sum = 0
    for i in range(len(point1)):
        sum = sum + (point1[i]-point2[i])**2

    return math.sqrt(sum)


def find_tongue_angle_and_length(mask,raw_file):
    raw = raw_file
    # raw = cv2.imread(raw_file)
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(
        mask, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(
        binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    areas = [cv2.contourArea(c) for c in contours]
    max_index = np.argmax(areas)
    cnt = contours[max_index]

    # fit rectangle
    # rect = cv2.minAreaRect(cnt)
    # box = cv2.boxPoints(rect)
    # box = np.intp(box)

    ellipse = cv2.fitEllipse(cnt)
    (xc, yc), (d1, d2), angle = ellipse

    r_major = max(d1, d2)/2
    # if angle > 90:
    #     angle = 180 - angle

    if angle > 90:
        angle = angle - 90
    else:
        angle = angle + 90

    # tongue tip coordinate
    x1 = xc + math.cos(math.radians(angle))*r_major
    y1 = yc + math.sin(math.radians(angle))*r_major
    # tongue root coordinate
    x2 = xc + math.cos(math.radians(angle+180))*r_major*0.63
    y2 = yc + math.sin(math.radians(angle+180))*r_major*0.63

    # fit rectangle
    # rows, cols = tongue_bgr.shape[:2]
    # rect = cv2.minAreaRect(cnt)
    # box = cv2.boxPoints(rect)
    # box = np.intp(box)

    # draw shape
    # cv2.drawContours(tongue_bgr, [box], 0, (0, 0, 255), 2)
    
    cv2.drawContours(raw, [cnt], 0, (255, 0, 0), 2)
    cv2.line(raw, (int(x1), int(y1)),
             (int(x2), int(y2)), (0, 0, 255), 3)
    cv2.ellipse(raw, ellipse, (0, 255, 0), 2)
    cv2.circle(raw, (int(x1), int(y1)), radius=0,
               color=(0, 0, 255), thickness=15)
    cv2.circle(raw, (int(x2), int(y2)), radius=0,
               color=(255, 0, 0), thickness=15)
    

    return (raw,angle, find_distance_of_two_points((x1, y1), (x2, y2)))


# angle, distance = find_tongue_angle_and_length('tongue.jpg')
# angle1, distance1 = find_tongue_angle_and_length('tongue1.jpeg')
# print(angle-90,distance)
# print(angle1-90,distance1)


def gamma_trans(img, gamma):  # gamma函数处理
    gamma_table = [np.power(x / 255.0, gamma) * 255.0 for x in range(256)]  # 建立映射表
    gamma_table = np.round(np.array(gamma_table)).astype(np.uint8)  # 颜色值为整数
    return cv2.LUT(img, gamma_table)  # 图片颜色查表。另外可以根据光强（颜色）均匀化原则设计自适应算法。
 

def apply_gamma_to_image(file_path):
    img_gray=cv2.imread(file_path,0)   # 灰度图读取，用于计算gamma值
    img = cv2.imread(file_path)    # 原图读取
    
    mean = np.mean(img_gray)
    gamma_val = math.log10(0.5)/math.log10(mean*255)    # 公式计算gamma
    
    image_gamma_correct = gamma_trans(img, gamma_val)   # gamma变换
    return image_gamma_correct


def video_to_image_find_tongue_angle_and_length(path,interval):
    fourcc = cv2.VideoWriter_fourcc(*'DIVX')
    out = cv2.VideoWriter('output.avi', fourcc, 20, (640,  480))
    
    frame_count = 0 
    frame_index = 0 

    cap = cv2.VideoCapture(path)

    while cap.isOpened():
        success, frame = cap.read()
        if success is False:
            break
        if frame_index % interval == 0:
            img,_,_ = find_tongue_angle_and_length(frame)
            img = cv2.resize(img, (640, 480))
            
            out.write(img)
            frame_count = frame_count +1
        frame_index += 1
    pass



def is_image(path):
    if mimetypes.guess_type(path)[0].startswith('image'):
        return True
    else:
        return False

def is_video(path):
    if mimetypes.guess_type(path)[0].startswith('video'):
        return True
    else:
        return False
file_index=0

def main (path_in,path_out):
    model = YOLO("yolomodel/best.pt")
    # predict = model.predict(
    # source=path_in, save=False, conf=0.90, save_txt=True,vid_stride=30)
    interval=1
    fourcc = cv2.VideoWriter_fourcc(*'DIVX')
    path_out_video = os.path.join(path_out,'result.avi')
    out = cv2.VideoWriter(path_out_video, fourcc, 23, (640,  480))

    if is_image(path_in):
        img_unit8  = (predict[0].masks.data[0].numpy() * 255).astype("uint8")
        img_raw,_,_ = find_tongue_angle_and_length(img_unit8,img_unit8)
        path_out_img = os.path.join(path_out,str(file_index)+'.jpg')
        cv2.imwrite(path_out_img,img_raw)
    elif is_video(path_in):
        frame_count = 0 
        frame_index = 0 
        
        cap = cv2.VideoCapture(path_in)

        while cap.isOpened():
            success, frame = cap.read()
            if success is False:
                break
            if frame_index % interval == 0:
                print(frame)
                predict = model.predict(source=frame, save=False, conf=0.90, save_txt=False)
                if predict[0].masks is not None:
                    img_unit8  = (predict[0].masks.data[0].numpy() * 255).astype("uint8")
                    img,_,_ = find_tongue_angle_and_length(img_unit8,img_unit8)
                    path_out_img = os.path.join(path_out,str(frame_count)+'.jpg')
                    cv2.imwrite(path_out_img,img)
                    frame_count = frame_count +1
            frame_index += 1
        pass

main(r'.\photos\raw_photos\練習一_舌頭向前_new.mp4',r'.\result1')

# out.release()
# cap.release()
# cv2.destroyAllWindows()
