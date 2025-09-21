# WorkfluxAI – Client Report Automation

Automates weekly status reports from Jira/Slack/etc → AI summary → PDF → Email.

## Structure
- `/frontend` → Next.js marketing site
- `/backend` → Supabase schema + Stripe webhook
- `/n8n-workflows` → Ready import JSON workflow

## Quick Start
```bash
cd frontend
npm install
npm run dev