#!/usr/bin/env bash
set -euo pipefail

# === Configuration (edit as needed) ===
GITHUB_USER="${GITHUB_USER:-pathum25}"
REPO_NAME="${REPO_NAME:-Papy}"
USE_HTTPS="${USE_HTTPS:-0}"      # set to 1 to use HTTPS remote instead of SSH
CREATE_REPO="${CREATE_REPO:-1}"  # set to 0 to skip gh repo create
DB_PUSH_ONLY="${DB_PUSH_ONLY:-1}"# set to 0 to run prisma migrate dev (may prompt)
# =====================================

REMOTE_SSH="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
REMOTE_HTTPS="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
REMOTE="${REMOTE_SSH}"
if [ "${USE_HTTPS}" != "0" ]; then
  REMOTE="${REMOTE_HTTPS}"
fi

echo "Auto-deploy script starting..."
echo "Target repo: ${GITHUB_USER}/${REPO_NAME}"
echo "Using remote: ${REMOTE}"
echo

# Check prerequisites
command -v git >/dev/null 2>&1 || { echo >&2 "git not found. Install git and re-run."; exit 1; }
command -v node >/dev/null 2>&1 || { echo >&2 "node not found. Install Node 18+ and re-run."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "npm not found. Install npm and re-run."; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo >&2 "openssl not found. Install openssl and re-run."; exit 1; }

if [ "${CREATE_REPO}" != "0" ]; then
  if ! command -v gh >/dev/null 2>&1; then
    echo "Warning: gh (GitHub CLI) not found. The script will not auto-create the remote repo."
    echo "Install gh and authenticate (gh auth login) to enable repo creation, or create the repo manually on GitHub."
    echo
    CREATE_REPO=0
  fi
fi

# Install dependencies
echo "Installing npm dependencies..."
npm ci

# Copy .env if missing
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Copied .env.example -> .env"
  else
    cat > .env <<'EOF'
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-this-to-a-secure-random-string
EOF
    echo "Created minimal .env"
  fi
fi

# Ensure NEXTAUTH_SECRET exists and is strong
if ! grep -q '^NEXTAUTH_SECRET=' .env; then
  SECRET=$(openssl rand -base64 32)
  echo "NEXTAUTH_SECRET=${SECRET}" >> .env
  echo "Added NEXTAUTH_SECRET to .env"
else
  echo "NEXTAUTH_SECRET already present in .env"
fi

# Prisma generate
echo "Generating Prisma client..."
npx prisma generate

# Run migrations or db push
if [ "${DB_PUSH_ONLY}" = "0" ]; then
  echo "Running prisma migrate dev --name init (may prompt)..."
  # attempt migrate dev; if it fails, fallback to db push
  if ! npx prisma migrate dev --name init --skip-seed; then
    echo "prisma migrate dev failed, falling back to prisma db push"
    npx prisma db push
  fi
else
  echo "Running prisma db push (non-interactive, development sync)..."
  npx prisma db push
fi

# Seed database if seed file exists
if [ -f prisma/seed.ts ]; then
  echo "Seeding database..."
  if command -v npx >/dev/null 2>&1; then
    npx ts-node prisma/seed.ts || true
  else
    echo "ts-node not available; skipping seed. Install ts-node to run seeds."
  fi
fi

# Initialize git if needed and commit
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
fi

git add -A
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "Initial commit — papy scaffold" || true
fi

# Ensure main branch
git branch -M main || true

# Create remote repo if requested and gh available
if [ "${CREATE_REPO}" != "0" ]; then
  if gh repo view "${GITHUB_USER}/${REPO_NAME}" >/dev/null 2>&1; then
    echo "GitHub repo ${GITHUB_USER}/${REPO_NAME} already exists."
  else
    echo "Creating GitHub repo ${GITHUB_USER}/${REPO_NAME} using gh..."
    gh repo create "${GITHUB_USER}/${REPO_NAME}" --public --source=. --remote=origin --push --confirm || {
      echo "gh repo create failed; please create the repo manually or ensure gh is authenticated."
    }
  fi
fi

# Set or update origin remote
if git remote get-url origin >/dev/null 2>&1; then
  echo "Updating origin remote to ${REMOTE}"
  git remote set-url origin "${REMOTE}"
else
  echo "Adding origin remote ${REMOTE}"
  git remote add origin "${REMOTE}"
fi

# Push to remote
echo "Pushing to origin main..."
git push -u origin main

echo
echo "Done. If push failed due to permissions, ensure:"
echo " - Your SSH key is added to GitHub (for SSH pushes), OR"
echo " - Use HTTPS by setting USE_HTTPS=1 and re-run, OR"
echo " - If CREATE_REPO=1 and gh was not installed, install gh and retry."
echo
echo "Local dev server: npm run dev"
echo "Sign-in page: http://localhost:3000/auth/signin"
