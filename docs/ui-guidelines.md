# UI Guidelines

## Overview

This document outlines the user interface design guidelines for the task management application. These guidelines ensure a consistent, accessible, and user-friendly experience across the application.

## Design Principles

### Simplicity
- Keep the interface clean and uncluttered
- Focus on essential features and avoid overwhelming users
- Use whitespace effectively to create breathing room

### Consistency
- Maintain consistent patterns across all UI components
- Use the same styling approach throughout the application
- Ensure predictable user interactions

### Accessibility
- Design for users of all abilities
- Maintain proper color contrast ratios
- Support keyboard navigation

## Color Palette

### Primary Colors (American Palette)
The application uses an American-inspired color palette that is familiar and user-friendly:

- **Primary Blue:** `#0052CC` - Used for primary actions and links
- **Navy:** `#172B4D` - Used for headers and important text
- **Red:** `#DE350B` - Used for errors and destructive actions
- **White:** `#FFFFFF` - Used for backgrounds and cards
- **Light Gray:** `#F4F5F7` - Used for secondary backgrounds

### Text Colors
- **Primary Text:** `#172B4D` - High contrast, easy to read
- **Secondary Text:** `#5E6C84` - For less prominent information
- **Disabled Text:** `#A5ADBA` - For inactive elements

### Semantic Colors
- **Success:** `#36B37E` - For success messages and completed tasks
- **Warning:** `#FFAB00` - For warnings and important notices
- **Error:** `#DE350B` - For errors and validation messages
- **Info:** `#0065FF` - For informational messages

## Typography

### Font Family
- Primary: System font stack for optimal performance and familiarity
  ```css
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  ```

### Font Sizes
- **Heading 1:** 24px / 1.5rem - Page titles
- **Heading 2:** 20px / 1.25rem - Section headers
- **Heading 3:** 16px / 1rem - Subsection headers
- **Body:** 14px / 0.875rem - Standard text
- **Small:** 12px / 0.75rem - Secondary information

### Font Weights
- **Regular:** 400 - Body text
- **Medium:** 500 - Emphasized text
- **Bold:** 600 - Headings and important labels

## Button Styles

### Design Philosophy
Buttons should be clean, minimalistic, and immediately recognizable as interactive elements.

### Primary Button
```css
background-color: #0052CC;
color: #FFFFFF;
border: none;
border-radius: 4px;
padding: 8px 16px;
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: background-color 0.2s ease;
```

**Hover State:**
```css
background-color: #0747A6;
```

**Disabled State:**
```css
background-color: #A5ADBA;
cursor: not-allowed;
opacity: 0.6;
```

### Secondary Button
```css
background-color: transparent;
color: #0052CC;
border: 1px solid #0052CC;
border-radius: 4px;
padding: 8px 16px;
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: background-color 0.2s ease;
```

**Hover State:**
```css
background-color: #F4F5F7;
```

### Text Button
```css
background-color: transparent;
color: #0052CC;
border: none;
padding: 8px 12px;
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: color 0.2s ease;
```

**Hover State:**
```css
color: #0747A6;
text-decoration: underline;
```

### Button Sizing
- **Small:** padding: 4px 12px; font-size: 12px;
- **Medium:** padding: 8px 16px; font-size: 14px; (default)
- **Large:** padding: 12px 24px; font-size: 16px;

## Input Fields

### Text Inputs
```css
border: 1px solid #DFE1E6;
border-radius: 4px;
padding: 8px 12px;
font-size: 14px;
color: #172B4D;
background-color: #FFFFFF;
transition: border-color 0.2s ease;
```

**Focus State:**
```css
border-color: #0052CC;
outline: none;
box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.2);
```

**Error State:**
```css
border-color: #DE350B;
```

## Spacing

Use a consistent spacing scale based on 4px increments:

- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **xxl:** 48px

## Component Guidelines

### Task Cards
- Use white background with subtle shadow
- Include clear visual indicators for task status
- Maintain consistent padding (16px)
- Use border-radius: 4px for rounded corners

### Completed Tasks
- Apply text with strikethrough decoration
- Reduce opacity to 0.6
- Use success color (#36B37E) for completion indicator
- Keep completed tasks clearly distinguishable but less prominent

### Task List
- Provide adequate spacing between tasks (8px minimum)
- Use alternating backgrounds or dividers for long lists
- Ensure touch targets are at least 44px for mobile accessibility

### Forms
- Label all inputs clearly
- Show validation messages inline
- Use consistent spacing between form fields (16px)
- Group related fields together

## Icons

- Use simple, outlined icons for a clean look
- Maintain consistent icon size (16px or 20px)
- Ensure icons have proper color contrast
- Provide tooltips for icon-only buttons

## Responsive Design

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Mobile Considerations
- Increase touch target sizes to minimum 44x44px
- Stack elements vertically when appropriate
- Use full-width buttons on mobile devices
- Ensure text remains readable without zooming

## Accessibility Requirements

- Maintain WCAG 2.1 AA compliance minimum
- Ensure color contrast ratio of at least 4.5:1 for normal text
- Support keyboard navigation for all interactive elements
- Provide focus indicators for all focusable elements
- Use semantic HTML elements
- Include appropriate ARIA labels where needed

## Animation and Transitions

Keep animations subtle and purposeful:
- Use 0.2s duration for most transitions
- Apply ease or ease-in-out timing functions
- Avoid animations that could trigger motion sensitivity
- Provide reduced motion alternatives

## Best Practices

1. **Progressive Enhancement:** Ensure core functionality works without JavaScript
2. **Performance:** Optimize images and minimize CSS
3. **Testing:** Test on multiple browsers and devices
4. **Documentation:** Keep this document updated as the design evolves
5. **User Feedback:** Gather user input and iterate on the design
