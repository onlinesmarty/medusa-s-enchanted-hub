const API_BASE = "/api";

function normalizeTask(t: any) {
  return {
    ...t,
    dueDate: t.due_date ?? null,
    startDate: t.start_date ?? null,
    apiCost: t.api_cost ?? 0,
    createdAt: t.created_at ?? "",
    dependencies: t.dependencies ?? [],
    tags: t.tags ?? [],
    links: t.links ?? [],
    images: t.images ?? [],
    progress: t.progress ?? 0,
  };
}

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return data.map(normalizeTask);
}

export async function createTask(task: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  due_date?: string | null;
  start_date?: string | null;
  tags?: string[];
  links?: { url: string; title: string }[];
  images?: string[];
  dependencies?: string[];
}) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return normalizeTask(await res.json());
}

export async function updateTask(id: string, update: {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  progress?: number;
  due_date?: string | null;
  start_date?: string | null;
  tags?: string[];
  links?: { url: string; title: string }[];
  images?: string[];
  dependencies?: string[];
}) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return normalizeTask(await res.json());
}

export async function deleteTask(id: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}
