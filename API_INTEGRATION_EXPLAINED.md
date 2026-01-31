# API Integration Setup - How It Works

## 📁 File Structure

```
frontend-dev/
├── composables/
│   ├── api.ts                 (Existing API calls)
│   └── projects.ts            (NEW - Projects API with comments)
│
├── server/
│   └── api/
│       └── projects.ts        (NEW - Local mock API endpoint)
│
└── pages/
    └── workspace.vue          (UPDATED - Now uses API)
```

---

## 🔄 Current Flow (Local Mock API)

```
User opens http://localhost:3000/workspace

    ↓

workspace.vue component mounts
  → onMounted() hook triggers

    ↓

Calls getProjects() from composables/projects.ts
  → Makes HTTP request to: GET http://localhost:3000/api/projects

    ↓

Nuxt framework intercepts the request
  → Routes to server/api/projects.ts

    ↓

server/api/projects.ts returns mock JSON data
  [{id: "...", title: "...", description: "...", ...}, ...]

    ↓

Frontend receives data
  → Fills inbox/working/outbox arrays
  → Vue reactivity updates UI automatically

    ↓

User sees projects displayed in the three panels
```

---

## 🚀 Future Flow (When Backend is Ready)

**You only need to change ONE line:**

In `composables/projects.ts`, change:
```typescript
const API_BASE_URL = "http://localhost:3000";  // ← Local mock
```

To:
```typescript
const API_BASE_URL = "https://your-company-api.com";  // ← Real backend
```

Then:
1. Delete the file `server/api/projects.ts` (no longer needed)
2. Your backend must return the same JSON structure

**That's it! Everything else works the same!**

---

## 📊 Expected Backend Response Format

When your company's backend is ready, it should respond to:
```
GET /api/projects?userID=123
```

With JSON like this:
```json
[
  {
    "id": "sprint1-cw45-001",
    "title": "Design internal data bus",
    "description": "Choose Apache Kafka + Spring architecture",
    "category": "Sprint 1: CW45",
    "status": "inbox"
  },
  {
    "id": "sprint1-cw45-002",
    "title": "Define Data Model",
    "description": "Design ontology-aware data structures",
    "category": "Sprint 1: CW45",
    "status": "inbox"
  }
]
```

**Required fields:** `id`, `title`, `description`
**Optional fields:** `category`, `status`, (or any other project attributes)

---

## ✅ Current Mock Data Included

The local API (`server/api/projects.ts`) has sample projects from your sprint requirements:

- **Sprint 1 (CW45):** Data Models and Information Flow
  - Design internal data bus
  - Define Data Model
  - Define Transformation

- **Sprint 2 (CW46):** Data Models and Information Flow
  - Design internal data bus optimization

- **Sprint 3 (CW05):** Frontend-Backend Interface
  - GET list_active_projects
  - GET project_description  
  - GET project_destination

---

## 🛠️ How to Test It

1. Run: `npm run dev`
2. Open: `http://localhost:3000/workspace`
3. You should see all projects loaded in the Inbox panel
4. Drag items between panels to test the workflow
5. You can add new tasks using the "Add New Task" form

---

## 📝 When Backend Is Implemented

1. **Confirm API endpoint URL** with your backend team
2. **Get sample response** - make sure it includes: `id`, `title`, `description`
3. **Update composables/projects.ts** - change the `API_BASE_URL`
4. **Delete server/api/projects.ts** - local mock no longer needed
5. **Test with real data** - everything should work seamlessly!

---

## 💡 Key Points

- ✅ Frontend works NOW with local mock data
- ✅ No waiting for backend to start development
- ✅ Easy transition when backend is ready (one URL change)
- ✅ Same code structure throughout
- ✅ Maintains your template design and styling
