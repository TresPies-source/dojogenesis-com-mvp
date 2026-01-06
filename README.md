# DojoGenesis.com MVP

**Dojo Genesis helps you think by collecting perspectives before solutions. Bring a real situation. Add 3 lenses. Get a clean next move.**

A public web product built with ChatKit integration that guides users through structured thinking workflows using AI-powered perspective collection.

---

## Prerequisites

- **Node.js**: v20.x or higher (LTS recommended)
- **npm**: v10.x or higher
- **OpenAI API Key**: Required for ChatKit integration
  - Get your key from: https://platform.openai.com/api-keys
  - Must have access to ChatKit beta features

---

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dojogenesis-com-mvp-a61a
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

⚠️ **Security Note**: Never commit `.env.local` to version control. It's included in `.gitignore`.

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes | OpenAI API key with ChatKit access | `sk-proj-...` |

---

## Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server (requires build first)
npm run start

# Run ESLint
npm run lint

# Run Playwright end-to-end tests
npm run test:e2e
```

---

## Project Structure

```
dojogenesis-com-mvp/
├── app/
│   ├── api/
│   │   ├── chatkit/session/route.ts    # ChatKit session creation endpoint
│   │   └── widget-action/route.ts      # Widget action logging endpoint
│   ├── globals.css                     # Global styles and Tailwind directives
│   ├── layout.tsx                      # Root layout with metadata
│   └── page.tsx                        # Landing page
├── components/
│   ├── ui/                             # shadcn/ui components (Button, Card, etc.)
│   ├── ChatKitDemo.tsx                 # ChatKit integration component
│   ├── Hero.tsx                        # Hero section component
│   └── Footer.tsx                      # Footer component
├── lib/
│   ├── chatkit-actions.ts              # Widget action handlers and mapping
│   ├── device-id.ts                    # Device ID generation and persistence
│   └── utils.ts                        # Utility functions (cn, etc.)
├── docs/
│   ├── PRD_DOJOGENESIS_MVP.md          # Product Requirements Document
│   ├── TECH_SPEC_DOJOGENESIS_MVP.md    # Technical Specification
│   └── chatkit/                        # ChatKit widget specs and action maps
├── tests/
│   └── smoke.spec.ts                   # Playwright smoke tests
└── .env.example                        # Environment variables template
```

---

## Architecture Overview

### Client-Server Boundaries

- **Client-side**: React components, ChatKit UI, device ID management, widget action handling
- **Server-side**: ChatKit session creation, API key management, action logging

### ChatKit Integration Flow

1. User visits landing page
2. Client fetches or generates device ID (stored in localStorage)
3. Client requests session token from `/api/chatkit/session`
4. Server creates ChatKit session with OpenAI API (using workflow ID)
5. Server returns session token to client
6. Client initializes ChatKit UI with session token
7. User interacts with ChatKit widgets and chat interface

### Widget Actions

Widget buttons trigger predefined actions that map to chat prompts:

- **Start with a real situation**: Prompts user to describe their situation
- **Add 3 perspectives**: Guides user to add lens perspectives
- **Show me an example**: Provides an example workflow
- **I'm stuck—help me frame it**: Offers framing assistance
- **Generate a next move**: Creates actionable next steps
- **Pick an output**: Helps select output format

See `/docs/chatkit/ACTIONS_MAP.md` for full action-to-behavior mapping.

---

## Testing

### End-to-End Tests (Playwright)

Run automated smoke tests:

```bash
npm run test:e2e
```

**Tests include**:
- Page loads successfully
- Page title is correct
- Chat container mounts
- No critical console errors

### Manual Testing Checklist

- [ ] Landing page loads in < 3 seconds
- [ ] Hero section displays with correct copy
- [ ] ChatKit initializes and shows chat interface
- [ ] All 6 widget buttons trigger expected actions
- [ ] Error states display friendly messages
- [ ] Mobile responsive (test on iOS Safari, Android Chrome)
- [ ] Desktop works on Chrome, Firefox, Safari

---

## Deployment

### Deploy to Cloudflare Pages

**Quick Start:**

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `npm run pages:build`
   - **Build output**: `.vercel/output/static`
4. Add environment variable: `OPENAI_API_KEY`
5. Deploy

**📚 Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

**🔧 Build configuration reference**: See [BUILD_CONFIG.md](./BUILD_CONFIG.md)

**🌐 Custom domain setup**: See [CUSTOM_DOMAIN_SETUP.md](./CUSTOM_DOMAIN_SETUP.md)

---

## Security Best Practices

- ✅ API keys stored in environment variables only (never client-side)
- ✅ `.env.local` excluded from version control
- ✅ Server-side session creation (no direct ChatKit API calls from client)
- ✅ Device ID used instead of personal user data (no auth required in MVP)
- ⚠️ Rate limiting recommended for production (not implemented in MVP)

---

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 3.4
- **UI Components**: shadcn/ui + Radix UI primitives
- **ChatKit**: @openai/chatkit-react v1.4.0
- **Testing**: Playwright
- **Deployment**: Cloudflare Pages

---

## Key Features

- **ChatKit Integration**: OpenAI ChatKit workflow with custom widget actions
- **Device Tracking**: Persistent device ID for session continuity (no user auth)
- **Responsive Design**: Mobile-first, works on all devices
- **Widget Actions**: 6 interactive buttons for guided workflows
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Performance**: Optimized for fast load times (Lighthouse > 85 target)

---

## Troubleshooting

### ChatKit session fails to initialize

**Symptoms**: Error message "Failed to initialize chat session"

**Solutions**:
1. Verify `OPENAI_API_KEY` is set in `.env.local`
2. Check API key has ChatKit beta access
3. Check browser console for detailed error messages
4. Verify you have network connectivity to OpenAI API

### Build fails with TypeScript errors

**Solutions**:
1. Delete `.next` folder: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Reinstall dependencies: `npm install`
4. Run build again: `npm run build`

### Widget buttons don't work

**Solutions**:
1. Open browser DevTools console
2. Check for JavaScript errors
3. Verify ChatKit script loaded successfully
4. Check network tab for `/api/widget-action` requests

---

## Documentation Links

- **OpenAI ChatKit Guide**: https://platform.openai.com/docs/guides/chatkit
- **ChatKit Widgets**: https://platform.openai.com/docs/guides/chatkit-widgets
- **ChatKit Actions**: https://platform.openai.com/docs/guides/chatkit-actions
- **ChatKit API Reference**: https://platform.openai.com/docs/api-reference/chatkit
- **Widget Components**: https://widgets.chatkit.studio/components/button
- **Widget Icons**: https://widgets.chatkit.studio/icons

---

## Project Documentation

### Core Documentation
- **[Deployment Guide](./DEPLOYMENT.md)** - Complete deployment instructions for Cloudflare Pages
- **[Build Configuration](./BUILD_CONFIG.md)** - Build commands, environment variables, and configuration reference
- **[Custom Domain Setup](./CUSTOM_DOMAIN_SETUP.md)** - Configure custom domain with Cloudflare Pages

### Product & Technical Specs
- **Product Requirements**: [docs/PRD_DOJOGENESIS_MVP.md](./docs/PRD_DOJOGENESIS_MVP.md)
- **Technical Specification**: [docs/TECH_SPEC_DOJOGENESIS_MVP.md](./docs/TECH_SPEC_DOJOGENESIS_MVP.md)
- **Widget Specification**: [docs/chatkit/](./docs/chatkit/)
- **Actions Mapping**: [docs/chatkit/ACTIONS_MAP.md](./docs/chatkit/ACTIONS_MAP.md)

---

## Contributing

This is an MVP project. For bugs, feature requests, or questions:

1. Check existing documentation in `/docs`
2. Review implementation plan in `.zenflow/tasks/dojogenesis-com-mvp-a61a/plan.md`
3. Test locally before submitting changes
4. Ensure all tests pass: `npm run test:e2e`

---

## License

Private project. All rights reserved.

---

## Support

For questions or issues with this MVP, contact the development team or refer to the technical documentation in `/docs`.

**Status**: MVP In Development  
**Version**: 0.1.0  
**Last Updated**: 2026-01-06
