/**
 * PROJECTS API COMPOSABLE
 *
 * CURRENT IMPLEMENTATION (Development Phase):
 * ============================================
 * This composable uses a LOCAL MOCK API that returns hardcoded project data.
 * This allows frontend development to continue while waiting for the backend API.
 *
 * The local data is stored in a JSON file (server/api/projects.ts) that simulates
 * the real backend API endpoint. This acts as a mock server.
 *
 * HOW IT WORKS NOW:
 * 1. Frontend calls getProjects() from this composable
 * 2. Nuxt makes an HTTP request to: http://localhost:3000/api/projects
 * 3. The mock API (server/api/projects.ts) intercepts the request
 * 4. Returns local JSON data with sample projects
 * 5. Frontend stores data in refs and renders it
 *
 * ============================================
 * FUTURE IMPLEMENTATION (When Backend is Ready):
 * ============================================
 * When your company's backend API is ready, you only need to change the BASE_URL.
 * The rest of the code stays exactly the same!
 *
 * Change this line:
 *   const API_BASE_URL = "http://localhost:3000"; // Local mock
 *
 * To this:
 *   const API_BASE_URL = "https://your-company-api.com"; // Real backend
 *
 * The API endpoint should match your backend's actual endpoint:
 *   GET /api/projects?userID=123
 *
 * Your backend will return the same JSON structure we're using locally,
 * and everything continues to work without code changes!
 */

import type { IPBaseObject } from "~/utils/types/CommonProperties";

export interface WorkItem extends IPBaseObject {
  id: string;
  title: string;
  description: string;
  category?: string;
  status?: "inbox" | "working" | "outbox";
}

/**
 * Fetch all active projects for a user
 *
 * CURRENT: Calls local mock API at /api/projects
 * FUTURE: Will call your company's backend API once endpoint is provided
 *
 * @param userID The user ID (optional for now, will be used for backend auth)
 * @returns Promise with array of WorkItem/Project objects
 */
export const getProjects = (userID?: string | number) => {
  // ============ CHANGE THIS WHEN BACKEND IS READY ============
  // For now, use localhost (local mock API)
  const API_BASE_URL = "http://localhost:3000";

  // When backend is ready, replace with:
  // const API_BASE_URL = "https://your-company-api.com";
  // ============================================================

  const query = new URLSearchParams();
  if (userID) {
    query.append("userID", userID.toString());
  }

  return useFetch<WorkItem[]>(`/api/projects${query.toString() ? "?" + query : ""}`, {
    baseURL: API_BASE_URL,
    method: "get",
  });
};

/**
 * Get a single project by ID
 *
 * CURRENT: Calls local mock API
 * FUTURE: Calls backend API
 *
 * @param projectID The project ID
 * @returns Promise with single WorkItem/Project object
 */
export const getProjectDescription = (projectID: string | number) => {
  const API_BASE_URL = "http://localhost:3000";

  return useFetch<WorkItem>(`/api/projects/${projectID}`, {
    baseURL: API_BASE_URL,
    method: "get",
  });
};

/**
 * Get publication destinations for a project
 *
 * CURRENT: Calls local mock API
 * FUTURE: Calls backend API
 *
 * @param projectID The project ID
 * @returns Promise with array of destination platform names
 */
export const getProjectDestinations = (projectID: string | number) => {
  const API_BASE_URL = "http://localhost:3000";

  return useFetch<{ destinations: string[] }>(`/api/projects/${projectID}/destinations`, {
    baseURL: API_BASE_URL,
    method: "get",
  });
};
