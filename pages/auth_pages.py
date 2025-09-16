# pages/auth_pages.py

import customtkinter as ctk
from tkinter import messagebox
from PIL import Image
from .gui_components import BasePage, FONT_FAMILY

# --- NEW ADVANCED STYLING CONSTANTS ---
NAVBAR_COLOR = "#1B1D1F"
MAIN_BG_COLOR = "#16181A"
CARD_COLOR = "#2A2D2E" 
GLASS_COLOR = "#1D1F21" # A solid, slightly transparent-looking color for the card
PRIMARY_ACCENT = "#4A90E2"
TEXT_COLOR_LIGHT = "#DCE4EE"
TEXT_COLOR_DARK = "#7B8BAB"

class HoverCard(ctk.CTkFrame):
    """A custom card widget with an advanced hover effect."""
    def __init__(self, parent, icon_char, title_text, description_text):
        super().__init__(parent, fg_color=CARD_COLOR, corner_radius=10, border_width=0)
        
        self.grid_rowconfigure(2, weight=1); self.grid_columnconfigure(0, weight=1)
        self.icon_label = ctk.CTkLabel(self, text=icon_char, font=ctk.CTkFont(size=36), text_color=PRIMARY_ACCENT)
        self.icon_label.pack(pady=(20, 10))
        self.title_label = ctk.CTkLabel(self, text=title_text, font=ctk.CTkFont(family=FONT_FAMILY, size=18, weight="bold"), text_color=TEXT_COLOR_LIGHT)
        self.title_label.pack(pady=(0, 10))
        ctk.CTkLabel(self, text=description_text, wraplength=220, justify="center", text_color=TEXT_COLOR_DARK).pack(padx=20, pady=(0, 20), fill="x", expand=True)
        self.bind("<Enter>", self.on_enter); self.bind("<Leave>", self.on_leave)

    def on_enter(self, event):
        self.configure(border_color=PRIMARY_ACCENT, border_width=1)
        self.title_label.configure(text_color=PRIMARY_ACCENT)
        self.icon_label.configure(text_color=TEXT_COLOR_LIGHT)
    def on_leave(self, event):
        self.configure(border_width=0)
        self.title_label.configure(text_color=TEXT_COLOR_LIGHT)
        self.icon_label.configure(text_color=PRIMARY_ACCENT)

class LandingPage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.configure(fg_color=MAIN_BG_COLOR)
        
        self.grid_rowconfigure(1, weight=1); self.grid_columnconfigure(0, weight=1)
        
        navbar = ctk.CTkFrame(self, height=75, fg_color=NAVBAR_COLOR, corner_radius=0)
        navbar.grid(row=0, column=0, sticky="ew"); navbar.grid_columnconfigure(1, weight=1)
        ctk.CTkLabel(navbar, text="FaceAuth", font=ctk.CTkFont(family=FONT_FAMILY, size=24, weight="bold")).pack(side="left", padx=30)
        nav_links = ctk.CTkFrame(navbar, fg_color="transparent"); nav_links.pack(side="left", padx=50)
        ctk.CTkButton(nav_links, text="Features", command=lambda: self.scroll_to_section(self.features_frame), fg_color="transparent", font=ctk.CTkFont(size=14)).pack(side="left", padx=20)
        ctk.CTkButton(nav_links, text="How It Works", command=lambda: self.scroll_to_section(self.how_to_use_frame), fg_color="transparent", font=ctk.CTkFont(size=14)).pack(side="left", padx=20)
        ctk.CTkButton(navbar, text="Get Started", command=lambda: controller.show_frame("LoginPage"), width=120, height=40, corner_radius=8).pack(side="right", padx=30)

        self.scroll_frame = ctk.CTkScrollableFrame(self, fg_color=MAIN_BG_COLOR, corner_radius=0)
        self.scroll_frame.grid(row=1, column=0, sticky="nsew")

        self.hero_frame = ctk.CTkFrame(self.scroll_frame, fg_color="transparent"); self.hero_frame.pack(fill="x", padx=100, pady=(80, 40))
        ctk.CTkLabel(self.hero_frame, text="Automate Your Attendance.", font=ctk.CTkFont(family=FONT_FAMILY, size=64, weight="bold"), wraplength=800, text_color=TEXT_COLOR_LIGHT).pack(pady=(10, 20))
        ctk.CTkLabel(self.hero_frame, text="A seamless and secure solution powered by modern AI.", font=ctk.CTkFont(family=FONT_FAMILY, size=20), text_color=TEXT_COLOR_DARK, wraplength=600).pack(pady=(0, 40))
        
        self.features_frame = ctk.CTkFrame(self.scroll_frame, fg_color="transparent"); self.features_frame.pack(fill="x", padx=100, pady=60)
        ctk.CTkLabel(self.features_frame, text="Why Choose Our System?", font=ctk.CTkFont(family=FONT_FAMILY, size=32, weight="bold"), text_color=TEXT_COLOR_LIGHT).pack()
        ctk.CTkLabel(self.features_frame, text="Discover the features that make our system powerful and user-friendly.", font=ctk.CTkFont(family=FONT_FAMILY, size=16), text_color=TEXT_COLOR_DARK).pack(pady=(5, 40))
        
        features_grid = ctk.CTkFrame(self.features_frame, fg_color="transparent"); features_grid.pack(fill="x", expand=True)
        features_grid.grid_columnconfigure((0, 1, 2, 3), weight=1)
        HoverCard(features_grid, "🕒", "Real-time Tracking", "Monitor attendance instantly with live data streams.").grid(row=0, column=0, padx=15, pady=15, sticky="nsew")
        HoverCard(features_grid, "🎯", "High Accuracy", "Our advanced AI algorithms ensure over 99.7% accuracy.").grid(row=0, column=1, padx=15, pady=15, sticky="nsew")
        HoverCard(features_grid, "🔒", "Secure & Private", "We prioritize data security with end-to-end encryption.").grid(row=0, column=2, padx=15, pady=15, sticky="nsew")
        HoverCard(features_grid, "⚙️", "Easy Integration", "Seamlessly integrate with your existing HR systems.").grid(row=0, column=3, padx=15, pady=15, sticky="nsew")

        self.how_to_use_frame = ctk.CTkFrame(self.scroll_frame, fg_color="transparent"); self.how_to_use_frame.pack(fill="x", padx=100, pady=60)
        ctk.CTkLabel(self.how_to_use_frame, text="Simple Steps to Get Started", font=ctk.CTkFont(family=FONT_FAMILY, size=32, weight="bold")).pack()
        ctk.CTkLabel(self.how_to_use_frame, text="Our system is designed for a quick and hassle-free setup.", font=ctk.CTkFont(family=FONT_FAMILY, size=16), text_color=TEXT_COLOR_DARK).pack(pady=(5, 40))
        how_to_use_card = ctk.CTkFrame(self.how_to_use_frame, fg_color=CARD_COLOR, corner_radius=10); how_to_use_card.pack(fill="x")
        steps_text = "1.  Register Students: A teacher registers each student by capturing their facial data.\n2.  Start a Session: The teacher sets up a new attendance session for a specific subject.\n3.  Automated Marking: Students simply look at the camera, and attendance is marked.\n4.  View Reports: Access detailed attendance records anytime through the filtered view."
        ctk.CTkLabel(how_to_use_card, text=steps_text, font=ctk.CTkFont(family=FONT_FAMILY, size=16), justify="left", text_color=TEXT_COLOR_LIGHT).pack(pady=20, padx=30, anchor="w")
        
        self.about_frame = ctk.CTkFrame(self.scroll_frame, fg_color="transparent") # Placeholder
        footer = ctk.CTkFrame(self.scroll_frame, fg_color=NAVBAR_COLOR, corner_radius=0); footer.pack(fill="x", pady=(80, 0), ipady=20)
        ctk.CTkLabel(footer, text="© 2025 Face Recognition Attendance System. All rights reserved.", font=ctk.CTkFont(size=12), text_color=TEXT_COLOR_DARK).pack()

    def scroll_to_home(self): self.scroll_frame._parent_canvas.yview_moveto(0.0)
    def scroll_to_section(self, target_widget):
        self.after(100, lambda: self._perform_scroll(target_widget))
    def _perform_scroll(self, target_widget):
        y_pos = target_widget.winfo_y(); region = self.scroll_frame._parent_canvas.cget("scrollregion")
        if not region: return
        try: total_h = int(region.split(' ')[3])
        except (ValueError, IndexError): return
        if total_h > 0: self.scroll_frame._parent_canvas.yview_moveto((y_pos - 80) / total_h)

class LoginPage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        
        try:
            bg_image_data = Image.open("images/blurlogin.jpeg")
            bg_image = ctk.CTkImage(bg_image_data, size=(1280, 720))
            bg_label = ctk.CTkLabel(self, text="", image=bg_image)
            bg_label.place(relx=0.5, rely=0.5, anchor="center")
        except FileNotFoundError:
            print("Error: images/background.jpeg not found.")
            self.configure(fg_color=MAIN_BG_COLOR)
        except Exception as e:
            print(f"Failed to load background image: {e}")
            self.configure(fg_color=MAIN_BG_COLOR)

        card = ctk.CTkFrame(self, fg_color="transparent", width=400, height=450, corner_radius=20)
        card.place(relx=0.5, rely=0.5, anchor="center")
        
        try:
            blur_image_data = Image.open("images/")
            blur_image = ctk.CTkImage(blur_image_data, size=(400, 450))
            blur_label = ctk.CTkLabel(card, text="", image=blur_image)
            blur_label.place(relx=0.5, rely=0.5, anchor="center")
        except FileNotFoundError:
            print("Warning: images/blurlogin.jpeg not found. Using solid color.")
            card.configure(fg_color=CARD_COLOR)
        except Exception as e:
            print(f"Failed to load blur image: {e}")
            card.configure(fg_color=CARD_COLOR)
        
        close_button = ctk.CTkButton(card, text="✕", command=lambda: controller.show_frame("LandingPage"), fg_color="transparent", bg_color="transparent", hover_color="#444", width=30, height=30, font=ctk.CTkFont(size=18))
        close_button.place(relx=1.0, y=0, x=-5, anchor="ne")
        
        ctk.CTkLabel(card, text="LOG IN TO SYSTEM", font=ctk.CTkFont(family=FONT_FAMILY, size=22, weight="bold"), text_color=TEXT_COLOR_LIGHT, bg_color="transparent").place(relx=0.5, rely=0.15, anchor="center")
        self.username_entry = ctk.CTkEntry(card, placeholder_text="Email or Username", width=300, height=45, corner_radius=8, bg_color="transparent"); self.username_entry.place(relx=0.5, rely=0.3, anchor="center")
        self.password_entry = ctk.CTkEntry(card, placeholder_text="Password", show="*", width=300, height=45, corner_radius=8, bg_color="transparent"); self.password_entry.place(relx=0.5, rely=0.45, anchor="center")
        options_frame = ctk.CTkFrame(card, fg_color="transparent", bg_color="transparent"); options_frame.place(relx=0.5, rely=0.58, anchor="center", relwidth=0.8)
        ctk.CTkCheckBox(options_frame, text="Remember me").pack(side="left")
        ctk.CTkButton(card, text="Continue", command=self.login_user, width=300, height=45, corner_radius=8).place(relx=0.5, rely=0.72, anchor="center")
        links_frame = ctk.CTkFrame(card, fg_color="transparent", bg_color="transparent"); links_frame.place(relx=0.5, rely=0.85, anchor="center", relwidth=0.8)
        ctk.CTkButton(links_frame, text="Forgot password?", fg_color="transparent", hover=False, font=ctk.CTkFont(underline=True)).pack(side="left", expand=True)
        ctk.CTkButton(links_frame, text="Create account", command=lambda: controller.show_frame("SignupPage"), fg_color="transparent", hover=False, font=ctk.CTkFont(underline=True)).pack(side="right", expand=True)

    def login_user(self):
        user = self.controller.get_db().get_user(self.username_entry.get())
        if user and self.controller.get_db().verify_password(self.password_entry.get(), user["password"]):
            self.controller.current_user_role = user["role"]; self.controller.current_user_id = user["username"]
            self.controller.show_frame("TeacherDashboard" if user["role"] == "teacher" else "StudentDashboard")
        else: messagebox.showerror("Error", "Invalid username or password")


class SignupPage(BasePage):
    def __init__(self, parent, controller):
        super().__init__(parent, controller)
        self.configure(fg_color=MAIN_BG_COLOR)
        
        card = ctk.CTkFrame(self, fg_color=CARD_COLOR, width=450, height=550, corner_radius=20)
        card.place(relx=0.5, rely=0.5, anchor="center")
        
        close_button = ctk.CTkButton(card, text="✕", command=lambda: controller.show_frame("LoginPage"), 
                                    fg_color="transparent", hover_color="#444", width=30, height=30, 
                                    font=ctk.CTkFont(size=18))
        close_button.place(relx=1.0, y=0, x=-5, anchor="ne")
        
        ctk.CTkLabel(card, text="CREATE ACCOUNT", font=ctk.CTkFont(family=FONT_FAMILY, size=22, weight="bold"), 
                    text_color=TEXT_COLOR_LIGHT).place(relx=0.5, rely=0.08, anchor="center")
        
        # Role selection
        ctk.CTkLabel(card, text="Select Role:", font=ctk.CTkFont(size=14), 
                    text_color=TEXT_COLOR_LIGHT).place(relx=0.5, rely=0.18, anchor="center")
        self.role_var = ctk.StringVar(value="student")
        role_frame = ctk.CTkFrame(card, fg_color="transparent")
        role_frame.place(relx=0.5, rely=0.25, anchor="center")
        ctk.CTkRadioButton(role_frame, text="Student", variable=self.role_var, value="student").pack(side="left", padx=20)
        ctk.CTkRadioButton(role_frame, text="Teacher", variable=self.role_var, value="teacher").pack(side="left", padx=20)
        
        # Form fields
        self.username_entry = ctk.CTkEntry(card, placeholder_text="Username", width=300, height=40, corner_radius=8)
        self.username_entry.place(relx=0.5, rely=0.35, anchor="center")
        
        self.name_entry = ctk.CTkEntry(card, placeholder_text="Full Name", width=300, height=40, corner_radius=8)
        self.name_entry.place(relx=0.5, rely=0.45, anchor="center")
        
        self.password_entry = ctk.CTkEntry(card, placeholder_text="Password", show="*", width=300, height=40, corner_radius=8)
        self.password_entry.place(relx=0.5, rely=0.55, anchor="center")
        
        self.confirm_password_entry = ctk.CTkEntry(card, placeholder_text="Confirm Password", show="*", width=300, height=40, corner_radius=8)
        self.confirm_password_entry.place(relx=0.5, rely=0.65, anchor="center")
        
        # Department and year for students
        self.department_entry = ctk.CTkEntry(card, placeholder_text="Department (for students)", width=300, height=40, corner_radius=8)
        self.department_entry.place(relx=0.5, rely=0.75, anchor="center")
        
        self.year_entry = ctk.CTkEntry(card, placeholder_text="Year (for students)", width=300, height=40, corner_radius=8)
        self.year_entry.place(relx=0.5, rely=0.85, anchor="center")
        
        ctk.CTkButton(card, text="Create Account", command=self.create_account, width=300, height=45, corner_radius=8).place(relx=0.5, rely=0.95, anchor="center")
        
    def create_account(self):
        username = self.username_entry.get().strip()
        name = self.name_entry.get().strip()
        password = self.password_entry.get()
        confirm_password = self.confirm_password_entry.get()
        role = self.role_var.get()
        
        # Validation
        if not all([username, name, password, confirm_password]):
            messagebox.showerror("Error", "Please fill in all required fields")
            return
            
        if password != confirm_password:
            messagebox.showerror("Error", "Passwords do not match")
            return
            
        if len(password) < 6:
            messagebox.showerror("Error", "Password must be at least 6 characters long")
            return
        
        try:
            if role == "teacher":
                success, message = self.controller.get_db().register_teacher(username, password, name)
                if success:
                    messagebox.showinfo("Success", "Teacher account created successfully! You can now log in.")
                    self.controller.show_frame("LoginPage")
                else:
                    messagebox.showerror("Error", message)
            else:  # student
                department = self.department_entry.get().strip()
                year = self.year_entry.get().strip()
                
                if not all([department, year]):
                    messagebox.showerror("Error", "Department and Year are required for students")
                    return
                
                # For student registration, we'll create a basic record without face encoding
                # Face encoding will be added later during the registration process
                import numpy as np
                dummy_encoding = np.zeros(128)  # Placeholder encoding
                
                success, message = self.controller.get_db().register_student(username, name, department, year, dummy_encoding)
                if success:
                    messagebox.showinfo("Success", "Student account created successfully! Please complete face registration and then log in.")
                    self.controller.show_frame("LoginPage")
                else:
                    messagebox.showerror("Error", message)
                    
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")