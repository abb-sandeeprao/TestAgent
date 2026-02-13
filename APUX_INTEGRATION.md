# Apux Integration Guide

This application uses Apux components from `@abb-hmi/apux` version `0.11.0-alpha.15`.

## Current Implementation

Currently, the application uses a **mock implementation** of Apux components located in `/public/apux-mock.js`. This provides basic functionality for development and testing purposes.

## Components Used

The following Apux components are used in the application:

### Toolbox Component
- **`<apux-button>`** - Used for all tool items
  - Variant: `ghost`
  - Displays icons and labels for each tool
- **`<apux-spinner-loader>`** - Used for loading indicator
  - Size: `medium`
  - Variant: `default`

### Editor Component
- **`<apux-input>`** - Used for text elements
  - Type: `text`
  - Supports value binding and input events
- **`<apux-button>`** - Used for button elements and delete buttons
  - Button elements: Variant `primary`, Size `medium`
  - Delete buttons: Variant `ghost`, Size `extra-small`

## Switching to Actual Apux Package

When the actual `@abb-hmi/apux@0.11.0-alpha.15` package becomes available, follow these steps:

### 1. Install the Package

```bash
npm install @abb-hmi/apux@0.11.0-alpha.15
```

Or if using a private registry:
```bash
npm install @abb-hmi/apux@0.11.0-alpha.15 --registry=<your-registry-url>
```

### 2. Copy Apux Build Files

Copy the Apux build files to your public directory:
```bash
# Copy from node_modules to public
cp node_modules/@abb-hmi/apux/dist/apux.umd.js public/apux/
cp node_modules/@abb-hmi/apux/dist/apux.css public/apux/
```

### 3. Update index.html

Replace the mock implementation in `index.html`:

```html
<!-- Remove this: -->
<script src="/apux-mock.js"></script>

<!-- Add these instead: -->
<link id="apux-style" rel="stylesheet" href="/apux/apux.css" />
<script src="/apux/apux.umd.js"></script>
```

**Important:** The `id="apux-style"` attribute is required for Apux components to work correctly.

### 4. Update TypeScript Configuration (Optional)

If you want full TypeScript support, update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@abb-hmi/apux/globals"]
  }
}
```

Or add to a `.d.ts` file:
```typescript
/// <reference types="@abb-hmi/apux/globals" />
```

### 5. Remove Mock Implementation

Once the actual Apux library is working, you can safely delete:
- `/public/apux-mock.js`
- `/src/apux.d.ts` (if using the actual TypeScript definitions)

## Component API Reference

Based on the Apux storybook examples:

### apux-button
```html
<apux-button 
  variant="primary|ghost|discreet"
  size="small|medium|extra-small"
  disabled
  icon="icon-name"
  block
  type="button|submit|reset"
>
  Button Text
</apux-button>
```

### apux-input
```html
<apux-input
  type="text|password|email|search|tel|url|number"
  name="field-name"
  value="initial-value"
  placeholder="Placeholder text"
  disabled
  icon="icon-name"
  size="small|medium|extra-small"
/>
```

### apux-spinner-loader
```html
<apux-spinner-loader
  size="small|medium|large"
  variant="default|accent|discreet"
  state="loading|success|error"
/>
```

## Troubleshooting

### Components Not Rendering
- Ensure the Apux script loads **before** React
- Check browser console for any JavaScript errors
- Verify the `apux-style` link has the correct `id` attribute

### TypeScript Errors
- Make sure TypeScript definitions are properly imported
- Use `/// <reference types="@abb-hmi/apux/globals" />` in your `.d.ts` files

### Styling Issues
- Ensure `apux.css` is loaded with `id="apux-style"`
- Check that your custom CSS doesn't conflict with Apux styles
- Use `!important` sparingly to override Apux default styles

## Resources

- Apux Storybook Examples: `/apux-storybook/stories/`
- React Integration Guide: `/apux-storybook/stories/apux-react.mdx`
- Component Documentation: Available in the storybook for each component
