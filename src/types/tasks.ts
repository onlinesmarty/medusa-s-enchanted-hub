export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string; // agent id
  dueDate: string | null;
  dependencies: string[]; // task ids
  tags: string[];
  progress: number; // 0-100
  apiCost: number; // USD
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  hairColor: string;
  skinTone: string;
  outfitColor: string;
  emoji: string;
  apiCostPerDay: number;
  model: string;
}

export const AGENTS: Agent[] = [
  {
    id: "medusa",
    name: "Medusa",
    role: "Coordinadora General",
    color: "hsl(155 60% 45%)",
    hairColor: "hsl(155 50% 35%)",
    skinTone: "hsl(30 60% 80%)",
    outfitColor: "hsl(155 50% 30%)",
    emoji: "🐍",
    apiCostPerDay: 4.20,
    model: "Claude Opus",
  },
  {
    id: "content-creator",
    name: "Content Creator",
    role: "Creadora de Contenido",
    color: "hsl(330 70% 60%)",
    hairColor: "hsl(330 50% 35%)",
    skinTone: "hsl(25 55% 78%)",
    outfitColor: "hsl(330 60% 45%)",
    emoji: "✨",
    apiCostPerDay: 2.80,
    model: "GPT-4o",
  },
  {
    id: "dev-guardian",
    name: "Dev Guardian",
    role: "Guardiana del Código",
    color: "hsl(200 70% 50%)",
    hairColor: "hsl(220 40% 20%)",
    skinTone: "hsl(28 50% 82%)",
    outfitColor: "hsl(200 60% 35%)",
    emoji: "🛡️",
    apiCostPerDay: 5.10,
    model: "Claude Sonnet",
  },
  {
    id: "pm-estrategico",
    name: "PM Estratégico",
    role: "Project Manager",
    color: "hsl(45 80% 55%)",
    hairColor: "hsl(35 70% 30%)",
    skinTone: "hsl(30 55% 75%)",
    outfitColor: "hsl(45 70% 40%)",
    emoji: "📋",
    apiCostPerDay: 1.90,
    model: "GPT-4o-mini",
  },
  {
    id: "search-master",
    name: "Search Master",
    role: "Maestra de Búsqueda",
    color: "hsl(270 55% 55%)",
    hairColor: "hsl(270 40% 25%)",
    skinTone: "hsl(32 58% 79%)",
    outfitColor: "hsl(270 45% 40%)",
    emoji: "🔍",
    apiCostPerDay: 3.40,
    model: "Perplexity Pro",
  },
  {
    id: "siren",
    name: "Siren",
    role: "Comunicaciones & Alertas",
    color: "hsl(185 70% 50%)",
    hairColor: "hsl(185 50% 30%)",
    skinTone: "hsl(27 52% 81%)",
    outfitColor: "hsl(185 60% 35%)",
    emoji: "🧜‍♀️",
    apiCostPerDay: 2.10,
    model: "Gemini Flash",
  },
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "Por Hacer",
  in_progress: "En Progreso",
  review: "En Revisión",
  done: "Hecho",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: "hsl(220 10% 50%)",
  todo: "hsl(45 80% 55%)",
  in_progress: "hsl(200 70% 50%)",
  review: "hsl(270 55% 55%)",
  done: "hsl(155 60% 45%)",
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "hsl(220 10% 50%)",
  medium: "hsl(45 80% 55%)",
  high: "hsl(25 80% 55%)",
  urgent: "hsl(0 70% 55%)",
};
