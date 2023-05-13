import cv2
import math
import numpy as np
from ultralytics import YOLO
import mimetypes
import os


def find_center_and_contour(gray: cv2.Mat):
    _, img_binary = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(
        img_binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
    areas = [cv2.contourArea(c) for c in contours]
    max_index = np.argmax(areas)
    cnt = contours[max_index]
    M = cv2.moments(cnt, True)

    cx = int(M['m10']/M['m00'])
    cy = int(M['m01']/M['m00'])
    return (cx, cy,cnt)

def distance_square_of_two_points(point1, point2):
    sum = 0
    for i in range(len(point1)):
        sum = sum + (point1[i]-point2[i])**2
    return sum

def find_distance_of_two_points(point1, point2):
    sum = 0
    for i in range(len(point1)):
        sum = sum + (point1[i]-point2[i])**2
    return math.sqrt(sum)


def gamma_trans(img, gamma):  
    gamma_table = [np.power(x / 255.0, gamma) * 255.0 for x in range(256)]  
    gamma_table = np.round(np.array(gamma_table)).astype(np.uint8)  
    return cv2.LUT(img, gamma_table)  
 

def apply_gamma_to_image(file_path):
    img_gray=cv2.imread(file_path,0)  
    img = cv2.imread(file_path)    
    
    mean = np.mean(img_gray)
    gamma_val = math.log10(0.5)/math.log10(mean*255)    
    
    image_gamma_correct = gamma_trans(img, gamma_val)  
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
    
def find_box_center_and_xxyy(xxyy):
    [x1,y1,x2,y2]=xxyy
    cx=(x1+x2)/2
    cy=(y1+y2)/2
    return ((cx,cy),(x1,y1,x2,y2))

def find_root_and_lip_size(xxyy):
    ((cx,_),(x1,_,x2,y2))=find_box_center_and_xxyy(xxyy)
    root_cx=cx
    root_cy=y2
    lip_size = x2-x1
    return (root_cx,root_cy,lip_size)

def to_nearest_32x_int(number):
    
    if number % 32 == 0:
        return int(number)
    adj_number=0
    number_floor = math.floor(number/32)
    float=number/32-number_floor
    if float >=0.5:
        adj_number=(number_floor+1)*32
    else:
        adj_number=(number_floor)*32
    return int(adj_number)

def find_point_on_a_line_closet_to_contour_and_opposite_to_another_point(tongue_contour,slope,c,root_cx,root_cy,tongue_cx,tongue_cy):
    tip_distances=[]
    for coordinates in tongue_contour:
        [[tongue_x, tongue_y]]=coordinates

        y_line=slope*tongue_x+c
        distance_square_point_to_root=distance_square_of_two_points((tongue_x,tongue_y),(root_cx,root_cy))
        distance_square_point_to_tongue=distance_square_of_two_points((tongue_x,tongue_y),(tongue_cx,tongue_cy))
        distance_square_point_to_line=distance_square_of_two_points((tongue_x,tongue_y),(tongue_x,y_line))
        if(distance_square_point_to_tongue<distance_square_point_to_root):
            tip_distances.append(((tongue_x,tongue_y),distance_square_point_to_root,distance_square_point_to_line))
    
    #find min distance
    if len(tip_distances)<=0:
        return

    tongue_tip = tuple(tip_distances[0])
    for i in tip_distances:
        if i[2]<tongue_tip[2]:
            tongue_tip=tuple(i)
    tongue_length=math.sqrt(tongue_tip[1])
    return (tongue_length,tongue_tip[0][0],tongue_tip[0][1])

def predict_AI(model,src,width,height):
    predict = model.predict(source=src, save=True, conf=0.75, save_txt=False,imgsz=(width,height))
    pred_plotted = predict[0].plot(pil=True)
    
    #assign detected items to a label object
    names=model.names
    labels={}
    if predict[0].masks is None:
        return
    no_of_label = len(predict[0].masks.data)
    for i in range(no_of_label):
        try:
            if labels[names[int(predict[0].boxes.cls[i])]] is None:
                labels[names[int(predict[0].boxes.cls[i])]]=i
            elif predict[0].boxes.conf[i]>=predict[0].boxes.conf[labels[names[int(predict[0].boxes.cls[i])]]]:
                labels[names[int(predict[0].boxes.cls[i])]]=i
        except KeyError:
            labels[names[int(predict[0].boxes.cls[i])]]=i

    #if tongue is not detected
    if not 'tongue' in labels.keys():
        return
    ((tongue_box_cx,tongue_box_cy),(tongue_box_x1,tongue_box_y1,tongue_box_x2,tongue_box_y2))=find_box_center_and_xxyy(predict[0].boxes.xyxy[labels['tongue']])
    [tongue_box_x1,tongue_box_y1,tongue_box_x2,tongue_box_y2]=predict[0].boxes.xyxy[labels['tongue']]

    root_cx=0
    root_cy=0
    lip_size=0

    tongue_mask  = (predict[0].masks.data[labels['tongue']].numpy() * 255).astype("uint8")
    tongue_cx,tongue_cy,tongue_contour=find_center_and_contour(tongue_mask)
    
    #if tongue point downward
    if tongue_cy < tongue_box_cy:
        if not 'upperlip' in labels.keys():
            return
        (root_cx,root_cy,lip_size)=find_root_and_lip_size(predict[0].boxes.xyxy[labels['upperlip']])

    #if tongue point upward
    if tongue_cy >= tongue_box_cy:
        if not 'lowerlip' in labels.keys():
            return
        (root_cx,_,lip_size)=find_root_and_lip_size(predict[0].boxes.xyxy[labels['lowerlip']])
        root_cy=tongue_box_y2
    
    #find line between root and tongue center
    temp= tongue_cx-root_cx
    if temp==0:
        temp=0.0001
    slope=(tongue_cy-root_cy)/temp
    c=root_cy-slope*root_cx


    theta = math.atan(slope)*180/math.pi

    if (tongue_cy-root_cy)>0 and theta<0:
        theta = theta+180
    elif (tongue_cy-root_cy)<0 and theta>0:
        theta = theta-180

    theta_adjusted=theta+90

    #find tongue tip which is a point in the contour closest to the tongue line, 
    # while distance to the tongue central is larger than to the tongue root

    (tongue_length,tongue_tip_cx,tongue_tip_cy)=find_point_on_a_line_closet_to_contour_and_opposite_to_another_point(tongue_contour,slope,c,root_cx,root_cy,tongue_cx,tongue_cy)
    relative_length = tongue_length/lip_size
    

    # cv2.circle(pred_plotted, (int(root_cx), int(root_cy)), radius=0,color=(0, 255, 0), thickness=10)
    # cv2.circle(pred_plotted, (int(tongue_box_cx), int(tongue_box_cy)), radius=0,color=(0, 0, 255), thickness=10)
    cv2.circle(pred_plotted, (int(tongue_cx), int(tongue_cy)), radius=0,color=(255, 0, 0), thickness=5)
    # cv2.drawContours(pred_plotted,tongue_contour,-1,(0,0,255),2,5)
    cv2.circle(pred_plotted, (int(tongue_tip_cx), int(tongue_tip_cy)), radius=0,color=(255, 0, 0), thickness=5)
    cv2.line(pred_plotted, (int(root_cx), int(tongue_box_y1)),(int(root_cx), int(tongue_box_y2)), (0, 255, 0), 2)
    cv2.line(pred_plotted, (int(root_cx), int(root_cy)),(int(tongue_tip_cx), int(tongue_tip_cy)), (255, 0, 0), 2)
 
    cv2.putText(pred_plotted,f"angel:{theta_adjusted}",(30,height-50),cv2.FONT_HERSHEY_SIMPLEX,1,(200,0,200),2,cv2.LINE_AA)
    cv2.putText(pred_plotted,f"tongue length in pixel unit:{tongue_length}",(30,height-30),cv2.FONT_HERSHEY_SIMPLEX,1,(200,0,200),2,cv2.LINE_AA) 
    cv2.putText(pred_plotted,f"relative length to lip:{relative_length}",(30,height-10),cv2.FONT_HERSHEY_SIMPLEX,1,(200,0,200),2,cv2.LINE_AA) 

    return pred_plotted

def main (path_in,path_out):
    model = YOLO("yolomodel/bestforlip.pt")


    if is_image(path_in):
        img = cv2.imread(path_in)
        width = to_nearest_32x_int(img.shape[0])
        height = to_nearest_32x_int(img.shape[1])
        pred_plotted=predict_AI(model,path_in,width,height)
        if pred_plotted is None:
            return

        path_out_img = os.path.join(path_out,str(1)+'.jpg')
        print(path_out_img)
        cv2.imwrite(path_out_img,pred_plotted)
                
    elif is_video(path_in):
        starttime=time.process_time()
        frame_count = 0 
        frame_index = 0 
        interval=10
        fourcc = cv2.VideoWriter_fourcc(*'DIVX')
        path_out_video = os.path.join(path_out,'result.avi')
        

        cap = cv2.VideoCapture(path_in)
        width=to_nearest_32x_int(cap.get(3))
        height=to_nearest_32x_int(cap.get(4))
        out = cv2.VideoWriter(path_out_video, fourcc, 23, (width, height ))
        
        while cap.isOpened():

            success, frame = cap.read()
            
            if success is False:
                break
            if frame_index % interval == 0:
                pred_plotted = predict_AI(model,frame,width,height)
                if pred_plotted is None:
                    frame_index += 1
                    continue
               
                path_out_img = os.path.join(path_out,str(frame_count)+'.jpg')
                
                # cv2.imwrite(path_out_img,pred_plotted)
                frame_count = frame_count +1
                out.write(pred_plotted)
                print(time.process_time()-starttime)
            
            frame_index+=1

        pass

# main(r'.\photos\raw_photos\練習五_舌頭向下_new.mp4',r'.\tipup')
main(r'.\photos\raw_photos\練習四_舌頭向上_new.mp4',r'.\tipup-test')
# out.release()
# cap.release()
# cv2.destroyAllWindows()
