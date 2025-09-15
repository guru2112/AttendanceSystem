# pages/attendance_pages.py

import customtkinter as ctk
from tkinter import messagebox, ttk
from PIL import Image
import cv2
import datetime
from .gui_components import BasePage, FONT_FAMILY, CARD_COLOR, PRIMARY_COLOR, SUBJECT_MAP

class AttendanceSetupPage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        ctk.CTkLabel(self, text="Setup Attendance Session", font=ctk.CTkFont(family=FONT_FAMILY, size=24, weight="bold")).pack(pady=20, padx=40, anchor="w")
        form_frame = ctk.CTkFrame(self, fg_color=CARD_COLOR); form_frame.pack(pady=20, padx=40, fill="x")
        self.date_entry = ctk.CTkEntry(form_frame, placeholder_text="Date"); self.date_entry.pack(pady=10, padx=20, fill="x")
        self.dept_menu = ctk.CTkOptionMenu(form_frame, values=list(SUBJECT_MAP.keys()), command=self.update_subjects); self.dept_menu.pack(pady=10, padx=20, fill="x")
        self.year_menu = ctk.CTkOptionMenu(form_frame, values=["1", "2", "3", "4"], command=self.update_subjects); self.year_menu.pack(pady=10, padx=20, fill="x")
        self.semester_menu = ctk.CTkOptionMenu(form_frame, values=[str(i) for i in range(1, 9)]); self.semester_menu.pack(pady=10, padx=20, fill="x")
        self.class_menu = ctk.CTkOptionMenu(form_frame, values=["A", "B", "C"]); self.class_menu.pack(pady=10, padx=20, fill="x")
        self.subject_menu = ctk.CTkOptionMenu(form_frame, values=["Select Dept and Year first"]); self.subject_menu.pack(pady=10, padx=20, fill="x")
        ctk.CTkButton(form_frame, text="Proceed to Camera", command=self.start_session, height=40).pack(pady=20, padx=20)
        self.on_show()
    def update_subjects(self, _=None):
        subjects = SUBJECT_MAP.get(self.dept_menu.get(), {}).get(self.year_menu.get(), [])
        if subjects: self.subject_menu.configure(values=subjects); self.subject_menu.set(subjects[0])
        else: self.subject_menu.configure(values=["No subjects found"]); self.subject_menu.set("No subjects found")
    def start_session(self):
        details = {"date": self.date_entry.get(), "department": self.dept_menu.get(), "year": self.year_menu.get(), "semester": self.semester_menu.get(), "class_div": self.class_menu.get(), "subject": self.subject_menu.get()}
        if "No subjects" in details["subject"] or "Select" in details["subject"]: messagebox.showerror("Error", "Please select a valid subject."); return
        self.controller.show_frame("LiveAttendancePage", data=details)
    def on_show(self, data=None):
        self.date_entry.delete(0, "end"); self.date_entry.insert(0, datetime.date.today().strftime("%Y-%m-%d")); self.update_subjects()

class LiveAttendancePage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        top_frame = ctk.CTkFrame(self, fg_color="transparent"); top_frame.pack(fill="x", padx=20, pady=10)
        ctk.CTkButton(top_frame, text="< End Session", command=lambda: controller.show_frame("TeacherDashboard"), width=120).pack(side="left")
        self.session_label = ctk.CTkLabel(top_frame, text="", font=ctk.CTkFont(family=FONT_FAMILY, size=18)); self.session_label.pack(side="left", padx=20)
        self.video_label = ctk.CTkLabel(self, text=""); self.video_label.pack(pady=10, padx=20, fill="both", expand=True)
    def on_show(self, data=None):
        self.attendance_details = data
        self.session_label.configure(text=f"Session: {data['subject']} (Year {data['year']} - Sem {data['semester']})")
        self.controller.cap = cv2.VideoCapture(0); self.controller.get_face_rec().marked_today.clear(); self.update_feed()
    def update_feed(self):
        if not self.controller.cap or not self.controller.cap.isOpened(): return
        ret, frame = self.controller.cap.read()
        if ret:
            processed_frame, _ = self.controller.get_face_rec().process_frame_for_attendance(frame, self.attendance_details)
            pil_img = Image.fromarray(cv2.cvtColor(processed_frame, cv2.COLOR_BGR2RGB))
            ctk_img = ctk.CTkImage(light_image=pil_img, size=(pil_img.width, pil_img.height))
            self.video_label.configure(image=ctk_img); self.video_label.image = ctk_img
        self.controller.active_video_feed_func = self.after(15, self.update_feed)

class TestFaceScanPage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        top_frame = ctk.CTkFrame(self, fg_color="transparent"); top_frame.pack(fill="x", padx=20, pady=10)
        ctk.CTkButton(top_frame, text="< Back to Dashboard", command=lambda: controller.show_frame("StudentDashboard"), width=150).pack(side="left")
        ctk.CTkLabel(top_frame, text="Face Recognition Demo", font=ctk.CTkFont(family=FONT_FAMILY, size=18)).pack(side="left", padx=20)
        self.video_label = ctk.CTkLabel(self, text=""); self.video_label.pack(pady=10, padx=20, fill="both", expand=True)
    def on_show(self, data=None):
        self.controller.cap = cv2.VideoCapture(0); self.update_feed()
    def update_feed(self):
        if not self.controller.cap or not self.controller.cap.isOpened(): return
        ret, frame = self.controller.cap.read()
        if ret:
            processed_frame, _ = self.controller.get_face_rec().process_frame_for_demo(frame)
            pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            ctk_img = ctk.CTkImage(light_image=pil_img, size=(pil_img.width, pil_img.height))
            self.video_label.configure(image=ctk_img); self.video_label.image = ctk_img
        self.controller.active_video_feed_func = self.after(15, self.update_feed)

class ViewAttendancePage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.grid_rowconfigure(2, weight=1); self.grid_columnconfigure(0, weight=1)
        top_frame = ctk.CTkFrame(self, fg_color="transparent"); top_frame.grid(row=0, column=0, padx=20, pady=(20,10), sticky="ew")
        ctk.CTkLabel(top_frame, text="View Attendance Records", font=ctk.CTkFont(family=FONT_FAMILY, size=24, weight="bold")).pack(side="left")
        self.filter_frame = ctk.CTkFrame(self); self.filter_frame.grid(row=1, column=0, padx=20, pady=10, sticky="ew")
        self.id_filter = ctk.CTkEntry(self.filter_frame, placeholder_text="Student ID"); self.id_filter.pack(side="left", padx=5, pady=10, expand=True)
        self.date_filter = ctk.CTkEntry(self.filter_frame, placeholder_text="Date (YYYY-MM-DD)"); self.date_filter.pack(side="left", padx=5, pady=10, expand=True)
        depts = ["All Depts"] + list(SUBJECT_MAP.keys()); self.dept_filter = ctk.CTkOptionMenu(self.filter_frame, values=depts, command=self.update_subject_filter); self.dept_filter.pack(side="left", padx=5, pady=10)
        years = ["All Years"] + ["1", "2", "3", "4"]; self.year_filter = ctk.CTkOptionMenu(self.filter_frame, values=years, command=self.update_subject_filter); self.year_filter.pack(side="left", padx=5, pady=10)
        self.subject_filter = ctk.CTkOptionMenu(self.filter_frame, values=["All Subjects"]); self.subject_filter.pack(side="left", padx=5, pady=10)
        ctk.CTkButton(self.filter_frame, text="Filter", command=self.apply_filters, width=100).pack(side="left", padx=5, pady=10)
        ctk.CTkButton(self.filter_frame, text="Reset", command=self.reset_filters, fg_color="gray").pack(side="left", padx=5, pady=10)
        table_frame = ctk.CTkFrame(self); table_frame.grid(row=2, column=0, padx=20, pady=10, sticky="nsew"); table_frame.grid_rowconfigure(0, weight=1); table_frame.grid_columnconfigure(0, weight=1)
        style = ttk.Style(); style.theme_use("default")
        style.configure("Treeview", background=CARD_COLOR, foreground="white", rowheight=28, fieldbackground=CARD_COLOR, font=(FONT_FAMILY, 11))
        style.map('Treeview', background=[('selected', PRIMARY_COLOR)])
        style.configure("Treeview.Heading", background="#565B5E", foreground="white", font=(FONT_FAMILY, 12, 'bold'))
        self.tree = ttk.Treeview(table_frame, columns=("ID", "Name", "Date", "Subject", "Semester", "Status"), show="headings")
        for col in ("ID", "Name", "Date", "Subject", "Semester", "Status"): self.tree.heading(col, text=col)
        self.tree.grid(row=0, column=0, sticky="nsew")
    def update_subject_filter(self, _=None):
        dept, year = self.dept_filter.get(), self.year_filter.get()
        if dept == "All Depts" or year == "All Years": subjects = ["All Subjects"]
        else: subjects = ["All Subjects"] + SUBJECT_MAP.get(dept, {}).get(year, [])
        self.subject_filter.configure(values=subjects); self.subject_filter.set("All Subjects")
    def apply_filters(self):
        filters = {}
        if self.id_filter.get(): filters['student_id'] = self.id_filter.get()
        if self.date_filter.get(): filters['date'] = self.date_filter.get()
        if self.dept_filter.get() != "All Depts": filters['department'] = self.dept_filter.get()
        if self.year_filter.get() != "All Years": filters['year'] = self.year_filter.get()
        if self.subject_filter.get() != "All Subjects": filters['subject'] = self.subject_filter.get()
        records = self.controller.get_db().get_filtered_attendance(filters)
        for i in self.tree.get_children(): self.tree.delete(i)
        for rec in records: self.tree.insert("", "end", values=tuple(rec.get(k, '') for k in ['student_id', 'name', 'date', 'subject', 'semester', 'status']))
    def reset_filters(self, auto_load=True):
        self.id_filter.delete(0, "end"); self.date_filter.delete(0, "end")
        self.dept_filter.set("All Depts"); self.year_filter.set("All Years")
        self.update_subject_filter()
        if auto_load: self.apply_filters()
        else: 
            for i in self.tree.get_children(): self.tree.delete(i)
    def on_show(self, data):
        mode = data.get("mode", "all")
        for i in self.tree.get_children(): self.tree.delete(i)
        if mode == "my":
            self.filter_frame.grid_forget()
            self.apply_filters_for_student()
        else:
            self.filter_frame.grid(row=1, column=0, padx=20, pady=10, sticky="ew")
            self.reset_filters(auto_load=False)
    def apply_filters_for_student(self):
        records = self.controller.get_db().get_filtered_attendance({'student_id': self.controller.current_user_id})
        for i in self.tree.get_children(): self.tree.delete(i)
        for rec in records: self.tree.insert("", "end", values=tuple(rec.get(k, '') for k in ['student_id', 'name', 'date', 'subject', 'semester', 'status']))