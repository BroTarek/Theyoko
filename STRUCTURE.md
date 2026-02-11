# Modern UI - Restructured Application

## 📋 Overview
This application has been restructured following Next.js 14+ App Router best practices with a clean, maintainable component architecture.

## 🏗️ Project Structure

```
modern-ui/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Route groups
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   └── topics/
│   │       └── page.tsx
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (Application Form)
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── forms/                    # Form-related components
│   │   ├── wizard-form/          # Multi-step wizard form
│   │   │   ├── wizard-form.tsx           # Main wizard component
│   │   │   ├── wizard-header.tsx         # Wizard header with progress
│   │   │   ├── wizard-progress.tsx       # Step progress indicator
│   │   │   ├── wizard-navigation.tsx     # Navigation buttons
│   │   │   ├── steps/                    # Individual form steps
│   │   │   │   ├── basic-info-step.tsx
│   │   │   │   ├── account-setup-step.tsx
│   │   │   │   ├── experience-step.tsx
│   │   │   │   ├── about-me-step.tsx
│   │   │   │   ├── documents-step.tsx
│   │   │   │   └── review-step.tsx
│   │   │   └── index.ts                  # Barrel exports
│   │   └── form-fields/          # Reusable form field components
│   │       ├── position-select.tsx
│   │       ├── country-select.tsx
│   │       ├── country-phone-select.tsx
│   │       ├── referral-source-select.tsx
│   │       ├── field-selector.tsx
│   │       ├── experience-form.tsx
│   │       └── index.ts
│   ├── layout/                   # Layout components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── footer.css
│   ├── dashboard/                # Dashboard-specific components
│   │   └── overview-charts.tsx
│   ├── data-tables/              # Data table components
│   │   └── data-table.tsx
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── ... (other UI primitives)
│
├── lib/                          # Utility functions and constants
│   ├── utils.ts                  # Utility functions (cn, etc.)
│   └── constants.ts              # App constants (steps, country codes, etc.)
│
├── types/                        # TypeScript type definitions
│   ├── wizard.types.ts           # Wizard state types
│   ├── form.types.ts             # Form data types
│   └── index.ts                  # Barrel exports
│
├── hooks/                        # Custom React hooks
│   └── use-mobile.tsx
│
└── public/                       # Static assets
    └── ... (images, icons, etc.)
```

## 🎯 Key Improvements

### 1. **Component Separation**
- ✅ Broke down 493-line monolithic page into modular components
- ✅ Each wizard step is now a separate, focused component
- ✅ Reusable form fields extracted into `form-fields/` directory
- ✅ UI components follow single responsibility principle

### 2. **Naming Conventions**
- ✅ All files use **kebab-case** (deployment-safe for Vercel)
- ✅ Fixed typo: `RefferalSourceSelect` → `referral-source-select`
- ✅ Consistent naming across all components
- ✅ No case-sensitivity issues with file system

### 3. **Folder Structure**
- ✅ Logical grouping by feature/functionality
- ✅ Clear separation of concerns:
  - Forms in `components/forms/`
  - Layout in `components/layout/`
  - UI primitives in `components/ui/`
  - Data tables in `components/data-tables/`
  - Dashboard components in `components/dashboard/`

### 4. **Type Safety**
- ✅ Created comprehensive TypeScript types in `types/` directory
- ✅ Wizard state types for step management
- ✅ Form data types for all form steps
- ✅ Country, position, and field option types

### 5. **Constants & Configuration**
- ✅ Extracted hardcoded data to `lib/constants.ts`
- ✅ Centralized wizard steps configuration
- ✅ Country codes and dial codes in single source of truth
- ✅ Form field IDs for accessibility and testing

### 6. **Vercel Deployment Ready**
- ✅ No uppercase file names (case-sensitive filesystem safe)
- ✅ Proper Next.js App Router structure
- ✅ Consistent import paths using `@/` alias
- ✅ No duplicate files or conflicting names
- ✅ Clean tsconfig.json with correct path mappings

## 📦 Component Architecture

### Wizard Form Structure

The wizard form follows a clear component hierarchy:

```
WizardForm (Main Container)
├── WizardHeader (Progress summary)
├── WizardProgress (Step indicators)
├── Form Steps (Conditional rendering)
│   ├── BasicInfoStep
│   ├── AccountSetupStep
│   ├── ExperienceStep
│   ├── AboutMeStep
│   ├── DocumentsStep
│   └── ReviewStep
└── WizardNavigation (Back/Next buttons)
```

### Form Field Components

Reusable form field components with consistent API:

- **PositionSelect**: Position selection with search and custom option
- **CountrySelect**: Multi-select country picker
- **CountryPhoneSelect**: Phone number input with country code
- **ReferralSourceSelect**: Referral source dropdown
- **FieldSelector**: Multi-select field/expertise selector

All components follow the same prop pattern:
```tsx
{
  value: string | string[],
  onChange: (value) => void,
  placeholder?: string,
  className?: string
}
```

## 🚀 Getting Started

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel
```

## 🎨 Styling

- **CSS Variables**: Defined in `app/globals.css`
- **Color Palette**:
  - Primary: `kaizen-red` (#E63946)
  - Text: `primary-text` (dark)
  - Secondary: `secondary-grey` (muted)
- **Fonts**:
  - Primary: Lato
  - Secondary: Space Grotesk

## 📝 File Naming Rules

Follow these naming conventions for consistency:

| Type | Convention | Example |
|------|-----------|---------|
| Components | kebab-case.tsx | `wizard-form.tsx` |
| Folders | kebab-case/ | `form-fields/` |
| Hooks | use-kebab-case.ts | `use-wizard-form.ts` |
| Types | kebab-case.types.ts | `form.types.ts` |
| Utils | kebab-case.ts | `constants.ts` |
| **Export Names** | PascalCase | `WizardForm` |
| **Variables** | camelCase | `currentStep` |
| **Constants** | UPPER_SNAKE_CASE | `WIZARD_STEPS` |

## 🔧 TypeScript Configuration

The `tsconfig.json` uses path mapping for clean imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This allows imports like:
```tsx
import { WizardForm } from '@/components/forms/wizard-form';
import { WIZARD_STEPS } from '@/lib/constants';
import type { WizardFormData } from '@/types';
```

## 🧪 Testing & Accessibility

- All form fields have unique IDs (defined in `constants.ts`)
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

## 📚 Documentation

- Each component includes JSDoc comments
- Props are typed with TypeScript interfaces
- README files in complex component directories
- Inline comments for complex logic

## 🌟 Best Practices Applied

1. **Single Responsibility**: Each component does one thing well
2. **DRY**: No code duplication, reusable components
3. **Composition**: Small components compose into larger features
4. **Type Safety**: Full TypeScript coverage
5. **Accessibility**: WCAG 2.1 compliant
6. **Performance**: Component-level code splitting
7. **Maintainability**: Clear structure, easy to find and update

## 🔄 Migration from Old Structure

### What Changed

| Old | New |
|-----|-----|
| `src-backup/` | ❌ Deleted (redundant) |
| `src/` | ❌ Deleted (redundant nested folder) |
| `PositionSelect.tsx` (root) | ✅ `components/forms/form-fields/position-select.tsx` |
| `RefferalSourceSelect.tsx` (typo) | ✅ `referral-source-select.tsx` |
| `components/modules/` | ✅ `components/layout/` |
| `app/page.tsx` (493 lines) | ✅ `app/page.tsx` (7 lines) + separated steps |
| Hard-coded data in components | ✅ `lib/constants.ts` |
| No type definitions | ✅ `types/` directory |

## 🎯 Next Steps

1. ✅ Structure reorganization - **COMPLETE**
2. ✅ Component separation - **COMPLETE**
3. ✅ Type safety - **COMPLETE**
4. ✅ Constants extraction - **COMPLETE**
5. ⏳ Add form validation (Zod schemas)
6. ⏳ Add custom hooks for wizard state
7. ⏳ Add tests (Jest + React Testing Library)
8. ⏳ Add Storybook for component documentation

## 📞 Support

For questions or issues, refer to:
- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- TypeScript Documentation: https://www.typescriptlang.org/docs

---

**Built with ❤️ following modern best practices**
