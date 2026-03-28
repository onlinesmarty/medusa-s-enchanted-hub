# 🐍 Medusa's Enchanted Hub — Mission Control

> A self-hosted AI agent mission control panel for managing autonomous AI agents, tracking tasks, monitoring API costs, and controlling multi-agent operations — all from a beautiful dark-themed web UI.

![Hub Screenshot](https://hub.onlinesmarty.solutions/og-preview.png)

---

## What Is This?

This is the front-end dashboard for an [OpenClaw](https://github.com/openclaw) multi-agent system. It gives you a real-time command center to:

- See all your AI agents and their current status at a glance
- Create, assign, and track tasks across agents
- Monitor API spending (tokens, cost per agent, cost per provider)
- Track image generation credits (fal.ai, SiliconFlow)
- Watch a live activity feed of what agents are doing
- Set revenue goals and track progress

It's designed to run on a **VPS behind Nginx**, accessible from any device including mobile — no PC required.

---

## Features

### Dashboard
- **Agent Fleet** — Cards for each agent (Medusa, Content Creator, Dev Guardian, PM Estratégico, Search Master, Siren) with live status indicators, task progress bars, and current task labels
- **Stats Bar** — Quick overview of total tasks, completion rate, active agents, and pending items
- **Revenue Cauldron** — Goal tracker with progress visualization
- **Goals Panel** — Set and track business objectives
- **Activity Feed** — Rolling log of recent agent actions
- **Animated Office** — Ambient visual with floating particles

### Task Board (Kanban)
- Columns: `Todo → In Progress → Review → Done`
- Full task cards with: priority badge, assignee, due date, progress %, tags, links, images
- Create/edit tasks via modal dialog
- Filter by assignee or status
- Timeline view option
- Tasks persist in a SQLite database via the task API

### API Costs
- Spending breakdown: Today / This Week / This Month / Total
- Cost by provider (DeepSeek, Alibaba/Qwen)
- Cost by agent (last 30 days) with per-agent bar charts
- Daily cost chart (last 7 days, recharts)
- Live call log — model, tokens, cost per call, timestamps
- **Image credits widget** — balance and approximate images remaining per provider

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| HTTP | TanStack Query (React Query v5) |
| Forms | React Hook Form + Zod |

---

## Architecture

```
Browser (hub.onlinesmarty.solutions)
    │
    ▼
Nginx (reverse proxy + basic auth)
    ├── /          → React SPA  (dist/)
    ├── /api/      → Task API   (FastAPI, port 3001)
    └── /usage/    → Usage API  (port 3002, token/cost tracking)
```

### Backend: Task API (`/api/`)

FastAPI app at `port 3001`. Endpoints used by the Hub:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |
| POST | `/image/generate` | Generate image via fal.ai |
| GET | `/image-budgets` | Remaining image credits |
| GET | `/discord/history` | Read Discord channel messages |
| GET | `/discord/channels` | List available channels |

Tasks are stored in SQLite (`tasks.db`).

### Backend: Usage API (`/usage/`)

Separate service at `port 3002` that logs every OpenClaw LLM call:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/usage/summary` | Aggregated spend by period, agent, provider |
| GET | `/usage/recent` | Last N API calls |
| GET | `/budget` | Budget limit status |

---

## Setup

### Prerequisites
- Node.js 18+
- VPS with Nginx
- Python 3.10+ (for task API)
- OpenClaw (optional — for live agent data)

### 1. Install & Build

```bash
git clone https://github.com/onlinesmarty/medusa-s-enchanted-hub.git
cd medusa-s-enchanted-hub
npm install
npm run build
```

### 2. Deploy to Nginx

```nginx
server {
    server_name hub.yourdomain.com;
    root /var/www/mission-control-app/dist;
    index index.html;

    # Basic auth (optional but recommended)
    location / {
        auth_basic "Mission Control";
        auth_basic_user_file /etc/nginx/.hub_passwd;
        try_files $uri $uri/ /index.html;
    }

    # Task API
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
    }

    # Usage tracking API
    location /usage/ {
        proxy_pass http://127.0.0.1:3002/usage/;
    }
}
```

```bash
# Generate basic auth password
htpasswd -c /etc/nginx/.hub_passwd yourusername

# Reload nginx
nginx -s reload
```

### 3. Start Task API

```bash
cd task-api
pip install fastapi uvicorn httpx python-dotenv
uvicorn main:app --host 127.0.0.1 --port 3001
```

Or as a systemd service:

```ini
[Unit]
Description=Hub Task API
After=network.target

[Service]
ExecStart=/usr/bin/uvicorn main:app --host 127.0.0.1 --port 3001
WorkingDirectory=/root/.openclaw/task-api
Restart=always

[Install]
WantedBy=multi-user.target
```

### 4. fal.ai Image Generation (optional)

Create `task-api/fal_api_key.txt` with your fal.ai API key:

```
your-key-id:your-key-secret
```

```bash
chmod 600 task-api/fal_api_key.txt
```

Supported models: `nano-banana-2`, `nano-banana-pro`, `flux-pro`, `flux-dev`

### 5. Discord History (optional)

Set your Discord bot token in the task API environment:

```bash
export DISCORD_BOT_TOKEN="your-bot-token"
```

---

## OpenClaw Integration

This Hub is built to work alongside [OpenClaw](https://github.com/openclaw) — an autonomous AI agent framework. When connected:

- Agents automatically create and update tasks via the API
- API costs are logged in real time as agents make LLM calls
- The activity feed shows agent actions as they happen
- The budget guard blocks agents when spending limits are hit

The agents shown in the fleet are defined in `src/types/tasks.ts` and can be customized to match your OpenClaw `AGENTS.md`.

---

## Development

```bash
npm run dev        # Start dev server (port 5173)
npm run build      # Production build → dist/
npm run lint       # ESLint check
npm run test       # Vitest unit tests
```

---

## Customization

| What | Where |
|------|-------|
| Agent names/emoji/colors | `src/types/tasks.ts` → `AGENTS` array |
| Nav tabs | `src/pages/Index.tsx` → `navItems` |
| Provider colors in charts | `src/components/ApiCosts.tsx` → `PROVIDER_COLOR` |
| Theme colors | `src/index.css` → CSS variables |
| Budget limits | Usage API config |

---

## License

MIT — use it, fork it, build your own agent empire.

---

*Built with [Lovable](https://lovable.dev) · Powered by OpenClaw + DeepSeek + Alibaba Qwen*
