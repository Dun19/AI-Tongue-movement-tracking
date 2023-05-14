import cv2
import model
import os


def video2img(path_in, path_out):
    cap = cv2.VideoCapture(path_in)
    width = model.to_nearest_32x_int(cap.get(3))
    height = model.to_nearest_32x_int(cap.get(4))
    frame_count = 0
    while cap.isOpened():
        success, frame = cap.read()
        if success is False:
            break
        frame = cv2.resize(frame, (width, height))
        frame_count = frame_count + 1

        path_out_img = os.path.join(path_out, str(frame_count)+'.jpg')
        cv2.imwrite(path_out_img, frame)
video2img(r'.\photos\raw_photos\練習四_舌頭向上_new.mp4',r'.\result')