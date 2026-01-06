# Technical Specification: Container Size Preferences

## Complexity Assessment
**Level**: Medium

This task requires:
- Client-side state management for size preferences
- UI controls for cycling between container sizes
- LocalStorage integration for persistence
- Responsive design considerations
- Testing across multiple viewport sizes

## Technical Context

### Technology Stack
- **Framework**: Next.js 15.1.4
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI with shadcn/ui pattern
- **State**: React hooks (useState, useEffect)

### Current Architecture
- Main page: `app/page.tsx` - renders Hero, ChatKitDemo, and Footer
- Demo component: `components/ChatKitDemo.tsx` - the ChatKit interface
- Container: Currently wrapped in `max-w-5xl` (1024px max width)
- Layout: Responsive with mobile-first design using Tailwind breakpoints

## Implementation Approach

### Container Size Options
Define 4 cyclable container sizes:
1. **Mobile** (320px - 375px width): Simulates mobile device view
2. **Tablet** (768px width): Simulates tablet view  
3. **Desktop** (1024px - max-w-5xl): Current default, comfortable desktop view
4. **Fullscreen** (100% width): Maximum available space

### Architecture Pattern
Follow the existing component patterns:
- Client component with `'use client'` directive
- Hooks for state management
- Tailwind for responsive styling
- TypeScript for type safety

### Key Components

#### 1. Size Preference State Management
- Create custom hook or use React state in parent component
- Store preference in localStorage with key: `chatkit-demo-size-preference`
- Default to "Desktop" on first visit
- Restore preference on page load

#### 2. Size Selector UI Component
Location: Between Hero and ChatKitDemo in `app/page.tsx`

Design:
- Compact button group or cycle button
- Shows current size mode
- Click to cycle through sizes: Mobile → Tablet → Desktop → Fullscreen → Mobile
- Visual indicators (icons + labels)
- Accessible with keyboard navigation
- Positioned above the demo container

Icons/Labels:
- Mobile: 📱 "Mobile" or smartphone icon
- Tablet: 📱 "Tablet" or tablet icon  
- Desktop: 💻 "Desktop" or monitor icon
- Fullscreen: ⛶ "Fullscreen" or expand icon

#### 3. Dynamic Container Styling
Apply conditional classes to the ChatKitDemo wrapper based on selected size:

```typescript
const sizeClasses = {
  mobile: 'max-w-[375px]',
  tablet: 'max-w-[768px]',  
  desktop: 'max-w-5xl', // 1024px
  fullscreen: 'max-w-full'
}
```

Ensure centered layout with `mx-auto` for non-fullscreen modes.

## Source Code Changes

### Files to Create
1. **`components/ContainerSizeSelector.tsx`** (new)
   - Client component for size selection UI
   - Exports the selector button/toggle
   - Emits size change events to parent

2. **`lib/use-container-size.ts`** (new)  
   - Custom React hook for managing size preference
   - Handles localStorage read/write
   - Returns current size and setter function
   - Type definitions for size options

### Files to Modify
1. **`app/page.tsx`**
   - Import and add `ContainerSizeSelector` component
   - Import and use `useContainerSize` hook
   - Apply dynamic container classes to ChatKitDemo wrapper
   - Update layout to accommodate size selector

2. **`components/ChatKitDemo.tsx`** (optional)
   - May need to accept a `containerSize` prop for responsive adjustments
   - Or rely purely on CSS container queries/parent classes

## Data Model / Interface Changes

### Type Definitions
```typescript
// lib/use-container-size.ts
export type ContainerSize = 'mobile' | 'tablet' | 'desktop' | 'fullscreen';

export interface ContainerSizeState {
  size: ContainerSize;
  setSize: (size: ContainerSize) => void;
  cycleSize: () => void;
}
```

### localStorage Schema
```typescript
// Key: 'chatkit-demo-size-preference'
// Value: ContainerSize ('mobile' | 'tablet' | 'desktop' | 'fullscreen')
// Default: 'desktop'
```

## Verification Approach

### Manual Testing
1. Load the page - should default to Desktop size (or last saved preference)
2. Click size selector - should cycle through all 4 sizes
3. Refresh page - should persist selected size
4. Test on different viewport sizes - ensure responsive behavior still works
5. Test keyboard navigation - selector should be accessible
6. Clear localStorage - should reset to Desktop default

### Automated Testing
Run existing test suite:
```bash
npm run test:e2e
```

Update `tests/smoke.spec.ts` if needed to verify:
- Size selector is visible
- Clicking cycles through sizes
- Demo container changes width appropriately

### Code Quality
Run lint and type checking:
```bash
npm run lint
npm run build
```

Ensure:
- No TypeScript errors
- No linting errors  
- Build completes successfully

## Edge Cases & Considerations

1. **SSR Compatibility**: Use client component with useEffect to avoid hydration mismatches
2. **Mobile Responsiveness**: When viewport is smaller than selected size, container should adapt
3. **localStorage Availability**: Handle cases where localStorage is blocked/unavailable
4. **Accessibility**: Ensure size selector works with keyboard and screen readers
5. **Visual Feedback**: Provide clear indication of current size mode

## Merge Strategy

After implementation and verification:
1. Ensure all tests pass
2. Run lint and build successfully  
3. Commit changes with descriptive message
4. Merge to main branch as requested
