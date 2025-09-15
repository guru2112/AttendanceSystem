# main.py

import customtkinter as ctk
from database import Database
from face_recognition_logic import FaceRecognition

# Import all page classes from their respective files in the 'pages' directory
from pages.gui_components import Header, SlidingMenu
from pages.auth_pages import LandingPage, LoginPage
from pages.dashboard_pages import TeacherDashboard, StudentDashboard
from pages.registration_page import RegisterStudentPage
from pages.update_pages import UpdateStudentPage, UpdateFacePage, UpdateProfilePage
from pages.attendance_pages import AttendanceSetupPage, LiveAttendancePage, ViewAttendancePage, TestFaceScanPage

class App(ctk.CTk):
    def __init__(self, db_manager, face_rec_manager):
        super().__init__()
        self.db_manager = db_manager
        self.face_rec_manager = face_rec_manager
        self.title("Face Recognition Attendance System")
        self.geometry("1280x720")

        self.current_user_role = None; self.current_user_id = None; self.cap = None; self.active_video_feed_func = None
        
        # --- Main Layout Frames ---
        self.grid_rowconfigure(1, weight=1); self.grid_columnconfigure(0, weight=1)
        self.header_frame = None
        
        self.page_container = ctk.CTkFrame(self, fg_color="#1E1F22", corner_radius=0)
        self.page_container.grid(row=0, column=0, rowspan=2, sticky="nsew")
        self.page_container.grid_rowconfigure(0, weight=1); self.page_container.grid_columnconfigure(0, weight=1)

        self.frames = {}
        for F in (LandingPage, LoginPage, TeacherDashboard, StudentDashboard, RegisterStudentPage, UpdateStudentPage, UpdateFacePage, AttendanceSetupPage, LiveAttendancePage, ViewAttendancePage, UpdateProfilePage, TestFaceScanPage):
            page_name = F.__name__
            frame = F(parent=self.page_container, controller=self)
            self.frames[page_name] = frame; frame.grid(row=0, column=0, sticky="nsew")
        
        # --- Sliding Menu Setup ---
        self.menu_frame = SlidingMenu(self, self) # The menu lives in the main App window
        self.is_menu_open = False
        
        self.show_frame("LandingPage")

    def show_frame(self, page_name, data=None):
        if self.header_frame: self.header_frame.grid_forget()
        
        is_auth_page = page_name in ["LandingPage", "LoginPage"]

        if not is_auth_page:
            self.header_frame = Header(self, self)
            self.header_frame.grid(row=0, column=0, sticky="nsew")
            self.page_container.grid(row=1, column=0, sticky="nsew")
        else:
            # Instantly hide menu if navigating to an auth page
            if self.is_menu_open:
                self.is_menu_open = False
                self.menu_frame.place_forget()
            self.page_container.grid(row=0, column=0, rowspan=2, sticky="nsew")

        if self.active_video_feed_func: self.after_cancel(self.active_video_feed_func)
        if self.cap: self.cap.release(); self.cap = None
        
        frame = self.frames[page_name]
        if hasattr(frame, 'on_show'): frame.on_show(data)
        if self.header_frame: self.header_frame.update_welcome_message()
        if hasattr(self, 'menu_frame') and self.menu_frame: self.menu_frame.update_buttons()
        frame.tkraise()
        
    def get_db(self): return self.db_manager
    def get_face_rec(self): return self.face_rec_manager

    # --- NEW, STABLE SLIDING MENU LOGIC using CustomTkinter ---
    def toggle_menu(self):
        if self.is_menu_open:
            self.close_menu()
        else:
            self.open_menu()
        self.is_menu_open = not self.is_menu_open

    def open_menu(self):
        self.menu_frame.place(relx=1.0, rely=0, relwidth=0.25, relheight=1)
        self.menu_frame.animate_open()

    def close_menu(self):
        self.menu_frame.animate_close()

if __name__ == "__main__":
    db = Database()
    face_rec = FaceRecognition(db)
    app = App(db, face_rec)
    app.mainloop()