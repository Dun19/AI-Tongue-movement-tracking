import cv2
import math
import numpy as np

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


def find_tongue_angle_and_length(img):
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(
        gray, 10, 255, cv2.THRESH_BINARY)
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
    cv2.drawContours(img, [cnt], 0, (255, 0, 0), 2)
    cv2.line(img, (int(x1), int(y1)),
             (int(x2), int(y2)), (0, 0, 255), 3)
    cv2.ellipse(img, ellipse, (0, 255, 0), 2)
    cv2.circle(img, (int(x1), int(y1)), radius=0,
               color=(0, 0, 255), thickness=15)
    cv2.circle(img, (int(x2), int(y2)), radius=0,
               color=(255, 0, 0), thickness=15)
    

    return (img,angle, find_distance_of_two_points((x1, y1), (x2, y2)))


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


# cap = cv2.VideoCapture('./photos/raw_photos/練習一_舌頭向前_new.mp4')
# while True:
#     ret, frame = cap.read()
#     # if frame is read correctly ret is True
#     if not ret:
#         print("Can't receive frame (stream end?). Exiting ...")
#         break
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     cv2.imshow('frame', gray)

# cv2.waitKey(0)
# # cv2.imshow('image_raw', img)
# # cv2.imshow('image_gamma', image_gamma_correct)
# # cv2.waitKey(0)
# cap.release()
# cv2.destroyAllWindows()

def video_to_image(path,interval):
    fourcc = cv2.VideoWriter_fourcc(*'DIVX')
    out = cv2.VideoWriter('output.avi', fourcc, 20.0, (640,  480))
    frame_count = 0 
    frame_index = 0 

    cap = cv2.VideoCapture(path)

    if cap.isOpened():
        success = True
    else:
        success = False

    while cap.isOpened():
        success, frame = cap.read()
        if success is False:
            break
        if frame_index % interval == 0:
            img,_,_ = find_tongue_angle_and_length(frame)
            img1 = cv2.flip(img, 0)
            out.write(img1)
            frame_count = frame_count +1
        frame_index += 1
    # cap.release()
    # out.release()
    # cv2.destroyAllWindows()

video_to_image('./photos/raw_photos/練習一_舌頭向前_new.mp4',3)
