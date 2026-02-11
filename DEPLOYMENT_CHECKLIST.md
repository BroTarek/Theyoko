# Deployment Checklist for Vercel

## ✅ Pre-Deployment Verification

### File Structure
- [x] All files use kebab-case naming (no PascalCase/camelCase files)
- [x] No duplicate folders (src-backup, src removed)
- [x] No misplaced files in root directory
- [x] Proper Next.js App Router structure
- [x] Components organized by feature/functionality

### Naming Conventions
- [x] Fixed typo: ~~RefferalSourceSelect~~ → `referral-source-select.tsx`
- [x] All component files: kebab-case.tsx
- [x] All folder names: kebab-case/
- [x] No uppercase letters in file/folder names
- [x] Consistent naming across all files

### Configuration Files
- [x] `tsconfig.json` updated with correct paths (`@/*` → `./\*`)
- [x] `package.json` has correct scripts
- [x] `next.config.ts` is properly configured
- [x] `app/layout.tsx` uses updated import paths

### Import Paths
- [x] All imports use `@/` alias
- [x] No relative imports like `../../../`
- [x] Barrel exports created for easy imports
- [x] Updated all component imports in layout.tsx and page.tsx

### Code Quality
- [x] No duplicate code
- [x] Components follow single responsibility
- [x] TypeScript types defined
- [x] Constants extracted to centralized file
- [x] Proper component exports

## 🚀 Deployment Steps

### 1. Final Build Test
```bash
npm run build
```
Expected: Build succeeds without errors

### 2. Check Build Output
- Verify no warnings about missing modules
- Ensure all routes are generated
- Check bundle sizes are reasonable

### 3. Test Production Locally
```bash
npm run build
npm start
```
- Verify app runs on http://localhost:3000
- Test wizard form functionality
- Check all navigation routes
- Verify responsive design

### 4. Deploy to Vercel

#### Option A: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: GitHub Integration
1. Push to GitHub repository
2. Import project in Vercel dashboard
3. Connect repository
4. Deploy automatically

### 5. Environment Variables (if needed)
Add these in Vercel dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` (if using external API)
- Any other environment-specific variables

### 6. Build & Output Settings
Vercel should auto-detect Next.js. Verify:
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## 🔍 Post-Deployment Checks

### Functionality
- [ ] Homepage loads correctly
- [ ] Wizard form displays all 6 steps
- [ ] Step navigation works (Next/Back buttons)
- [ ] Form fields are interactive
- [ ] Select components work (Position, Country, etc.)
- [ ] Mobile navigation drawer works
- [ ] Dashboard page accessible
- [ ] Topics page accessible

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] No console errors
- [ ] Images load properly

### Responsive Design
- [ ] Mobile (375px) - works correctly
- [ ] Tablet (768px) - works correctly
- [ ] Desktop (1440px) - works correctly
- [ ] Navigation adapts to screen size

### SEO
- [ ] Page titles are set
- [ ] Meta descriptions present
- [ ] Proper heading hierarchy
- [ ] Alt text on images

## ⚙️ Vercel-Specific Settings

### Build Settings
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x (or latest LTS)
```

### Performance Settings
- [ ] Enable Edge Functions (if needed)
- [ ] Configure caching headers
- [ ] Enable Image Optimization
- [ ] Set up redirects (if needed)

### Domain Settings
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] DNS properly configured

## 🐛 Common Issues & Solutions

### Issue: Module Not Found
**Solution**: 
- Check `tsconfig.json` paths
- Verify all imports use `@/` alias
- Ensure file names match imports exactly (case-sensitive)

### Issue: Build Fails
**Solution**:
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all dependencies are in `package.json`

### Issue: Page Not Found (404)
**Solution**:
- Verify file is in correct location (`app/` directory)
- Check file naming: `page.tsx` for routes
- Ensure proper folder structure

### Issue: Styles Not Loading
**Solution**:
- Check `globals.css` is imported in `app/layout.tsx`
- Verify Tailwind config
- Check CSS module imports

### Issue: Components Not Rendering
**Solution**:
- Check component exports (default vs named)
- Verify import statements
- Check for 'use client' directive if needed

## 📋 Pre-Push Checklist

Before pushing to production:

- [ ] All console.logs removed
- [ ] No debug code left in
- [ ] Comments are clear and helpful
- [ ] Dead code removed
- [ ] .env.example created (if using env vars)
- [ ] README.md updated
- [ ] CHANGELOG.md updated (if applicable)

## 🔐 Security Checks

- [ ] No API keys in code
- [ ] Environment variables properly configured
- [ ] No sensitive data in client-side code
- [ ] CORS properly configured (if using API)
- [ ] Input validation in place

## 📊 Performance Optimization

- [ ] Images optimized (WebP format when possible)
- [ ] Lazy loading implemented
- [ ] Code splitting in place (Next.js does this automatically)
- [ ] Minimal bundle size
- [ ] No unnecessary dependencies

## 🎉 Launch Checklist

Final steps before announcing:

- [ ] All team members have tested
- [ ] Documentation is complete
- [ ] Analytics configured (if needed)
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Backup/rollback plan ready
- [ ] Support channels ready


---

## 🚦 Status

**Current Status**: ✅ **READY FOR DEPLOYMENT**

All prerequisites met:
- ✅ Structure reorganized
- ✅ Components separated
- ✅ Naming conventions fixed
- ✅ TypeScript types added
- ✅ Constants extracted
- ✅ Configuration updated
- ✅ Documentation complete
- ✅ Dev server running successfully

**Next Action**: Deploy to Vercel! 🚀

---

## 📞 Support Resources

- [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Troubleshooting Guide](https://vercel.com/docs/deployments/troubleshoot)

---

**Last Updated**: 2026-02-08
**Restructuring by**: Antigravity AI
