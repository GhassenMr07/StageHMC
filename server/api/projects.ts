/**
 * LOCAL MOCK API ENDPOINT
 *
 * CURRENT PURPOSE (Development):
 * ==============================
 * This is a mock API endpoint that simulates your company's backend API.
 * It returns hardcoded project data so frontend development can continue
 * without waiting for the real backend.
 *
 * FILE LOCATION: server/api/projects.ts
 * This file is automatically loaded by Nuxt as an API route.
 * It will respond to requests at: http://localhost:3000/api/projects
 *
 * HOW IT WORKS:
 * 1. User loads the workspace page
 * 2. Frontend calls getProjects() from composables/projects.ts
 * 3. That composable makes HTTP GET request to: /api/projects
 * 4. Nuxt router matches it to this file (server/api/projects.ts)
 * 5. This function returns the mock data below
 * 6. Frontend receives JSON and renders it
 *
 * REMOVAL WHEN BACKEND IS READY:
 * ===============================
 * When your company's backend API is ready:
 * 1. Delete this file (server/api/projects.ts)
 * 2. Update the BASE_URL in composables/projects.ts to point to real backend
 * 3. Frontend code stays exactly the same - just works with real data!
 *
 * The backend should return the same JSON structure we're using here.
 */

export default defineEventHandler((_event) => {
  // Mock data - these are sample projects for your Sprint planning
  // This data is based on the requirements you provided
  const mockProjects = [
    {
      id: "sprint1-cw45-001",
      title: "Design internal data bus - Event Streaming",
      description: "Choose and configure Message Broker architecture (Apache Kafka + Spring)",
      category: "Sprint 1: CW45",
      status: "inbox",
    },
    {
      id: "sprint1-cw45-002",
      title: "Define Data Model on Meta-store",
      description: "Design the ontology-aware data structures for internal storage",
      category: "Sprint 1: CW45",
      status: "inbox",
    },
    {
      id: "sprint1-cw45-003",
      title: "Define Transformation from DMP to internal Store",
      description: "Create mapping logic between DMP data and internal storage format",
      category: "Sprint 1: CW45",
      status: "inbox",
    },
    {
      id: "sprint2-cw46-001",
      title: "Design internal data bus - Optimization",
      description: "Optimize message broker for production use",
      category: "Sprint 2: CW46",
      status: "inbox",
    },
    {
      id: "sprint3-cw05-001",
      title: "GET list_active_projects endpoint",
      description: "Create API endpoint: GET /api/list_active_projects with userID parameter",
      category: "Sprint 3: CW05",
      status: "inbox",
    },
    {
      id: "sprint3-cw05-002",
      title: "GET project_description endpoint",
      description: "Create API endpoint: GET /api/project_description with projectID parameter",
      category: "Sprint 3: CW05",
      status: "inbox",
    },
    {
      id: "sprint3-cw05-003",
      title: "GET project_destination endpoint",
      description: "Create API endpoint: GET /api/project_destination returning publication platforms",
      category: "Sprint 3: CW05",
      status: "inbox",
    },
  ];

  // In a real scenario, you would query based on userID parameter
  // const userID = getQuery(event).userID;
  // return await database.getProjectsByUser(userID);

  // For now, return all mock projects
  return mockProjects;
});
