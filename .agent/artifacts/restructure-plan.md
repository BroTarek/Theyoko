# Modern UI App Restructuring Plan

## Objectives
1. Break down monolithic page.tsx into smaller, reusable components
2. Organize folder structure following Next.js best practices
3. Fix naming inconsistencies for Vercel deployment compatibility
4. Separate concerns (UI, logic, data, types)

## Current Issues
- ✗ 493-line page.tsx with all form steps inline
- ✗ Files in wrong locations (PositionSelect.tsx at root)
- ✗ Inconsistent naming (RefferalSourceSelect - typo)
- ✗ Mixed component organization
- ✗ Duplicate folders (src, src-backup)
- ✗ No type definitions
- ✗ Hard-coded data in components

## New Structure

```
d:\modern-ui\
├── app/
│   ├── (routes)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   └── topics/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx (Main application form - refactored)
│   └── globals.css
├── components/
│   ├── forms/
│   │   ├── wizard-form/
│   │   │   ├── wizard-form.tsx (Main component)
│   │   │   ├── wizard-header.tsx
│   │   │   ├── wizard-progress.tsx
│   │   │   ├── wizard-navigation.tsx
│   │   │   └── steps/
│   │   │       ├── basic-info-step.tsx
│   │   │       ├── account-setup-step.tsx
│   │   │       ├── experience-step.tsx
│   │   │       ├── about-me-step.tsx
│   │   │       ├── documents-step.tsx
│   │   │       └── review-step.tsx
│   │   └── form-fields/
│   │       ├── position-select.tsx
│   │       ├── country-select.tsx
│   │       ├── country-phone-select.tsx
│   │       ├── referral-source-select.tsx
│   │       ├── field-selector.tsx
│   │       └── experience-form.tsx
│   ├── dashboard/
│   │   └── overview-charts.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── data-tables/
│   │   └── data-table.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── ... (all shadcn components)
├── lib/
│   ├── utils.ts
│   ├── constants.ts (Move hard-coded data here)
│   └── validators.ts (Form validation schemas)
├── types/
│   ├── form.types.ts
│   ├── wizard.types.ts
│   └── index.ts
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-wizard-form.ts
│   └── use-form-validation.ts
└── public/
    └── ... (static assets)
```

## Migration Steps

### Phase 1: Cleanup
1. Remove `src-backup/` folder
2. Move root-level `PositionSelect.tsx` to correct location
3. Fix typo: `RefferalSourceSelect.tsx` → `referral-source-select.tsx`

### Phase 2: Create Type Definitions
1. Create types for form data
2. Create types for wizard steps
3. Create types for select options

### Phase 3: Extract Constants
1. Move country codes to constants file
2. Move step definitions to constants
3. Create validation schemas

### Phase 4: Component Breakdown
1. Create wizard-form component structure
2. Extract each form step into separate component
3. Create reusable wizard UI components (header, progress, navigation)

### Phase 5: Rename & Reorganize
1. Rename all components to kebab-case for consistency
2. Move components to appropriate folders
3. Update all imports

### Phase 6: Create Custom Hooks
1. `use-wizard-form`: Manage wizard state
2. `use-form-validation`: Handle validation logic

### Phase 7: Update Main Page
1. Simplify app/page.tsx to use new WizardForm component
2. Clean up imports
3. Test all functionality

## Naming Conventions

### Files & Folders
- **Components**: kebab-case (e.g., `wizard-form.tsx`, `basic-info-step.tsx`)
- **Folders**: kebab-case (e.g., `form-fields/`, `wizard-form/`)
- **Hooks**: kebab-case with `use-` prefix (e.g., `use-wizard-form.ts`)
- **Types**: kebab-case with `.types.ts` suffix
- **Utils**: kebab-case (e.g., `utils.ts`, `validators.ts`)

### Code
- **Components**: PascalCase (e.g., `WizardForm`, `BasicInfoStep`)
- **Functions**: camelCase (e.g., `handleNext`, `validateForm`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `COUNTRY_CODES`, `WIZARD_STEPS`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `WizardFormData`, `StepConfig`)

## Benefits

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Form fields can be used across different forms
3. **Type Safety**: Proper TypeScript types reduce runtime errors
4. **Testability**: Smaller components are easier to test
5. **Performance**: Can implement lazy loading for steps
6. **Vercel Deployment**: No naming conflicts or case-sensitivity issues
7. **Developer Experience**: Clear structure makes onboarding easier

## Vercel Deployment Considerations

1. ✓ Use kebab-case for all files (case-insensitive filesystem safe)
2. ✓ No spaces in file/folder names
3. ✓ Consistent import paths (always use @/ alias)
4. ✓ No duplicate files with different cases
5. ✓ Proper Next.js 14+ App Router structure
6. ✓ Environment variables in `.env.local` (not committed)
