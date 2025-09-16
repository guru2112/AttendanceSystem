# pages/dashboard_pages.py

import customtkinter as ctk
from .gui_components import BasePage, FONT_FAMILY, CARD_COLOR

class TeacherDashboard(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        ctk.CTkLabel(self, text="Teacher Dashboard", font=ctk.CTkFont(family=FONT_FAMILY, size=32, weight="bold")).pack(pady=(20,10), padx=40, anchor="w")
        main_frame = ctk.CTkFrame(self, fg_color="transparent"); main_frame.pack(fill="both", expand=True, padx=40, pady=10)
        main_frame.grid_columnconfigure((0, 1), weight=1); main_frame.grid_rowconfigure((0, 1), weight=1)
        
        self._create_card(main_frame, "👤+", "Register Student", "Add a new student to the system and capture their facial data.", lambda: controller.show_frame("RegisterStudentPage")).grid(row=0, column=0, padx=10, pady=10, sticky="nsew")
        self._create_card(main_frame, "🔄", "Update Details", "Modify student information or update their facial scan.", lambda: controller.show_frame("UpdateStudentPage")).grid(row=0, column=1, padx=10, pady=10, sticky="nsew")
        self._create_card(main_frame, "▶️", "Start Session", "Begin a live attendance session for a class or subject.", lambda: controller.show_frame("AttendanceSetupPage")).grid(row=1, column=0, padx=10, pady=10, sticky="nsew")
        self._create_card(main_frame, "📊", "View Report", "Filter and view all historical attendance records.", lambda: controller.show_frame("ViewAttendancePage", data={"mode": "all"})).grid(row=1, column=1, padx=10, pady=10, sticky="nsew")

    def _create_card(self, parent, icon, title, description, command):
        card = ctk.CTkFrame(parent, fg_color=CARD_COLOR, corner_radius=10)
        card.grid_rowconfigure(2, weight=1)
        ctk.CTkLabel(card, text=icon, font=ctk.CTkFont(size=40)).pack(pady=(20, 10))
        ctk.CTkLabel(card, text=title, font=ctk.CTkFont(family=FONT_FAMILY, size=20, weight="bold")).pack(pady=(0, 10))
        ctk.CTkLabel(card, text=description, wraplength=250).pack(padx=20)
        ctk.CTkButton(card, text="Go →", command=command, width=120).pack(pady=20, anchor="s")
        return card

class StudentDashboard(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.welcome_label = ctk.CTkLabel(self, text="", font=ctk.CTkFont(family=FONT_FAMILY, size=32, weight="bold"))
        self.welcome_label.pack(pady=(20,10), padx=40, anchor="w")
        
        main_frame = ctk.CTkFrame(self, fg_color="transparent"); main_frame.pack(fill="both", expand=True, padx=40, pady=10)
        main_frame.grid_columnconfigure((0, 1), weight=1); main_frame.grid_rowconfigure((0, 1), weight=1)

        self._create_card(main_frame, "🔄", "Update My Profile", "Update your personal details.", lambda: controller.show_frame("UpdateProfilePage")).grid(row=0, column=0, padx=10, pady=10, sticky="nsew")
        self._create_card(main_frame, "📸", "Test Face Scan", "Check if the system correctly recognizes your face.", lambda: controller.show_frame("TestFaceScanPage")).grid(row=0, column=1, padx=10, pady=10, sticky="nsew")
        self._create_card(main_frame, "📊", "View My Attendance", "Check your historical attendance records.", lambda: controller.show_frame("ViewAttendancePage", data={"mode": "my"})).grid(row=1, column=0, padx=10, pady=10, sticky="nsew")
        self._create_card(main_frame, "ℹ️", "Account Info", "View your account information.", lambda: None).grid(row=1, column=1, padx=10, pady=10, sticky="nsew")
        
    def _create_card(self, parent, icon, title, description, command):
        card = ctk.CTkFrame(parent, fg_color=CARD_COLOR, corner_radius=10)
        card.grid_rowconfigure(2, weight=1)
        ctk.CTkLabel(card, text=icon, font=ctk.CTkFont(size=40)).pack(pady=(20, 10))
        ctk.CTkLabel(card, text=title, font=ctk.CTkFont(family=FONT_FAMILY, size=20, weight="bold")).pack(pady=(0, 10))
        ctk.CTkLabel(card, text=description, wraplength=250).pack(padx=20, pady=10)
        ctk.CTkButton(card, text="Open", command=command, width=120).pack(pady=20, anchor="s")
        return card
        
    def on_show(self, data=None):
        student = self.controller.get_db().get_student_by_id(self.controller.current_user_id)
        name = student.get("name") if student else ""
        self.welcome_label.configure(text=f"Welcome, {name}!")