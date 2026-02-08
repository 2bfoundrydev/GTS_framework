# Documentation Structure

The GTS Framework documentation has been organized into the `docs/` folder for better project structure.

## 📁 New Structure

```
GTS_framework/
├── docs/                           # 📚 All documentation
│   ├── INDEX.md                    # Documentation index (not README!)
│   ├── quickstart.md               # Quick start guide (5 steps)
│   ├── feature-flags.md            # Feature configuration
│   ├── supabase.md                 # Database setup
│   ├── core-implementation.md      # Technical details
│   └── technical-debt.md           # Future improvements
│
├── supabase/                       # Database migrations
│   ├── config.toml                 # Supabase config
│   ├── README.md                   # Supabase CLI guide
│   └── migrations/
│       ├── 20240101000000_init_core_schema.sql
│       └── 20240101000001_rls_policies.sql
│
├── app/                            # Next.js app
├── components/                     # React components
├── utils/                          # Utilities
│   └── features.ts                 # Feature flags
├── README.md                       # Main project README
└── ...
```

## 📖 Documentation Files

### Core Documentation (in `docs/`)

| File | Purpose | Target Audience |
|------|---------|----------------|
| `INDEX.md` | Documentation index | All users |
| `quickstart.md` | Fast setup guide | New users |
| `feature-flags.md` | Feature configuration | Developers |
| `supabase.md` | Database management | Developers |
| `core-implementation.md` | Technical deep dive | Advanced users |
| `technical-debt.md` | Known issues & TODOs | Contributors |

### Navigation

**From root:**
- `README.md` → Links to `docs/`
- All doc links point to `./docs/filename.md`

**Within docs:**
- `docs/README.md` → Index of all docs
- Internal links use relative paths (`./filename.md`)
- Links to root use `../README.md`

## 🔗 Link Updates

All links have been updated:

### Main README.md
```markdown
- [Quick Start Guide](./docs/quickstart.md)
- [Feature Flags](./docs/feature-flags.md)
- [Supabase Setup](./docs/supabase.md)
```

### Within docs/
```markdown
- [feature-flags.md](./feature-flags.md)
- [quickstart.md](./quickstart.md)
- [Documentation Index](./INDEX.md)
- [Back to main README](../README.md)
```

## ✅ Benefits

1. **Cleaner root directory** - Only essential files at top level
2. **Better organization** - All docs in one place
3. **Easy navigation** - Clear index in `docs/README.md`
4. **Consistent structure** - Standard for documentation
5. **Scalable** - Easy to add new docs without cluttering root

## 🚀 Quick Access

**For users:**
- Start here: [`README.md`](../README.md)
- Quick setup: [`docs/quickstart.md`](./quickstart.md)

**For developers:**
- Documentation index: [`docs/INDEX.md`](./INDEX.md)
- All guides: Browse `docs/` folder

## 📝 Adding New Documentation

When adding new docs:

1. Create file in `docs/` folder
2. Update `docs/INDEX.md` with link
3. Link from main `README.md` if relevant
4. Use relative links within docs
5. Follow naming: lowercase with hyphens

Example:
```bash
# Create new doc
touch docs/deployment-guide.md

# Update index
# Edit docs/INDEX.md to add link

# Link from main README if needed
# Edit README.md
```

---

**Current structure:** All documentation centralized in `docs/` ✅
