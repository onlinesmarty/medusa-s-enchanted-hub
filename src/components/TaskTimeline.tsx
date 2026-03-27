import { motion } from "framer-motion";
import { Task, STATUS_COLORS, PRIORITY_COLORS, AGENTS } from "@/types/tasks";
import { useMemo } from "react";

interface TaskTimelineProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskTimeline = ({ tasks, onTaskClick }: TaskTimelineProps) => {
  const { sortedTasks, minDate, totalDays } = useMemo(() => {
    const withDates = tasks.filter(t => t.dueDate);
    if (withDates.length === 0) return { sortedTasks: [], minDate: new Date(), totalDays: 30 };

    const dates = withDates.map(t => new Date(t.createdAt).getTime());
    const dueDates = withDates.map(t => new Date(t.dueDate!).getTime());
    const min = new Date(Math.min(...dates));
    const max = new Date(Math.max(...dueDates));
    const days = Math.max(Math.ceil((max.getTime() - min.getTime()) / 86400000) + 5, 14);

    return {
      sortedTasks: withDates.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      minDate: min,
      totalDays: days,
    };
  }, [tasks]);

  const getBarProps = (task: Task) => {
    const start = Math.max(0, (new Date(task.createdAt).getTime() - minDate.getTime()) / 86400000);
    const end = (new Date(task.dueDate!).getTime() - minDate.getTime()) / 86400000;
    const width = Math.max(end - start, 1);
    return { left: (start / totalDays) * 100, width: (width / totalDays) * 100 };
  };

  // Generate day markers
  const dayMarkers = useMemo(() => {
    const markers = [];
    for (let i = 0; i <= totalDays; i += Math.max(1, Math.floor(totalDays / 10))) {
      const d = new Date(minDate.getTime() + i * 86400000);
      markers.push({ pos: (i / totalDays) * 100, label: d.toLocaleDateString("es-ES", { day: "numeric", month: "short" }) });
    }
    return markers;
  }, [minDate, totalDays]);

  // Find dependency lines
  const depLines = useMemo(() => {
    const lines: { from: Task; to: Task }[] = [];
    sortedTasks.forEach(task => {
      task.dependencies.forEach(depId => {
        const dep = sortedTasks.find(t => t.id === depId);
        if (dep) lines.push({ from: dep, to: task });
      });
    });
    return lines;
  }, [sortedTasks]);

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-mono text-sm">
        No hay tareas con fechas para mostrar en el timeline
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="relative h-8 mb-2 border-b border-border/30">
        {dayMarkers.map((m, i) => (
          <div key={i} className="absolute text-[9px] font-mono text-muted-foreground" style={{ left: `${m.pos}%` }}>
            {m.label}
            <div className="absolute top-5 left-0 w-px h-[calc(100vh)] bg-border/10" />
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-1.5 relative" style={{ minWidth: "600px" }}>
        {/* Dependency lines (SVG overlay) */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: `${sortedTasks.length * 36}px` }}>
          {depLines.map(({ from, to }, i) => {
            const fromIdx = sortedTasks.indexOf(from);
            const toIdx = sortedTasks.indexOf(to);
            const fromBar = getBarProps(from);
            const toBar = getBarProps(to);
            const x1 = fromBar.left + fromBar.width;
            const x2 = toBar.left;
            const y1 = fromIdx * 36 + 16;
            const y2 = toIdx * 36 + 16;
            return (
              <g key={i}>
                <line x1={`${x1}%`} y1={y1} x2={`${x2}%`} y2={y2}
                  stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx={`${x2}%`} cy={y2} r="2.5" fill="hsl(var(--primary) / 0.5)" />
              </g>
            );
          })}
        </svg>

        {sortedTasks.map((task, i) => {
          const agent = AGENTS.find(a => a.id === task.assignee);
          const bar = getBarProps(task);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative h-8 flex items-center cursor-pointer group"
              onClick={() => onTaskClick(task)}
            >
              {/* Bar */}
              <motion.div
                className="absolute h-6 rounded-md flex items-center px-2 gap-1 overflow-hidden"
                style={{
                  left: `${bar.left}%`,
                  width: `${bar.width}%`,
                  minWidth: "80px",
                  backgroundColor: STATUS_COLORS[task.status],
                  opacity: 0.85,
                }}
                whileHover={{ opacity: 1, scale: 1.02 }}
              >
                {/* Progress fill */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(90deg, hsl(0 0% 100% / 0.15) ${task.progress}%, transparent ${task.progress}%)`,
                  }}
                />
                <span className="text-[9px] font-mono font-semibold text-white truncate relative z-10">
                  {agent?.emoji} {task.title}
                </span>
                <span className="text-[8px] font-mono text-white/70 ml-auto relative z-10 flex-shrink-0">
                  {task.progress}%
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskTimeline;
