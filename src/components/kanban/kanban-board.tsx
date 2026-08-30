"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DragStart, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { colorForPriority, formatDate, getDaysOverdue } from "@/lib/utils";
import { Clock, User, Flag, Calendar, Plus, AlertCircle } from "lucide-react";

const KANBAN_COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "TODO", title: "To Do", color: "bg-slate-100" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-100" },
  { id: "IN_REVIEW", title: "In Review", color: "bg-purple-100" },
  { id: "BLOCKED", title: "Blocked", color: "bg-red-100" },
  { id: "DONE", title: "Done", color: "bg-emerald-100" },
];

interface KanbanBoardProps {
  projectId?: string;
  initialTasks?: Task[];
  onTaskUpdate: (taskId: string, status: TaskStatus, position?: number) => Promise<void>;
  onAddTask: () => void;
}

export default function KanbanBoard({ projectId, initialTasks = [], onTaskUpdate, onAddTask }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStart) => {
    setActiveId(event.draggableId);
  };

  const handleDragEnd = async (event: DropResult) => {
    const { destination, source, draggableId } = event;
    setActiveId(null);

    if (!destination) return;

    const activeTask = tasks.find((t) => t.id === draggableId);
    if (!activeTask) return;

    const newStatus = destination.droppableId as TaskStatus;
    if (activeTask.status === newStatus) return;

    const validStatuses = KANBAN_COLUMNS.map((c) => c.id);
    if (!validStatuses.includes(newStatus)) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      await onTaskUpdate(draggableId, newStatus, destination.index);
    } catch (err) {
      setTasks((prev) =>
        prev.map((t) => (t.id === draggableId ? { ...t, status: activeTask.status } : t))
      );
      console.error("Failed to update task status:", err);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => t.status === column.id);
          return (
            <div
              key={column.id}
              className={`flex w-80 flex-shrink-0 flex-col gap-3 rounded-lg bg-slate-50 p-3 ${column.color.split(" ")[0]}`}
              data-testid={`column-${column.id}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">{column.title}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto"
                  >
                    {columnTasks.length === 0 ? (
                      <div className="py-8 text-center text-slate-400">
                        <AlertCircle className="mx-auto h-5 w-5 opacity-30" />
                        <p className="text-xs">No tasks</p>
                      </div>
                    ) : (
                      columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <KanbanCard task={task} activeId={activeId} />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}

        <button
          onClick={onAddTask}
          className="flex-shrink-0 rounded-lg border-2 border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-primary-500 hover:text-primary-600"
        >
          <Plus className="h-4 w-4 inline mr-1" />
          Add Task
        </button>
      </DragDropContext>
    </div>
  );
}

interface KanbanCardProps {
  task: Task;
  activeId: string | null;
}

function KanbanCard({ task, activeId }: KanbanCardProps) {
  const isDragging = activeId === task.id;

  return (
    <div
      data-testid={`task-${task.id}`}
      className={`mb-2 cursor-grab rounded-md border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-slate-900 line-clamp-2 text-sm">{task.title}</h4>
        <div className={colorForPriority(task.priority)}>
          <Flag className="h-3 w-3" />
        </div>
      </div>

      {task.description && (
        <p className="mt-1 text-xs text-slate-600 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className={getDaysOverdue(task.dueDate) > 0 ? "text-red-600" : ""}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
        {task.assignee && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{task.assignee.name || task.assignee.email}</span>
          </div>
        )}
        {(task.estimatedHours || task.loggedHours) && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{task.loggedHours ?? 0}/{task.estimatedHours ?? 0}h</span>
          </div>
        )}
      </div>

      {task.dependencies && task.dependencies.length > 0 && (
        <div className="mt-1 text-xs text-slate-500">
          Depends on: {task.dependencies.map((d) => d.dependsOn?.title || "").join(", ")}
        </div>
      )}
    </div>
  );
}
