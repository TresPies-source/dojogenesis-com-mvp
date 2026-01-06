# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: f878f64a-b1aa-48f4-91da-04e785e9efda -->

Assess the task's difficulty, as underestimating it leads to poor outcomes.
- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:
- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `{@artifacts_path}/spec.md`:
- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Save to `{@artifacts_path}/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [x] Step: Create Container Size Hook
<!-- chat-id: 0687ba07-ab7b-47d7-acee-997fb96cfdd8 -->

Create `lib/use-container-size.ts` with:
- Type definitions for ContainerSize
- Custom hook that manages size state
- localStorage persistence logic
- cycleSize function to rotate through sizes
- Proper SSR handling with useEffect

**Verification**: TypeScript compiles without errors, hook exports correct types and functions.

---

### [x] Step: Create Container Size Selector Component
<!-- chat-id: b617d525-f994-4780-aa77-efd83da79c96 -->

Create `components/ContainerSizeSelector.tsx` with:
- Client component directive
- Button UI to display and cycle through sizes
- Visual indicators (icons/text) for each size
- Uses the useContainerSize hook
- Accessible keyboard navigation
- Follows existing UI patterns (shadcn/ui Button component)

**Verification**: Component renders correctly, button cycles through all 4 sizes.

---

### [x] Step: Integrate Size Selector into Main Page
<!-- chat-id: ea6df68a-b781-4f17-8dbc-4ac8b45743be -->

Modify `app/page.tsx` to:
- Import ContainerSizeSelector and useContainerSize
- Add size selector UI above ChatKitDemo
- Apply dynamic container classes based on selected size
- Ensure proper layout and styling
- Make page a client component

**Verification**: Size selector appears on page, clicking changes demo container width visually.

---

### [x] Step: Test and Verify Implementation
<!-- chat-id: a630bbfb-a07c-44bd-a79b-71064d42ffff -->

1. Run lint and type checking: `npm run lint` and `npm run build`
2. Test all size modes (Mobile, Tablet, Desktop, Fullscreen)
3. Test localStorage persistence (refresh page)
4. Test responsive behavior on different viewports
5. Test keyboard accessibility
6. Run e2e tests if applicable: `npm run test:e2e`

**Verification**: All tests pass, no lint errors, feature works as expected.

---

### [ ] Step: Write Implementation Report

Create `{@artifacts_path}/report.md` documenting:
- What was implemented
- How the solution was tested
- Any challenges or decisions made
- Screenshots or descriptions of the feature in action

---

### [ ] Step: Merge to Main

After all verification passes:
1. Review all changes
2. Commit changes with descriptive message
3. Merge to main branch as requested

**Verification**: Changes successfully merged to main.
