import cv2
import math
import numpy as np
from ultralytics import YOLO
import mimetypes
import os
import math

def find_centroid_coordinate(cnt):
   
    M = cv2.moments(cnt, True)

    cx = int(M['m10']/M['m00'])
    cy = int(M['m01']/M['m00'])
    return (cx, cy)


def find_distance_of_two_points(point1, point2):
    sum = 0
    for i in range(len(point1)):
        sum = sum + (point1[i]-point2[i])**2
    return math.sqrt(sum)

def find_cnt(mask):
    _, binary = cv2.threshold(
        mask, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(
        binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    areas = [cv2.contourArea(c) for c in contours]
    max_index = np.argmax(areas)
    cnt = contours[max_index]
    return cnt

def line(x):
    m=0
    c=0
    y=m*x + c
    return y

def find_tongue_angle_and_length(tongue_mask,tip_mask,raw_file):
    raw = raw_file
    # raw = cv2.imread(raw_file)
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    #define contour and centroid
    cnt_tongue = find_cnt(tongue_mask)
    cnt_tip = find_cnt(tip_mask)
    cx_tongue,cy_tongue = find_centroid_coordinate(cnt_tongue)
    cx_tip,cy_tip = find_centroid_coordinate(cnt_tip)

    #define a line
    slope= min((cy_tip-cy_tongue)/(cx_tip-cx_tongue),2**31-1)
    c= cy_tongue-slope*cx_tongue


    root_distances=[]

    #find list of distance closer to the tip side
    for coordinates in cnt_tongue:
        [[x_tongue, y_tongue]]=coordinates

        y_line=slope*x_tongue+c

        distance_point_to_line=find_distance_of_two_points((x_tongue,y_tongue),(x_tongue,y_line))
        
        distance_point_to_tongue=find_distance_of_two_points((x_tongue,y_line),(cx_tongue,cy_tongue))
        distance_point_to_tip=find_distance_of_two_points((x_tongue,y_line),(cx_tip,cy_tip))

        if(distance_point_to_tip>distance_point_to_tongue):
            root_distances.append((distance_point_to_line,x_tongue,y_line,distance_point_to_tip))

    #find min distance
    if  root_distances[0] is None:
        return

    tongue_root = tuple(root_distances[0])
 
    for i in root_distances:
        if i[0]<tongue_root[0]:
            tongue_root=tuple(i)

    #drawing
    cv2.circle(raw, (int(cx_tip), int(cy_tip)), radius=0,
               color=(255, 0, 0), thickness=15)
    cv2.circle(raw, (int(tongue_root[1]), int(tongue_root[2])), radius=0,
               color=(255, 0, 0), thickness=15)
    cv2.line(raw, (int(cx_tip), int(cy_tip)),
             (int(tongue_root[1]), int(tongue_root[2])), (0, 0, 255), 3)
    
    theta = math.atan(slope)*180/math.pi
    
    if (cy_tip-tongue_root[2])>0 and theta<0:
        theta = theta+180
    elif (cy_tip-tongue_root[2])<0 and theta>0:
        theta = theta-180
    theta_adjusted=theta+90
    length = tongue_root[3]
    return (raw,theta_adjusted,length)




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
    
    

    if is_image(path_in):
        predict = model.predict(source=path_in, save=False, conf=0.90, save_txt=False)
        if predict[0].masks is None or predict[0].masks is None:
            return
        img_unit8  = (predict[0].masks.data[0].numpy() * 255).astype("uint8")
        img_raw,_,_ = find_tongue_angle_and_length(img_unit8,img_unit8)
        path_out_img = os.path.join(path_out,str(file_index)+'.jpg')
        cv2.imwrite(path_out_img,img_raw)
    elif is_video(path_in):
        frame_count = 0 
        frame_index = 0 
        interval=1
        cap = cv2.VideoCapture(path_in)

        fourcc = cv2.VideoWriter_fourcc(*'DIVX')
        path_out_video = os.path.join(path_out,'result.avi')
        out = cv2.VideoWriter(path_out_video, fourcc, 23, (640,  480))

        while cap.isOpened():
            success, frame = cap.read()
            if success is False:
                break
            if frame_index % interval == 0:
                predict = model.predict(source=frame, save=False, conf=0.90, save_txt=False)
                if predict[0].masks is None or predict[0].masks is None :
                    break
                tongue_unit8  = (predict[0].masks.data[0].numpy() * 255).astype("uint8")
                tip_unit8  = (predict[0].masks.data[0].numpy() * 255).astype("uint8")
                img_raw,angle,length = find_tongue_angle_and_length(tongue_mask = tongue_unit8,tip_mask = tip_unit8,raw_file =tongue_unit8)
                path_out_img = os.path.join(path_out,str(frame_count)+'.jpg')
                cv2.imwrite(path_out_img,img_raw)
                frame_count = frame_count +1
            frame_index += 1
        pass

# main(r'.\photos\raw_photos\練習一_舌頭向前_new.mp4',r'.\result1')

