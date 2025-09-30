# CHW Mobile Demo - Deployment Instructions

## Overview
This is a fully functional Progressive Web App (PWA) demonstrating the Community Health Worker interface for the Nigeria Eye Health Digital Transformation platform.

## Features
- ✅ Offline-first capability (works without internet)
- ✅ Multi-language support (English, Hausa)
- ✅ Complete screening workflow (patient data → photo capture → AI analysis)
- ✅ Performance dashboard with leaderboard
- ✅ Training module tracking
- ✅ Online/offline toggle for demonstration
- ✅ Responsive design (4" to 6.5" screens)

## Quick Start (Local Testing)

### Option 1: Simple HTTP Server (Python)
```bash
cd demo
python -m http.server 8000
```
Then open: http://localhost:8000

### Option 2: Simple HTTP Server (Node.js)
```bash
cd demo
npx http-server -p 8000
```
Then open: http://localhost:8000

## Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd demo
vercel --prod
```

3. **Share the URL** with Dr. Oteri (e.g., `https://nigeria-eye-health-demo.vercel.app`)

## Deploy to Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Deploy:**
```bash
cd demo
netlify deploy --prod --dir .
```

3. **Copy the URL** and share

## Deploy to GitHub Pages

1. **Create a new GitHub repository**

2. **Push demo folder:**
```bash
cd demo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nigeria-eye-health-demo.git
git push -u origin main
```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch "main"
   - Folder: / (root)

4. **URL will be:** `https://YOUR_USERNAME.github.io/nigeria-eye-health-demo/`

## Demo Credentials

**Login:**
- Phone: 08012345678 (or any number)
- Password: demo123 (or any password)
- Language: English or Hausa

**Demo Features:**
- All data is simulated (no real backend)
- "Go Offline" button toggles online/offline mode
- Photo capture works on mobile devices
- AI analysis is simulated (2-3 second delay)

## Testing on Mobile Devices

### iOS (iPhone/iPad)
1. Open Safari and navigate to demo URL
2. Tap Share icon → "Add to Home Screen"
3. App will appear as standalone app
4. Open from home screen to test

### Android
1. Open Chrome and navigate to demo URL
2. Tap menu (⋮) → "Add to Home Screen"
3. Or Chrome will prompt to "Install App"
4. Open from app drawer to test

## Demo Script for Stakeholders

**"Let me show you how CHWs will use this platform..."**

1. **Login:** "CHWs login with their phone number. Interface available in English or Hausa."

2. **Dashboard:** "They see their performance stats, ranking, and screening targets."

3. **New Screening:** "To screen a patient, they tap 'New Screening'..."
   - Enter patient information
   - Capture photos of both eyes
   - AI analyzes images in 10-30 seconds
   - Results show possible conditions + referral recommendations

4. **Offline Mode:** "Toggle 'Go Offline' to show it works without internet. Data syncs when connected."

5. **Performance:** "CHWs track their progress, see leaderboard, and incentive tiers."

6. **Training:** "Training modules are built in, with certification tracking."

## Customization

### Change Language
- English/Hausa toggle in login screen
- To add more languages, edit `app.js` (search for "changeLanguage")

### Update Stats
- Demo shows 47 screenings, Rank #23, etc.
- Edit values in `index.html` or make dynamic in `app.js`

### Modify Branding
- Colors: Edit CSS variables in `styles.css` (`:root`)
- Logo: Update in `manifest.json` and header

## Technical Notes

**Files:**
- `index.html` - Main app structure
- `styles.css` - All styling (responsive, themed)
- `app.js` - App logic, state management, workflows
- `service-worker.js` - PWA offline capability
- `manifest.json` - PWA metadata

**Browser Support:**
- Chrome/Edge: ✅ Full support
- Safari (iOS): ✅ Full support
- Firefox: ✅ Full support
- Internet Explorer: ❌ Not supported (use Edge)

**Data Storage:**
- Uses localStorage (client-side only)
- Real app would sync to backend API
- Photos stored as base64 (for demo only, real app would compress/upload)

## Security Note

**This is a DEMO only.**
- No backend server
- No real patient data
- Not encrypted
- Not for production use

Real production app would include:
- 256-bit encryption
- Backend API authentication
- HTTPS only
- NDPA compliance
- Audit logging

## Support

For issues or questions about deployment:
- Email: daniel@centric.ai
- Include: Browser/device info, error messages, screenshots

## Next Steps

After demo approval:
1. Backend API development
2. Real AI integration
3. NHSRII data sync
4. Security hardening
5. Beta testing with 50 CHWs

---

**Demo Mode Watermark:** Red "DEMO MODE" badge visible at all times to prevent confusion with production system.