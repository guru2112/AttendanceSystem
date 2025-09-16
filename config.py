# config.py

import os

# Get MongoDB URI from environment variables (repository secrets)
# Fallback to hardcoded URI for development if environment variable is not set
MONGO_URI = os.getenv('MONGO_URI', "mongodb+srv://Kamlesh-21:Guru2004@attendencesystem.nlapsic.mongodb.net/?retryWrites=true&w=majority&appName=Attendencesystem")
