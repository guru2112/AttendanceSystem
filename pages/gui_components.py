# pages/gui_components.py

import customtkinter as ctk

# --- THEME AND STYLING CONSTANTS ---
FONT_FAMILY = "Roboto"
PRIMARY_COLOR = "#0A70F5"
SECONDARY_COLOR = "#1E1F22"
CARD_COLOR = "#2A2D2E"

SUBJECT_MAP = {
    "Computer science": { "1": ["Intro to Python", "Discrete Mathematics"], "2": ["Data Structures", "Algorithms"], "3": ["Database Systems", "Computer Networks"], "4": ["Machine Learning", "Compiler Design"] },
    "Information technology": { "1": ["Fundamentals of IT", "Web Basics"], "2": ["Object Oriented Programming", "Network Essentials"], "3": ["Information Security", "Cloud Computing"], "4": ["E-Commerce", "Big Data Analytics"] },
    "AI and DS": { "1": ["Linear Algebra", "Calculus for DS"], "2": ["Probability & Statistics", "Data Science Tools"], "3": ["Applied ML", "Deep Learning"], "4": ["Reinforcement Learning", "AI Ethics"] }
}

class Header(ctk.CTkFrame):
    def __init__(self, parent, controller):
        super().__init__(parent, height=60, fg_color=CARD_COLOR, corner_radius=0)
        self.controller = controller
        self.grid_columnconfigure(0, weight=1)
        
        ctk.CTkLabel(self, text="Attendance System", font=ctk.CTkFont(family=FONT_FAMILY, size=20, weight="bold")).grid(row=0, column=0, padx=20, pady=10, sticky="w")
        
        menu_button = ctk.CTkButton(self, text="☰", font=ctk.CTkFont(size=24), 
                                    width=50, fg_color="transparent",
                                    command=self.controller.toggle_menu)
        menu_button.grid(row=0, column=1, padx=20, sticky="e")
    
    def update_welcome_message(self):
        pass

class SlidingMenu(ctk.CTkFrame):
    def __init__(self, parent, controller, **kwargs):
        super().__init__(parent, fg_color="#2c3e50", corner_radius=0, **kwargs)
        self.controller = controller
        self.buttons = {}
        
        ctk.CTkLabel(self, text="MENU", font=ctk.CTkFont(family=FONT_FAMILY, size=20, weight="bold")).pack(pady=20)
        
        self.buttons['teacher'] = [ ctk.CTkButton(self, text=name, anchor="w", command=lambda p=page: self._navigate(p)) for name, page in {
            "Dashboard": "TeacherDashboard",
            "Register Student": "RegisterStudentPage",
            "Update Details": "UpdateStudentPage",
            "Start Session": "AttendanceSetupPage",
            "View Attendance": "ViewAttendancePage"
        }.items()]
        
        self.buttons['student'] = [ ctk.CTkButton(self, text=name, anchor="w", command=lambda p=page: self._navigate(p)) for name, page in {
            "Dashboard": "StudentDashboard",
            "Register Student": "RegisterStudentPage",
            "Update My Profile": "UpdateProfilePage",
            "My Attendance": "ViewAttendancePage"
        }.items()]
        
        self.logout_button = ctk.CTkButton(self, text="Logout", command=self.logout, fg_color="#D32F2F", hover_color="#B71C1C")
        self.logout_button.pack(side="bottom", fill="x", padx=20, pady=20)

    def _navigate(self, page_name):
        if page_name == "ViewAttendancePage":
            mode = "all" if self.controller.current_user_role == "teacher" else "my"
            self.controller.show_frame(page_name, data={"mode": mode})
        else:
            self.controller.show_frame(page_name)
        
        if self.controller.is_menu_open:
            self.controller.toggle_menu()

    def update_buttons(self):
        role = self.controller.current_user_role
        for r in self.buttons:
            for button in self.buttons[r]: button.pack_forget()
        
        # --- THIS IS THE FIX ---
        # The logic now correctly uses the 'role' variable to pack the corresponding buttons.
        if role in self.buttons:
            for button in self.buttons[role]:
                button.pack(fill="x", padx=20, pady=5)
    
    def logout(self):
        if self.controller.is_menu_open:
            self.controller.toggle_menu()
        
        self.after(350, self._perform_logout)

    def _perform_logout(self):
        self.controller.current_user_role = None
        self.controller.current_user_id = None
        self.controller.show_frame("LoginPage")

    def animate_open(self):
        self.animate(1.0, 0.75)
    
    def animate_close(self):
        self.animate(0.75, 1.0)
    
    def animate(self, start, end):
        if not hasattr(self, "pos"):
            self.pos = start
        
        if start < end: # Closing
            if self.pos < end:
                self.pos += 0.02
                self.place(relx=self.pos, rely=0, relwidth=0.25, relheight=1)
                self.after(10, lambda: self.animate(start, end))
            else:
                self.place_forget()
        else: # Opening
            if self.pos > end:
                self.pos -= 0.02
                self.place(relx=self.pos, rely=0, relwidth=0.25, relheight=1)
                self.after(10, lambda: self.animate(start, end))

class BasePage(ctk.CTkFrame):
    def __init__(self, parent, controller): 
        super().__init__(parent, fg_color=SECONDARY_COLOR)
        self.controller = controller
    def on_show(self, data=None): pass