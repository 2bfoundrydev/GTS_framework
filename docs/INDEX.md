# Documentation Index

> **Note:** This is the documentation index, not a project README. For the main project README, see [../README.md](../README.md).

Welcome to the GTS Framework documentation. This directory contains comprehensive guides for setting up, configuring, and deploying your SaaS MVP.

## 📚 Documentation Index

### Getting Started

- **[Quick Start Guide](./quickstart.md)** - Get running in 1-2 hours
  - 5-step setup process
  - Smoke test checklist
  - Production deployment guide
  - Troubleshooting tips

### Core Concepts

- **[Architecture Guide](../INSTRUCTIONS.md)** - Deep technical overview
  - Repository map
  - Core flows (auth, billing, trials)
  - Feature flags detailed explanation
  - Database schema details
  - Webhook implementation
  - Quick reference tables

- **[Feature Flags](./feature-flags.md)** - Configure optional SaaS features
  - Billing & Subscriptions
  - Trial periods
  - Onboarding tour
  - Common configurations

- **[Core Implementation](./core-implementation.md)** - Technical implementation details
  - What was implemented
  - Architecture decisions
  - File changes summary
  - Testing guide

### Infrastructure

- **[Supabase Setup](./supabase.md)** - Database and local development
  - Local Supabase with CLI
  - Migrations management
  - Common commands
  - Production linking

### Project Management

- **[Technical Debt](./technical-debt.md)** - Known improvements and future work
  - High priority items
  - Medium priority items
  - Low priority items

- **[Documentation Structure](./STRUCTURE.md)** - How docs are organized
  - Folder structure
  - Link conventions
  - Adding new docs

## 🚀 Quick Links

**First time here?** → Start with [Quick Start Guide](./quickstart.md)

**Want to understand the system?** → Read [Architecture Guide](../INSTRUCTIONS.md)

**Setting up database?** → See [Supabase Setup](./supabase.md)

**Want to customize features?** → Check [Feature Flags](./feature-flags.md)

**Deploying to production?** → Follow [Production Checklist](./quickstart.md#production-deployment-checklist)

## 📖 Reading Order

For new users, we recommend reading the documentation in this order:

1. **[Quick Start Guide](./quickstart.md)** - Get your environment set up
2. **[Architecture Guide](../INSTRUCTIONS.md)** - Understand how everything works
3. **[Supabase Setup](./supabase.md)** - Database management deep dive
4. **[Feature Flags](./feature-flags.md)** - Configure your SaaS features
5. **[Core Implementation](./core-implementation.md)** - Technical decisions and details

## 🤝 Contributing

When adding new documentation:

1. Keep files focused on a single topic
2. Use clear, descriptive filenames (lowercase-with-hyphens.md)
3. Update this INDEX.md with links
4. Update main README.md if relevant
5. Use markdown for formatting
6. Include code examples where helpful

## 📝 Documentation Standards

- Use `# Title` for main headings
- Use `## Section` for major sections
- Use `### Subsection` for detailed topics
- Include code blocks with language hints: \`\`\`bash
- Add emojis sparingly for visual navigation
- Keep line length reasonable (80-120 chars)
- Test all code examples before committing

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Need help?** Check the [troubleshooting section](./quickstart.md#troubleshooting) in the Quick Start Guide.
