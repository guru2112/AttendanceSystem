import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://Kamlesh-21:Guru2004@attendencesystem.nlapsic.mongodb.net/?retryWrites=true&w=majority&appName=Attendencesystem")

# API configuration
API_HOST = "0.0.0.0"
API_PORT = 8000
DEBUG = True

# File upload configuration
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}