# 🚀 Deployment Guide - Attendance System

## Quick Start (Development)

### Prerequisites
- Python 3.8+ installed
- Node.js 14+ installed  
- MongoDB Atlas connection (URI in config.py)

### Start Backend
```bash
cd /path/to/AttendanceSystem
python simple_app.py
```
✅ Backend runs on: http://localhost:8000

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend runs on: http://localhost:3000

### Demo Login
- **Teacher:** `teacher` / `teacher123`
- **Student:** `student1` / `student1`

---

## Production Deployment

### Backend (FastAPI) Deployment

#### Option 1: Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Option 2: Direct Server Deployment
```bash
# Install dependencies
pip install -r requirements.txt

# Production server with Gunicorn
pip install gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Next.js) Deployment

#### Option 1: Vercel (Recommended)
```bash
cd frontend
npm install -g vercel
vercel
```

#### Option 2: Static Export
```bash
cd frontend
npm run build
npm run export
# Deploy 'out' folder to any static hosting
```

#### Option 3: Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --only=production

COPY frontend/ .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

## Environment Configuration

### Backend Environment Variables
```bash
# .env file
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGINS=https://your-frontend-domain.com
```

### Frontend Environment Variables
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

## Security Checklist for Production

### Backend Security
- [ ] Change JWT secret key from default
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS with SSL certificates
- [ ] Implement rate limiting
- [ ] Add request size limits
- [ ] Validate all inputs
- [ ] Use secure headers

### Frontend Security  
- [ ] Update API base URL for production
- [ ] Enable HTTPS
- [ ] Add content security policy (CSP)
- [ ] Validate all user inputs
- [ ] Sanitize file uploads

### Database Security
- [ ] Whitelist only production IPs in MongoDB Atlas
- [ ] Use strong database credentials
- [ ] Enable MongoDB encryption at rest
- [ ] Regular security updates

---

## Monitoring & Maintenance

### Health Checks
- Backend: `GET /health`
- Frontend: Monitor Next.js build status
- Database: MongoDB Atlas monitoring

### Logging
```python
# Add to app.py for production logging
import logging
logging.basicConfig(level=logging.INFO)
```

### Performance Optimization
- Use CDN for static assets
- Enable Gzip compression
- Database indexing on frequently queried fields
- Image optimization for face uploads

---

## Scaling Considerations

### Horizontal Scaling
- Load balancer for multiple backend instances
- Redis for session management
- CDN for global content delivery

### Database Scaling
- MongoDB replica sets for high availability
- Database sharding for large datasets
- Connection pooling

### Face Recognition Optimization
- GPU acceleration for face processing
- Async processing for batch operations
- Image compression and caching

---

## Troubleshooting

### Common Issues

1. **CORS Errors**
   ```python
   # Update CORS origins in app.py
   allow_origins=["https://your-domain.com"]
   ```

2. **Database Connection**
   ```bash
   # Test MongoDB connection
   python -c "from database import Database; db = Database()"
   ```

3. **Face Recognition Performance**
   ```bash
   # Install optimized packages
   pip install dlib --install-option="--yes-use-cuda"
   ```

4. **Memory Issues**
   ```python
   # Optimize face recognition memory usage
   # Process images in batches
   # Clear unused variables
   ```

### Debug Commands
```bash
# Check backend status
curl http://localhost:8000/health

# Check frontend build
cd frontend && npm run build

# Test API endpoints
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teacher","password":"teacher123"}'
```

---

## Support & Maintenance

### Regular Updates
- Security patches for dependencies
- MongoDB driver updates
- Next.js framework updates
- Face recognition library updates

### Backup Strategy
- Daily MongoDB backups
- Code repository backups
- Configuration backups

### Performance Monitoring
- API response times
- Database query performance
- Frontend load times
- Face recognition accuracy

For technical support, check the main README.md or create an issue in the repository.