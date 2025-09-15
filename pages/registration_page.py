# pages/registration_page.py

import customtkinter as ctk
from tkinter import messagebox
from PIL import Image
import cv2
import time
import face_recognition
from .gui_components import BasePage, FONT_FAMILY, CARD_COLOR

class RegisterStudentPage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.grid_rowconfigure(1, weight=1); self.grid_columnconfigure(1, weight=1) 
        
        header_frame = ctk.CTkFrame(self, fg_color="transparent")
        header_frame.grid(row=0, column=0, columnspan=2, pady=20, padx=40, sticky="ew")
        ctk.CTkLabel(header_frame, text="Register New Student", font=ctk.CTkFont(family=FONT_FAMILY, size=24, weight="bold")).pack(side="left")
        
        # --- This button now calls the smart _go_back method ---
        ctk.CTkButton(header_frame, text="< Back to Dashboard", command=self._go_back).pack(side="right")

        form_frame = ctk.CTkFrame(self, width=350, fg_color="transparent"); form_frame.grid(row=1, column=0, padx=(40, 20), pady=10, sticky="nsew"); form_frame.grid_propagate(False)
        form_card = ctk.CTkFrame(form_frame, fg_color=CARD_COLOR); form_card.pack(fill="both", expand=True)
        ctk.CTkLabel(form_card, text="Student Details", font=ctk.CTkFont(size=18, weight="bold")).pack(pady=20, padx=20, anchor="w")
        self.name_entry = ctk.CTkEntry(form_card, placeholder_text="Student Name"); self.name_entry.pack(pady=10, padx=20, fill="x")
        self.id_entry = ctk.CTkEntry(form_card, placeholder_text="Student ID"); self.id_entry.pack(pady=10, padx=20, fill="x")
        self.dept_menu = ctk.CTkOptionMenu(form_card, values=["Computer science", "Information technology", "AI and DS"]); self.dept_menu.pack(pady=10, padx=20, fill="x")
        self.year_menu = ctk.CTkOptionMenu(form_card, values=["1", "2", "3", "4"]); self.year_menu.pack(pady=10, padx=20, fill="x")
        btn_frame = ctk.CTkFrame(form_card, fg_color="transparent"); btn_frame.pack(pady=20, padx=20, fill="x", side="bottom")
        ctk.CTkButton(btn_frame, text="Start Capture", command=self.start_capture, height=40).pack(pady=5, fill="x")
        ctk.CTkButton(btn_frame, text="Register Student", command=self.register_final, height=40).pack(pady=5, fill="x")
        video_frame = ctk.CTkFrame(self, fg_color="transparent"); video_frame.grid(row=1, column=1, padx=(0, 40), pady=10, sticky="nsew")
        self.video_label = ctk.CTkLabel(video_frame, text="", fg_color=CARD_COLOR); self.video_label.pack(fill="both", expand=True)
        self.progress_bar = ctk.CTkProgressBar(video_frame); self.progress_bar.pack(pady=10, fill="x")
        self.progress_label = ctk.CTkLabel(video_frame, text="Fill details on the left and press 'Start Capture'."); self.progress_label.pack()
    
    def _go_back(self):
        destination = "TeacherDashboard" if self.controller.current_user_role == "teacher" else "StudentDashboard"
        self.controller.show_frame(destination)

    def start_capture(self):
        if not all([self.name_entry.get(), self.id_entry.get()]): messagebox.showerror("Error", "Please fill Name and ID before capturing."); return
        self.controller.cap = cv2.VideoCapture(0); self.capture_start_time = None; self.update_feed()
    def update_feed(self):
        if not self.controller.cap or not self.controller.cap.isOpened(): return
        ret, frame = self.controller.cap.read()
        if ret:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face_locations = self.controller.get_face_rec()._get_face_locations(rgb_frame)
            if face_locations:
                if self.capture_start_time is None: self.capture_start_time = time.time()
                elapsed = time.time() - self.capture_start_time; progress = min(int((elapsed / 5) * 100), 100)
                self.progress_bar.set(progress / 100); self.progress_label.configure(text=f"Face detected. Hold still... {progress}%")
                top, r, bot, l = face_locations[0]; cv2.rectangle(frame, (l, top), (r, bot), (0, 255, 0), 2)
                if elapsed > 5:
                    enc = face_recognition.face_encodings(rgb_frame, [face_locations[0]])
                    if enc: self.captured_encoding = enc[0]; self.progress_label.configure(text="Capture complete!")
                    if self.controller.cap: self.controller.cap.release(); self.controller.cap = None
            else: self.capture_start_time = None; self.progress_bar.set(0); self.progress_label.configure(text="No face detected.")
            pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            ctk_img = ctk.CTkImage(light_image=pil_img, size=(640, 480))
            self.video_label.configure(image=ctk_img); self.video_label.image = ctk_img
        if self.controller.cap and self.controller.cap.isOpened(): self.controller.active_video_feed_func = self.after(15, self.update_feed)
    def register_final(self):
        if self.captured_encoding is None: messagebox.showerror("Error", "No face has been captured."); return
        success, msg = self.controller.get_db().register_student(self.id_entry.get(), self.name_entry.get(), self.dept_menu.get(), self.year_menu.get(), self.captured_encoding)
        if success: 
            messagebox.showinfo("Success", msg)
            self.controller.get_face_rec().load_known_faces()
            self._go_back()
        else: messagebox.showerror("Error", msg)
    def on_show(self, data=None):
        self.captured_encoding = None; self.name_entry.delete(0, "end"); self.id_entry.delete(0, "end")
        self.progress_bar.set(0); self.progress_label.configure(text="Fill details on the left and press 'Start Capture'."); self.video_label.configure(image=None)