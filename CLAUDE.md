# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a design principles documentation website that presents universal UI design principles and style constraints for AI-automated design. The site follows minimalist design principles and demonstrates how to apply design rules in AI-driven workflows.

## Architecture

**Static Site Structure:**
- `index.html` - Main HTML with semantic structure and accessibility features
- `styles.css` - CSS with design tokens system, 8px grid spacing, and responsive design
- `script.js` - Vanilla JavaScript for smooth scrolling, copy functionality, and interactive enhancements
- `vercel.json` - Deployment configuration with security headers and cache rules

**Design System:**
- Uses CSS custom properties (design tokens) for colors, spacing, typography, and animations
- 8px baseline grid system for consistent spacing
- Responsive breakpoints at 480px, 768px, 1024px
- Minimal color palette with high contrast ratios for accessibility
- Single font family system with clear typographic hierarchy

**Content Organization:**
- Hero section with CTA button
- Sticky navigation for section links
- Design principles cards with interactive hover effects
- Prompt templates and AI-ready specifications
- Copy-to-clipboard functionality for code examples

## Key Features

**Design Principles Demonstration:**
- The site itself implements the design principles it documents
- Clear visual hierarchy through typography and spacing
- Consistent component styling with subtle shadows and borders
- Responsive design that works across all device sizes

**Interactive Elements:**
- Smooth scroll navigation between sections
- Copy buttons for prompt templates with visual feedback
- Hover effects on cards for better user engagement
- Keyboard navigation support for accessibility

**Technical Implementation:**
- No build process required - static files can be served directly
- Semantic HTML structure for SEO and accessibility
- CSS Grid and Flexbox for responsive layouts
- Vanilla JavaScript for broad browser compatibility

## Development Commands

**Local Development:**
- No build step required - open `index.html` directly in browser
- Use Live Server extension in VS Code for automatic reloads
- Test responsive design at different viewport sizes

**Deployment:**
- Ready for Vercel deployment (configuration included)
- Can be deployed to any static hosting service
- All assets are self-contained in the repository

## Development Guidelines

**Styling Rules:**
- Always use CSS custom properties from `:root` for consistency
- Follow the 8px grid system for all spacing
- Maintain high contrast ratios (minimum 4.5:1 for text)
- Use semantic HTML elements appropriately

**Content Guidelines:**
- Keep design examples minimal and functional
- Ensure all prompts are practical and copy-paste ready
- Maintain consistency with the documented design principles
- Test all interactive elements with keyboard navigation

**Accessibility Requirements:**
- All interactive elements must have proper ARIA labels
- Ensure keyboard navigation works throughout the site
- Test with screen readers for proper content structure
- Maintain focus indicators for keyboard users

## File Organization

```
/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with design tokens
├── script.js           # Interactive functionality
├── vercel.json         # Deployment configuration
├── README.md           # Detailed documentation
└── CLAUDE.md          # This file
```

## Design Token Reference

**Colors:** `--color-primary`, `--color-neutral-*`, `--color-accent`
**Spacing:** `--space-*` (4px base unit, multiples of 8px)
**Typography:** `--font-size-*`, `--font-weight-*`
**Animations:** `--transition-fast/normal/slow`
**Border radius:** `--radius-sm/md/lg/xl`

When adding new components or sections, use existing tokens rather than creating new values to maintain design consistency.