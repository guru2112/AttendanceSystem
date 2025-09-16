# pages/update_pages.py

import customtkinter as ctk
from tkinter import messagebox
from PIL import Image
import cv2
import time
import numpy as np
from .gui_components import BasePage, FONT_FAMILY, CARD_COLOR, PRIMARY_COLOR

try:
    import face_recognition
    FACE_RECOGNITION_AVAILABLE = True
except ImportError:
    FACE_RECOGNITION_AVAILABLE = False

class UpdateStudentPage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        ctk.CTkLabel(self, text="Update Student Details", font=ctk.CTkFont(family=FONT_FAMILY, size=24, weight="bold")).pack(pady=20, padx=40, anchor="w")
        
        # --- Card for Searching ---
        card = ctk.CTkFrame(self, fg_color=CARD_COLOR)
        card.pack(pady=10, padx=40, fill="x")
        ctk.CTkLabel(card, text="Step 1: Find Student", font=ctk.CTkFont(size=16, weight="bold")).pack(pady=(20,10), padx=20, anchor="w")
        search_frame = ctk.CTkFrame(card, fg_color="transparent")
        search_frame.pack(pady=(0,20), padx=20, fill="x")
        self.search_id_entry = ctk.CTkEntry(search_frame, placeholder_text="Enter Student ID")
        self.search_id_entry.pack(side="left", expand=True, fill="x")
        ctk.CTkButton(search_frame, text="Search", command=self.search_student).pack(side="left", padx=(10, 0))
        
        # --- Card for Editing Details ---
        details_card = ctk.CTkFrame(self, fg_color=CARD_COLOR)
        details_card.pack(pady=10, padx=40, fill="x")
        ctk.CTkLabel(details_card, text="Step 2: Edit Details", font=ctk.CTkFont(size=16, weight="bold")).pack(pady=(20,10), padx=20, anchor="w")
        self.name_entry = ctk.CTkEntry(details_card, placeholder_text="Student Name")
        self.name_entry.pack(pady=5, padx=20, fill="x")
        self.dept_menu = ctk.CTkOptionMenu(details_card, values=["Computer science", "Information technology", "AI and DS"])
        self.dept_menu.pack(pady=5, padx=20, fill="x")
        self.year_menu = ctk.CTkOptionMenu(details_card, values=["1", "2", "3", "4"])
        self.year_menu.pack(pady=5, padx=20, fill="x")
        self.save_button = ctk.CTkButton(details_card, text="Save Changes", command=self.save_changes, height=40)
        self.save_button.pack(pady=(20,10), padx=20)
        self.update_face_button = ctk.CTkButton(details_card, text="Update Face Scan", command=self.go_to_update_face, fg_color="transparent", border_color=PRIMARY_COLOR, border_width=2)
        self.update_face_button.pack(pady=(0, 20), padx=20)
        self.on_show()

    def reset_fields(self):
        for w in [self.name_entry, self.dept_menu, self.year_menu, self.save_button, self.update_face_button]: w.configure(state="disabled")
        self.search_id_entry.delete(0, "end"); self.name_entry.delete(0, "end")
    
    def search_student(self):
        student_id = self.search_id_entry.get()
        if not student_id: messagebox.showerror("Error", "Please enter a Student ID."); return
        data = self.controller.get_db().get_student_by_id(student_id)
        if data:
            for w in [self.name_entry, self.dept_menu, self.year_menu, self.save_button, self.update_face_button]: w.configure(state="normal")
            self.name_entry.delete(0, "end"); self.name_entry.insert(0, data.get("name", ""))
            self.dept_menu.set(data.get("department", "Computer science")); self.year_menu.set(str(data.get("year", "1")))
        else: messagebox.showerror("Not Found", f"No student found with ID: {student_id}"); self.reset_fields()

    def save_changes(self):
        if self.controller.get_db().update_student_details(self.search_id_entry.get(), self.name_entry.get(), self.dept_menu.get(), self.year_menu.get()):
            messagebox.showinfo("Success", "Student details updated successfully.")
            self.controller.get_face_rec().load_known_faces(); self.controller.show_frame("TeacherDashboard")
        else: messagebox.showerror("Error", "Failed to update details.")

    def go_to_update_face(self):
        student_id = self.search_id_entry.get()
        if not student_id: messagebox.showerror("Error", "Cannot update face without a selected student."); return
        self.controller.show_frame("UpdateFacePage", data={'student_id': student_id})

    def on_show(self, data=None): self.reset_fields()

class UpdateProfilePage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        ctk.CTkLabel(self, text="Update My Profile", font=ctk.CTkFont(family=FONT_FAMILY, size=24, weight="bold")).pack(pady=20, padx=40, anchor="w")
        
        details_card = ctk.CTkFrame(self, fg_color=CARD_COLOR); details_card.pack(pady=10, padx=40, fill="x")
        ctk.CTkLabel(details_card, text="Your Details", font=ctk.CTkFont(size=16, weight="bold")).pack(pady=(20,10), padx=20, anchor="w")
        self.name_entry = ctk.CTkEntry(details_card, placeholder_text="Student Name"); self.name_entry.pack(pady=5, padx=20, fill="x")
        self.dept_menu = ctk.CTkOptionMenu(details_card, values=["Computer science", "Information technology", "AI and DS"]); self.dept_menu.pack(pady=5, padx=20, fill="x")
        self.year_menu = ctk.CTkOptionMenu(details_card, values=["1", "2", "3", "4"]); self.year_menu.pack(pady=5, padx=20, fill="x")
        self.save_button = ctk.CTkButton(details_card, text="Save Changes", command=self.save_changes, height=40); self.save_button.pack(pady=(20,10), padx=20)
        self.update_face_button = ctk.CTkButton(details_card, text="Update Face Scan", command=self.go_to_update_face, fg_color="transparent", border_color=PRIMARY_COLOR, border_width=2); self.update_face_button.pack(pady=(0, 20), padx=20)

    def on_show(self, data=None):
        student_id = self.controller.current_user_id
        student_data = self.controller.get_db().get_student_by_id(student_id)
        if student_data:
            self.name_entry.delete(0, "end"); self.name_entry.insert(0, student_data.get("name", ""))
            self.dept_menu.set(student_data.get("department", "Computer science"))
            self.year_menu.set(str(student_data.get("year", "1")))
        else:
             messagebox.showerror("Error", "Could not load your details.")

    def save_changes(self):
        student_id = self.controller.current_user_id
        if self.controller.get_db().update_student_details(student_id, self.name_entry.get(), self.dept_menu.get(), self.year_menu.get()):
            messagebox.showinfo("Success", "Your details have been updated.")
            self.controller.get_face_rec().load_known_faces()
            self.controller.show_frame("StudentDashboard")
        else:
            messagebox.showerror("Error", "Failed to update your details.")

    def go_to_update_face(self):
        student_id = self.controller.current_user_id
        self.controller.show_frame("UpdateFacePage", data={'student_id': student_id})

class UpdateFacePage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        ctk.CTkLabel(self, text="Update Face Scan", font=ctk.CTkFont(family=FONT_FAMILY, size=24, weight="bold")).pack(pady=20, padx=40, anchor="w")
        self.student_info_label = ctk.CTkLabel(self, text="", font=ctk.CTkFont(family=FONT_FAMILY, size=16)); self.student_info_label.pack(pady=(0, 10), padx=40, anchor="w")
        main_frame = ctk.CTkFrame(self, fg_color="transparent"); main_frame.pack(pady=10, padx=40, fill="both", expand=True)
        self.video_label = ctk.CTkLabel(main_frame, text="", fg_color=CARD_COLOR, width=640, height=480); self.video_label.pack(pady=10, fill="both", expand=True)
        self.progress_bar = ctk.CTkProgressBar(main_frame); self.progress_bar.pack(pady=5, fill="x")
        self.progress_label = ctk.CTkLabel(main_frame, text="Press 'Start Capture' to begin."); self.progress_label.pack()
        btn_frame = ctk.CTkFrame(main_frame, fg_color="transparent"); btn_frame.pack(pady=20)
        ctk.CTkButton(btn_frame, text="Start Capture", command=self.start_capture, height=40).pack(side="left", padx=10)
        ctk.CTkButton(btn_frame, text="Save New Face", command=self.save_new_face, height=40).pack(side="left", padx=10)
        ctk.CTkButton(btn_frame, text="Cancel", command=self._go_back, height=40, fg_color="gray").pack(side="left", padx=10)
    
    def _go_back(self):
        destination = "StudentDashboard" if self.controller.current_user_role == "student" else "UpdateStudentPage"
        self.controller.show_frame(destination)

    def on_show(self, data):
        self.student_id = data.get('student_id')
        student_data = self.controller.get_db().get_student_by_id(self.student_id)
        if student_data: self.student_info_label.configure(text=f"Updating face for: {student_data.get('name')} ({self.student_id})")
        else: self.student_info_label.configure(text=f"Error: Could not find student with ID {self.student_id}")
        self.captured_encoding = None; self.progress_bar.set(0); self.progress_label.configure(text="Press 'Start Capture' to begin."); self.video_label.configure(image=None)
    def start_capture(self):
        if not self.student_id: messagebox.showerror("Error", "No student selected. Please go back."); return
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
                    if FACE_RECOGNITION_AVAILABLE:
                        encodings = face_recognition.face_encodings(rgb_frame, [face_locations[0]])
                        if encodings: 
                            self.captured_encoding = encodings[0]
                            self.progress_label.configure(text="Capture complete! You can now save.")
                    else:
                        # Simulation mode
                        self.captured_encoding = np.random.rand(128)
                        self.progress_label.configure(text="Capture complete! You can now save. (Simulation mode)")
                    if self.controller.cap: self.controller.cap.release(); self.controller.cap = None
            else: self.capture_start_time = None; self.progress_bar.set(0); self.progress_label.configure(text="No face detected.")
            pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            ctk_img = ctk.CTkImage(light_image=pil_img, size=(pil_img.width, pil_img.height))
            self.video_label.configure(image=ctk_img); self.video_label.image = ctk_img
        if self.controller.cap and self.controller.cap.isOpened(): self.controller.active_video_feed_func = self.after(15, self.update_feed)
    def save_new_face(self):
        if self.captured_encoding is None: messagebox.showerror("Error", "No new face has been captured yet."); return
        if self.controller.get_db().update_face_encoding(self.student_id, self.captured_encoding):
            messagebox.showinfo("Success", "Student's face has been updated successfully.")
            self.controller.get_face_rec().load_known_faces()
            self._go_back()
        else: messagebox.showerror("Error", "Failed to update the face in the database.")