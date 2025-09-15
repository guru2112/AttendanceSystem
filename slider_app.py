import customtkinter as ctk
import time
import math

# --- UI & Animation Settings ---
ANIMATION_DURATION = 0.35
MENU_WIDTH_PERCENT = 0.4
BLUR_EFFECT_ALPHA = 0.5
MENU_BG = '#2c3e50'
BUTTON_BG = '#34495e'
BUTTON_HOVER_BG = '#4e657b'

ctk.set_appearance_mode("System")
ctk.set_default_color_theme("blue")

class SlidingMenuApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        self.title("CustomTkinter Smooth Menu")
        self.geometry("700x500")

        # --- Main Content Area ---
        self.main_frame = ctk.CTkFrame(self, fg_color='lightgray', corner_radius=0)
        self.main_frame.place(relx=0, rely=0, relwidth=1, relheight=1)
        ctk.CTkLabel(self.main_frame, text="Main Content Area", font=("Helvetica", 18)).pack(pady=50)

        # --- Menu Container (A single Toplevel for both overlay and menu) ---
        self.menu_container = ctk.CTkToplevel(self)
        self.menu_container.overrideredirect(True)
        self.menu_container.attributes('-alpha', 0.0) # Start fully transparent
        self.menu_container.bind("<Button-1>", self.on_overlay_click)
        self.menu_container.withdraw()

        # The container has a transparent part and a colored part (the menu)
        # We achieve this with a background frame for the blur and the menu frame on top
        blur_bg = ctk.CTkFrame(self.menu_container, fg_color="white", corner_radius=0)
        blur_bg.place(relx=0, rely=0, relwidth=1, relheight=1)

        # --- Hamburger Menu Button ---
        menu_button = ctk.CTkButton(self.main_frame, text="☰", font=("Arial", 28), width=40, height=40,
                                    fg_color='transparent', text_color='black', hover_color='gray90',
                                    command=self.toggle_menu)
        menu_button.place(x=10, y=10)

        # --- Sliding Menu Frame (now inside the container) ---
        self.menu_frame = ctk.CTkFrame(self.menu_container, fg_color=MENU_BG, corner_radius=0)
        
        # --- Menu Widgets ---
        ctk.CTkLabel(self.menu_frame, text="MENU", font=("Helvetica", 16, "bold")).pack(pady=20, padx=20)
        self.create_menu_button("Dashboard")
        self.create_menu_button("Analytics")
        self.create_menu_button("Settings")
        self.create_menu_button("Logout", command=self.quit, side='bottom')

        # --- State Variables ---
        self.is_menu_open = False
        self.is_animating = False
        
        self.bind("<Configure>", self.on_window_change)
        self.update_idletasks()
        self.update_container_geometry()

    def on_window_change(self, event):
        if self.is_menu_open or self.is_animating:
            self.update_container_geometry()

    def update_container_geometry(self):
        """Keeps the container window locked to the main window's position and size."""
        self.menu_container.geometry(f"{self.winfo_width()}x{self.winfo_height()}+{self.winfo_x()}+{self.winfo_y()}")

    def create_menu_button(self, text, command=None, side='top'):
        btn = ctk.CTkButton(self.menu_frame, text=text, font=("Helvetica", 12),
                            fg_color=BUTTON_BG, hover_color=BUTTON_HOVER_BG,
                            corner_radius=6, anchor="w", command=command)
        btn.pack(fill='x', padx=10, pady=5, side=side)

    def ease_in_out_cubic(self, t):
        return 4 * t * t * t if t < 0.5 else 1 - pow(-2 * t + 2, 3) / 2

    def toggle_menu(self):
        if self.is_animating: return
        self.is_animating = True
        self.animation_start_time = time.time()
        
        if self.is_menu_open:
            self.animate(is_opening=False)
        else:
            self.update_container_geometry()
            self.menu_container.deiconify()
            self.menu_container.lift()
            self.animate(is_opening=True)
        self.is_menu_open = not self.is_menu_open

    def on_overlay_click(self, event):
        # Close menu only if the click is outside the menu frame
        if self.is_menu_open and event.x < self.end_pos:
            self.toggle_menu()

    def animate(self, is_opening):
        elapsed_time = time.time() - self.animation_start_time
        progress = min(elapsed_time / ANIMATION_DURATION, 1.0)
        eased_progress = self.ease_in_out_cubic(progress)
        
        # Animate the menu frame's position WITHIN the container
        self.menu_width = int(self.winfo_width() * MENU_WIDTH_PERCENT)
        self.start_pos = self.winfo_width()
        self.end_pos = self.winfo_width() - self.menu_width
        
        start = self.start_pos if is_opening else self.end_pos
        end = self.end_pos if is_opening else self.start_pos

        current_x_offset = start + (end - start) * eased_progress
        self.menu_frame.place(x=current_x_offset, y=0, relheight=1.0, width=self.menu_width)

        # Animate the container's transparency
        alpha = BLUR_EFFECT_ALPHA * eased_progress if is_opening else BLUR_EFFECT_ALPHA * (1 - eased_progress)
        self.menu_container.attributes('-alpha', alpha)
        
        # Keep container locked to main window during animation
        self.update_container_geometry()

        if progress < 1.0:
            self.after(8, lambda: self.animate(is_opening))
        else:
            self.is_animating = False
            if not is_opening:
                self.menu_container.withdraw()

if __name__ == "__main__":
    app = SlidingMenuApp()
    app.mainloop()

