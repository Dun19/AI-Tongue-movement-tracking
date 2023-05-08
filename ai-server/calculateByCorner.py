import numpy as np
import math

def calculate(left_corner: int,right_corner,tongue_tip):
    if left_corner is None or right_corner is None or tongue_tip is None:
        return
    left_corner_np = np.array(left_corner)
    right_corner_np = np.array(right_corner)
    mid_point_np = (left_corner_np+right_corner_np)/2
    tongue_tip_np = np.array(tongue_tip)

    length_left_tip = np.linalg.norm(left_corner_np - tongue_tip_np)
    length_left_mid_tip = np.linalg.norm(left_corner_np - mid_point_np)
    length_mid_tip = np.linalg.norm(mid_point_np - tongue_tip_np)
    angle_pi = np.arccos((length_left_mid_tip**2+length_mid_tip**2-length_left_tip**2 )/(2*length_left_mid_tip*length_mid_tip)) 
    angle= angle_pi * 180 / math.pi
    if angle <= 90:
        angle = 180 - angle
    
    return (length_mid_tip,angle)
def find_center_point_of_rectangle(top_left,top_right,bottom_left,bottom_right):
    pass
calculate([1,2],(10,0),(0,-100))