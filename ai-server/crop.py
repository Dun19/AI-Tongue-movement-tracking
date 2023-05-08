from ultralytics import YOLO
import cv2
import numpy as np
from torchvision.utils import save_image
from PIL import Image
import math


def keep_image_size_open(path, size=(640, 640)):
    img = Image.open(path)
    temp = max(img.size)
    mask = Image.new('RGB', (temp, temp), (0, 0, 0))
    mask.paste(img, (0, 0))
    mask = mask.resize(size)
    return mask


def gamma_trans(img, gamma):
    gamma_table = [np.power(x / 255.0, gamma) * 255.0 for x in range(256)]
    gamma_table = np.round(np.array(gamma_table)).astype(np.uint8)
    return cv2.LUT(img, gamma_table)


file_path = r"C:\Users\youca\OneDrive\文件\Tecky_exercise\tecky-BAD-project\ai-server\photos\raw_photos\002.jpeg"
img_gray = cv2.imread(file_path, 0)   # 灰度图读取，用于计算gamma值
img = cv2.imread(file_path)    # 原图读取

mean = np.mean(img_gray)
gamma_val = math.log10(0.5)/math.log10(mean/255)    # 公式计算gamma

image_gamma_correct = gamma_trans(img, gamma_val)   # gamma变换



# print(mean,np.mean(image_gamma_correct))
cv2.imwrite("gamma_photos\gamma1.jpg", img)
# cv2.imshow('image_raw', img)
# cv2.imshow('image_gamma', image_gamma_correct)
# cv2.waitKey(0)


_input = r"gamma_photos\gamma1.jpg"
img = keep_image_size_open(_input)

model = YOLO("ai-server/Yolomodel/best.pt")

predict = model.predict(
    source=r"C:\Users\youca\Downloads\TeckyPJ3\gamma\gamma1.jpg", save=True, conf=0.90, save_txt=True)


mask_array = (predict[0].masks.data[0].numpy() * 255).astype("uint8")
cv2.imwrite("mask_image10.jpg", mask_array)
