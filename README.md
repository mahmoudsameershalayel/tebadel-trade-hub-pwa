
# Tebadel - Barter Exchange Platform PWA

A modern Progressive Web Application for bartering items without money. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🚀 Core Features
- **User Authentication**: JWT-based login/register system
- **Item Management**: Post, edit, and delete items with image upload
- **Trade System**: Send, receive, accept, and reject trade offers
- **Real-time Messaging**: Chat system for accepted trades
- **Search & Filter**: Advanced filtering by category, location, and condition
- **Subscription Plans**: Free, Premium, and Pro tiers
- **Admin Panel**: Manage users, reports, and system settings

### 📱 PWA Features
- **Offline Support**: Service worker caching for offline usage
- **Installable**: Can be installed on mobile devices and desktop
- **Responsive Design**: Mobile-first approach with perfect mobile UX
- **Push Notifications**: Real-time notifications for trades and messages
- **Background Sync**: Sync data when connection is restored

### 🌍 Internationalization
- **RTL/LTR Support**: Full Arabic and English language support
- **Language Toggle**: Easy switching between languages
- **Localized Content**: All UI elements translated

### 🎨 Modern UI/UX
- **Tailwind CSS**: Modern, responsive design system
- **Smooth Animations**: Engaging micro-interactions
- **Dark/Light Mode**: Automatic theme detection
- **Touch-Friendly**: Optimized for mobile interactions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context API + TanStack Query
- **Routing**: React Router v6
- **PWA**: Workbox + Web App Manifest
- **Icons**: Lucide React
- **Notifications**: Sonner toasts

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Items/          # Item-related components
│   ├── Layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── LanguageContext.tsx # i18n state
├── pages/              # Page components
├── hooks/              # Custom hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with PWA support

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tebadel-pwa
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:8080 in your browser

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### PWA Testing

1. Build the project for production
2. Serve the built files using a static server:
```bash
npm install -g serve
serve -s dist
```
3. Open Chrome DevTools > Application > Service Workers to verify SW registration
4. Use the Lighthouse PWA audit to check PWA compliance

## Development Guidelines

### Adding New Features
1. Create feature branches from `main`
2. Follow the component structure in `src/components/`
3. Add proper TypeScript types
4. Include responsive design for mobile
5. Add appropriate translations for both languages

### PWA Best Practices
- Keep the app shell minimal for fast loading
- Cache critical resources in the service worker
- Implement proper offline fallbacks
- Test on actual mobile devices
- Ensure touch targets are at least 44px

### Performance Optimization
- Use React.lazy() for code splitting
- Optimize images and use modern formats
- Implement proper caching strategies
- Monitor Core Web Vitals

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main

### Netlify
1. Connect repository to Netlify
2. Set build command to `npm run build`
3. Set publish directory to `dist`
4. Enable HTTPS for PWA requirements

### Custom Server
1. Build the project: `npm run build`
2. Serve the `dist/` directory with HTTPS
3. Configure proper headers for PWA files

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

Built with ❤️ for the bartering community
