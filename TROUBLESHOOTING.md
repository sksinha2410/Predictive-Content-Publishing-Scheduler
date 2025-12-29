# 🔧 Troubleshooting Guide

Common issues and their solutions for the Predictive Content Publishing Scheduler.

## Installation Issues

### Problem: npm install fails
```
Error: EACCES: permission denied
```

**Solution:**
```bash
# Don't use sudo. Instead, configure npm to use a different directory:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Then retry installation
npm install
```

### Problem: Package compatibility warnings
```
npm WARN deprecated package@version
```

**Solution:**
These warnings are generally safe to ignore. The application uses compatible versions.

## Backend Issues

### Problem: MongoDB connection fails
```
MongoDB connection error: MongoServerError: bad auth
```

**Solution:**
1. Check your MongoDB URI in `backend/.env`
2. Verify username and password are correct
3. Ensure database user has proper permissions
4. For MongoDB Atlas, whitelist your IP address (0.0.0.0/0 for testing)

### Problem: Server won't start
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use a different port in backend/.env
PORT=5001
```

### Problem: OpenAI API errors
```
Error: 401 Unauthorized
```

**Solution:**
1. Verify `OPENAI_API_KEY` in `backend/.env`
2. Check API key is valid at https://platform.openai.com/api-keys
3. Ensure your OpenAI account has available credits
4. Check for typos in the API key

### Problem: Seed script fails
```
Error: Cannot find module 'dotenv'
```

**Solution:**
```bash
cd backend
npm install
node seed.js
```

## Frontend Issues

### Problem: React app won't start
```
Error: Cannot find module 'react-scripts'
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problem: Module not found errors
```
Module not found: Can't resolve '@fullcalendar/react'
```

**Solution:**
```bash
cd frontend
npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

### Problem: Blank page after build
```
White screen, no errors in console
```

**Solution:**
1. Check browser console for errors
2. Verify API URL in `.env` is correct
3. Ensure backend is running
4. Clear browser cache and reload

### Problem: CORS errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Ensure backend server is running
2. Verify CORS is enabled in `backend/server.js`
3. Check frontend is making requests to correct URL
4. For production, configure CORS with specific origins

## API Issues

### Problem: 404 Not Found
```
GET http://localhost:5000/api/posts 404
```

**Solution:**
1. Verify backend server is running on port 5000
2. Check route is correctly defined in `backend/routes/`
3. Ensure route is registered in `server.js`
4. Test with curl: `curl http://localhost:5000/api/posts`

### Problem: 500 Internal Server Error
```
POST http://localhost:5000/api/posts 500
```

**Solution:**
1. Check backend console for error details
2. Verify request body is valid JSON
3. Ensure required fields are provided
4. Check MongoDB connection is active

### Problem: AI endpoints timeout
```
Error: timeout of 30000ms exceeded
```

**Solution:**
1. OpenAI API can be slow, increase timeout if needed
2. Check your internet connection
3. Verify OpenAI service status
4. Try with simpler/shorter content

## Calendar Issues

### Problem: Calendar not rendering
```
Calendar appears blank or shows no events
```

**Solution:**
1. Check browser console for errors
2. Verify posts are being fetched (check Network tab)
3. Ensure posts have valid date fields
4. Check FullCalendar CSS is loaded

### Problem: Drag-and-drop not working
```
Events don't move when dragged
```

**Solution:**
1. Verify `editable={true}` in Calendar component
2. Check `eventDrop` handler is defined
3. Ensure no JavaScript errors in console
4. Test on different browser

### Problem: Events show wrong times
```
Events appear at incorrect times
```

**Solution:**
1. Check date format in database
2. Verify timezone settings
3. Use ISO 8601 format for dates
4. Consider user timezone vs server timezone

## Data Issues

### Problem: No posts appear
```
Empty post list and calendar
```

**Solution:**
```bash
# Re-seed the database
cd backend
node seed.js
```

### Problem: Engagement metrics show 0
```
All metrics display as 0
```

**Solution:**
1. Check if posts are marked as 'published'
2. Verify `publishedTime` is set
3. Check `engagementMetrics` object exists
4. Re-run seed script for sample data

### Problem: Analytics charts empty
```
Charts render but show no data
```

**Solution:**
1. Ensure you have published posts
2. Check posts have `publishedTime` set
3. Verify engagement metrics are populated
4. Check browser console for calculation errors

## AI Feature Issues

### Problem: Headlines not generating
```
"Failed to generate headlines" error
```

**Solution:**
1. Verify OpenAI API key is configured
2. Check you have available API credits
3. Ensure content is not empty
4. Check content length (too short might fail)
5. Review backend console for detailed error

### Problem: Best time predictions inaccurate
```
Shows only default recommendations
```

**Solution:**
1. Ensure you have at least 5 published posts
2. Check posts have proper `publishedTime`
3. Verify engagement metrics are populated
4. More historical data = better predictions

### Problem: AI confidence always "low"
```
Confidence level never improves
```

**Solution:**
1. Add more published posts (15+ recommended)
2. Ensure varied publishing times
3. Check engagement metrics are realistic
4. Review OpenAI response in backend logs

## Build & Deployment Issues

### Problem: Production build fails
```
npm run build fails with errors
```

**Solution:**
```bash
cd frontend
# Clear cache and rebuild
rm -rf node_modules build
npm install
npm run build
```

### Problem: Environment variables not working
```
Variables show as undefined
```

**Solution:**
1. Frontend: Variable names must start with `REACT_APP_`
2. Restart development server after changing .env
3. Don't commit actual .env files to git
4. Use .env.example as template

### Problem: Large bundle size
```
Build succeeds but bundle is very large
```

**Solution:**
1. Use production build: `npm run build`
2. Consider code splitting
3. Lazy load components
4. Optimize images and assets

## Database Issues

### Problem: Duplicate posts after seeding
```
Running seed.js multiple times creates duplicates
```

**Solution:**
The seed script clears existing posts first. If you see duplicates:
```bash
# Connect to MongoDB and clear manually
mongosh
use content-scheduler
db.posts.deleteMany({})
exit

# Then re-seed
node seed.js
```

### Problem: Cannot connect to local MongoDB
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Start MongoDB service:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

2. Or use MongoDB Atlas (cloud) instead

### Problem: Mongoose validation errors
```
ValidationError: Post validation failed
```

**Solution:**
1. Check required fields are provided
2. Verify data types match schema
3. Review error message for specific field
4. Check enum values for status field

## Performance Issues

### Problem: Slow API responses
```
Requests take several seconds
```

**Solution:**
1. Check MongoDB connection
2. Add database indexes for frequently queried fields
3. Reduce data payload (pagination)
4. Check network connection
5. Monitor MongoDB performance

### Problem: Frontend feels sluggish
```
UI is slow or unresponsive
```

**Solution:**
1. Check browser console for errors
2. Reduce number of posts displayed
3. Implement pagination
4. Optimize re-renders with React.memo
5. Check for memory leaks

## Browser Issues

### Problem: Works in Chrome but not Safari
```
Features work differently across browsers
```

**Solution:**
1. Clear browser cache
2. Check browser console for specific errors
3. Update to latest browser version
4. Test with different browsers
5. Check for CSS compatibility issues

### Problem: Calendar doesn't display on mobile
```
Calendar appears broken on phone
```

**Solution:**
1. Check responsive styles
2. Test with browser dev tools mobile view
3. Verify FullCalendar responsive settings
4. Check viewport meta tag in index.html

## Still Having Issues?

If you've tried the above solutions and still have problems:

1. **Check Logs**
   - Backend: Check terminal where server is running
   - Frontend: Check browser console (F12)
   - MongoDB: Check MongoDB logs

2. **Search Issues**
   - Check GitHub issues in repository
   - Search Stack Overflow
   - Check library documentation

3. **Create an Issue**
   - Provide error message
   - Include steps to reproduce
   - Share environment details
   - Include relevant code snippets

4. **Community Help**
   - Ask in project discussions
   - Reach out to maintainers
   - Check documentation thoroughly

## Debug Mode

Enable detailed logging:

**Backend:**
```javascript
// In server.js, add:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend:**
```javascript
// In api.js, add:
api.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

api.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});
```

## Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check running processes
lsof -i :5000
lsof -i :3000

# Test MongoDB connection
mongosh "your-mongodb-uri"

# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# View all npm scripts
npm run
```

## Prevention Tips

1. **Regular Updates**: Keep dependencies updated
2. **Version Control**: Commit working code frequently
3. **Environment Files**: Always use .env for configuration
4. **Error Handling**: Add try-catch blocks
5. **Testing**: Test after each change
6. **Documentation**: Read error messages carefully
7. **Backups**: Keep database backups

Remember: Most issues have simple solutions. Check the basics first!
