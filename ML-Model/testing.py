import classify
import base64
import tkinter as tk
from tkinter import filedialog

root = tk.Tk()
root.withdraw()
imagePath = filedialog.askopenfilename(title="Choose a file",
    filetypes=[('all files', '.*'),
               ('image files', ('.png', '.jpg')),
           ])


result = classify.analyse(imagePath)

print(result)

