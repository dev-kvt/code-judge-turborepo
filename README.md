# AI-Powered Code Grading & Doubt Resolution Portal

A full-stack, next-generation Learning Management System (LMS) module combining **sandboxed containerized code execution** with **safe, multi-provider LangChain AI capabilities**. Built with robust defensive architecture, automated fallback engines, and database-enforced review workflows.

🎥 **[Watch the Explanation & Demo Video on Loom](https://www.loom.com/share/77a1585de25e43f2b1e722a06b1aea00)**

## Core Features & Evaluation Highlights

- **Sandboxed Docker Execution**: Student code runs securely inside ephemeral background containers using read-only host volume boundaries.
- **Dual-LLM Resilient AI Grading**: LangChain engine with rapid inference via Groq (`llama-3.3-70b-versatile`) and automatic fallback to Google Gemini (`gemini-1.5-flash`), guaranteeing high availability.
- **2-Stage Prompt Injection Guardrails**: Enforces a strict defensive architecture combining heuristic signature interception and LangChain delimiter boundary isolation to block adversarial grading overrides.
- **Doubt Resolution State Machine**: AI-drafted answers transition through rigid database enum states (`DRAFTING` -> `PENDING_REVIEW` -> `APPROVED`), requiring explicit Teacher review and edits before broadcasting to the student board.
- **Teacher Assignment Portal**: A dedicated workspace restricted via Role-Based Access Control allowing educators to author new programming assignments.

## Technologies Used

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS, Monaco Editor
- **Backend Sandbox:** Express.js, Node.js Cluster Worker, Docker
- **Database:** PostgreSQL (Neon Cloud) + Prisma ORM
- **AI Integration:** LangChain, @langchain/groq, @google/generative-ai
- **Monorepo Architecture:** Turborepo

---

## Getting Started

To run this platform locally, you will need **Node.js (v20+)** and **Docker Desktop** installed.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/dev-kvt/code-judge-turborepo.git
cd code-judge-turborepo
npm install
```

### 2. Configure Environment Variables
Create a `.env` file at the root of the project with the following keys:
```env
# Database
DATABASE_URL=your_postgresql_url

# AI Providers
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

# AWS S3 Storage (For test cases)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
```

### 3. Quick Start (via Docker Compose)

The easiest way to boot the entire stack (PostgreSQL + Next.js Web App + Express Background Worker) is using Docker Compose.

```bash
docker-compose up
```

Alternatively, to run natively on your host machine:
```bash
# Push database schema & seed problems
npm run db:pushschema
npx dotenv -e .env -- node packages/database/seed.js

# Start Turborepo
npm run dev
```

### Roles & Demonstration
- Navigate to `http://localhost:3000/main` to view the interactive presentation dashboard.
- Toggle between the **Student Workspace** and **Teacher Workspace** using the interactive cards to test role-based access control and the Doubt Resolution state machine!
