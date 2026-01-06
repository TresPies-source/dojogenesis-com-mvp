# DojoGenesis.com MVP - Product Requirements Document

## Executive Summary

DojoGenesis.com is the first public product surface for "Dojo Genesis"—an agent+workflow experience designed to help users think better by collecting perspectives before solutions. This MVP leverages OpenAI ChatKit to deliver an immediate, widget-driven experience that demonstrates the Dojo Protocol in action.

## Perspectives Collected

Before finalizing this PRD, the following perspectives were gathered:

- **Purpose**: Unlock ChatKit features as building tools
- **Purpose**: Say hello agent with a custom widget
- **Control**: Custom UI and more moving parts
- **Risk lens**: Middle ground approach
- **Stack lens**: Different than base44; testable/iterable; flashy/high quality/performance
- **Operational lens**: Ship on GitHub + at a domain ASAP
- **Convergence**: Dojo Genesis MVP; real product surface today; ideally with a widget

## Ecosystem Context

DojoGenesis.com exists within a broader ecosystem of interconnected products and experiences:

rollgoal.app, zenithscience.org, checkincentral.app, Zen Jar, Audio Desk Writer, Dojo Genesis + Protocol, Interbeing Double, CribJackJoker, Terpene Garden, aipromptpaster, Nonprofit Cooperative Studio, therapysupervision.org, Focus & Forge.

This MVP serves as the public-facing entry point to the Dojo Genesis methodology, bridging conceptual frameworks with practical, interactive tools.

## Goals

1. **Launch a public-facing product** at DojoGenesis.com that is immediately usable
2. **Demonstrate the Dojo Protocol** through a live, working ChatKit integration
3. **Onboard users with clarity** via a "Hello Agent" widget that explains the core value proposition
4. **Establish technical foundation** for rapid iteration using modern, testable stack
5. **Ship quickly** with high visual quality and performance

## Non-Goals (MVP)

- User authentication or persistent user accounts
- Backend database or data persistence
- Mobile app or native experiences
- Advanced analytics or user tracking beyond basic events
- Multi-language support
- Custom AI model training or fine-tuning
- Integration with external tools or APIs beyond ChatKit

## Target Personas

### Primary: The Thoughtful Decision-Maker
- Facing a real, nuanced situation requiring clarity
- Comfortable with technology but not necessarily technical
- Values structured thinking over quick answers
- Looking for tools that enhance their own thinking process

### Secondary: The Curious Explorer
- Interested in novel AI applications
- Wants to understand what makes Dojo Genesis different
- May become an advocate or early adopter

## Core Value Proposition

**"Dojo Genesis helps you think by collecting perspectives before solutions. Bring a real situation. Add 3 lenses. Get a clean next move."**

This copy must appear prominently on the landing page and in the onboarding widget.

## MVP Scope

### 1. Public Landing Page

- **Hero section** with clear value proposition
- **Live ChatKit demo** visible without scrolling on desktop
- **Minimal about section** explaining the Dojo Protocol concept
- **Clean, modern design** using TailwindCSS and shadcn/ui components
- **Fast load time** and responsive design

### 2. "Hello Agent" Onboarding Widget

The onboarding experience is delivered as a ChatKit widget with the following structure:

**Headline Copy:**
"Dojo Genesis helps you think by collecting perspectives before solutions. Bring a real situation. Add 3 lenses. Get a clean next move."

**Option A Buttons (no mode buttons):**
- Start with a real situation
- Add 3 perspectives
- Show me an example
- I'm stuck—help me frame it
- Generate a next move
- (Optional) Pick an output

Each button triggers a specific interaction pathway designed to guide users through the Dojo Protocol.

### 3. ChatKit Integration

- Use existing workflow ID: `wf_69504ca5bd048190a8e10c1486defe7a07130d0df37f6b51`
- Implement recommended ChatKit integration pattern (server-side session creation)
- Support widget-based interactions with custom action handlers
- Maintain stable user identity via deviceId (cookie or localStorage)

### 4. Privacy & Security Posture

- No user authentication in MVP (anonymous sessions)
- All API keys stored as environment variables
- No secrets exposed client-side
- Clear privacy statement acknowledging anonymous usage
- Basic rate limiting considerations documented (implementation optional in MVP)

### 5. Deployment

- **Repository**: GitHub (public or private TBD)
- **Domain**: DojoGenesis.com
- **Platform**: Vercel
- **Environment**: Production-ready with proper env var configuration

## Key User Flows

### Flow 1: First-Time Visitor
1. Land on DojoGenesis.com
2. Read hero copy and understand value proposition
3. See live chat interface with "Hello Agent" widget
4. Click "Show me an example" button
5. Observe demonstration of Dojo Protocol in action
6. Engage with their own situation

### Flow 2: Direct Engagement
1. Land on DojoGenesis.com
2. Immediately click "Start with a real situation"
3. Enter their situation in chat
4. Prompted to "Add 3 perspectives"
5. Provide perspectives through conversation
6. Receive "Generate a next move" prompt
7. Get actionable, perspective-informed guidance

### Flow 3: Stuck/Help Path
1. Land on DojoGenesis.com
2. Click "I'm stuck—help me frame it"
3. Guided through framing questions
4. Led to situation → perspectives → next move flow
5. Exit with clarity on how to use the tool

## Success Criteria

### Launch Success
- [ ] Site is live at DojoGenesis.com
- [ ] ChatKit demo loads and responds within 3 seconds
- [ ] All buttons in Hello Agent widget are functional
- [ ] No console errors on landing page
- [ ] Mobile responsive (breakpoints: 320px, 768px, 1024px)

### User Engagement (First 2 Weeks)
- At least 10 unique visitors complete a full interaction (situation → perspectives → next move)
- Average session duration > 2 minutes
- < 5% error rate on ChatKit session creation
- At least 3 users interact with "Show me an example" button

### Technical Health
- Lighthouse performance score > 85
- Zero security vulnerabilities in dependencies
- Successful Playwright smoke test on every deployment

## Analytics Events (Minimal)

Track the following events via simple logging (implementation TBD):

1. `page_view` - Landing page loaded
2. `chatkit_session_created` - Successful session initialization
3. `widget_action_clicked` - Any button in Hello Agent widget clicked (with action type)
4. `chat_message_sent` - User sends a message
5. `error_chatkit_session` - Session creation failed

Implementation note: Use console logging in MVP, prepare structure for future analytics integration.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| ChatKit API rate limits or downtime | High - Core functionality unavailable | Implement graceful error messaging; consider caching strategy for future |
| Slow ChatKit response times | Medium - Poor UX | Show loading states; optimize session creation |
| Users don't understand the value proposition | High - No engagement | A/B test copy; include "Show me an example" as default first action |
| Security: API keys leaked | Critical | Code review; .gitignore enforcement; env var validation in CI |
| Domain/deployment issues | Medium - Launch delay | Set up Vercel + domain early; dry-run deployment |

## Phased Roadmap

### MVP (This Release)
- Public landing page
- ChatKit integration with Hello Agent widget
- Anonymous sessions (deviceId-based)
- Basic error handling
- Deployment to DojoGenesis.com

### V1 (Post-MVP)
- User accounts and session persistence
- Usage analytics dashboard
- Customizable perspective templates
- Output formatting options (PDF, markdown export)
- Shareable session links
- Improved error recovery and retry logic

### V2 (Future)
- Multi-workflow support (beyond single workflow ID)
- Integration with other Dojo Protocol tools
- Community-contributed perspective templates
- API for third-party integrations

## Definition of Done (MVP)

- [ ] Landing page deployed at DojoGenesis.com
- [ ] ChatKit integration functional with workflow `wf_69504ca5bd048190a8e10c1486defe7a07130d0df37f6b51`
- [ ] Hello Agent widget displays with all 6 buttons
- [ ] Each button triggers appropriate interaction
- [ ] DeviceId stored and passed to ChatKit sessions
- [ ] No API keys or secrets in repository
- [ ] .env.example file created with required variables
- [ ] One Playwright smoke test passes
- [ ] README with setup and deployment instructions
- [ ] Vercel deployment configuration complete
- [ ] Custom domain DojoGenesis.com connected
- [ ] Mobile responsive design verified on 3 devices/sizes
- [ ] Error states tested (network failure, session creation failure)
- [ ] Privacy statement visible on site
- [ ] Code reviewed and approved
- [ ] Performance: Lighthouse score > 85

## References

- https://platform.openai.com/docs/guides/chatkit
- https://platform.openai.com/docs/guides/chatkit-widgets
- https://widgets.chatkit.studio/icons
- https://widgets.chatkit.studio/components/button
- https://platform.openai.com/docs/api-reference/chatkit

---

**Document Status**: Draft for MVP Implementation  
**Last Updated**: 2026-01-06  
**Owner**: Product/Engineering
