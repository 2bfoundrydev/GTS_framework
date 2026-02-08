# Supabase Local Development

This directory contains the Supabase project configuration and migrations for local development.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running

## Quick Start

### 1. Start Local Supabase

```bash
supabase start
```

This will:
- Start all Supabase services in Docker containers
- Run migrations automatically
- Output connection details (save these!)

### 2. Get Connection Details

After starting, you'll see output like:

```
API URL: http://127.0.0.1:54321
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
anon key: eyJhbGc...
service_role key: eyJhbGc...
```

### 3. Update `.env.local`

Copy the keys to your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... # from output above
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # from output above
```

## Common Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (drops all data, reruns migrations)
supabase db reset

# View database status
supabase status

# Open Supabase Studio in browser
supabase studio
```

## Migrations

Migrations are in `supabase/migrations/` and run automatically on start.

### Creating New Migrations

```bash
# Create a new migration file
supabase migration new <migration_name>

# Example
supabase migration new add_users_table
```

### Apply Migrations

```bash
# Migrations apply automatically on start
supabase start

# Or reset to reapply all migrations
supabase db reset
```

## Linking to Remote Project

To link this local project to a production Supabase project:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Pull remote schema (optional)
supabase db pull

# Push local migrations to remote
supabase db push
```

## Troubleshooting

### Port Already in Use

If ports are already taken, stop Supabase and any other services:

```bash
supabase stop
docker ps  # check for other containers
```

### Reset Everything

```bash
supabase stop --no-backup
rm -rf ~/.supabase  # careful: removes all local Supabase data
supabase start
```

### View Logs

```bash
supabase logs
```

## Directory Structure

```
supabase/
├── config.toml        # Supabase configuration
├── migrations/        # Database migrations
└── seed.sql          # Initial seed data (optional)
```
