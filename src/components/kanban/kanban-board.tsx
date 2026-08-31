"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DragStart, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { colorForPriority, formatDate, getDaysOverdue } from "@/lib/utils";
import { Clock, User, Flag, Calendar, Plus, AlertCircle, Trash2 } from "lucide-react";

const KANBAN_COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "TODO", title: "To Do", color: "bg-slate-100" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-100" },
  { id: "IN_REVIEW", title: "In Review", color: "bg-purple-100" },
  { id: "BLOCKED", title: "Blocked", color: "bg-red-100" },
  { id: "DONE", title: "Done", color: "bg-emerald-100" },
];

const normalizeStatus = (status: string | undefined): TaskStatus => {
  if (!status) return "TODO";
  const s = String(status).toUpperCase().trim().replace(/[\s\-_]+/g, "_");
  if (s === "TO_DO" || s === "TODO" || s === "NOT_YET_STARTED" || s === "OPEN" || s === "BACKLOG") return "TODO";
  if (s === "IN_PROGRESS" || s === "INPROGRESS" || s === "WORKING" || s === "ONGOING") return "IN_PROGRESS";
  if (s === "IN_REVIEW" || s === "INREVIEW" || s === "REVIEW" || s === "TESTING") return "IN_REVIEW";
  if (s === "BLOCKED" || s === "BLOCK" || s === "HOLD" || s === "ON_HOLD") return "BLOCKED";
  if (s === "DONE" || s === "COMPLETED" || s === "CLOSED" || s === "RESOLVED") return "DONE";
  return "TODO";
};

interface KanbanBoardProps {
  projectId?: string;
  initialTasks?: Task[];
  onTaskUpdate: (taskId: string, status: TaskStatus, position?: number) => Promise<void>;
  onAddTask: () => void;
}

export default function KanbanBoard({ projectId, initialTasks = [], onTaskUpdate, onAddTask }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDragStart = (event: DragStart) => {
    setActiveId(event.draggableId);
  };

  const handleDragEnd = async (event: DropResult) => {
    const { destination, source, draggableId } = event;
    setActiveId(null);

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const activeTask = tasks.find((t) => String(t.id) === String(draggableId));
    if (!activeTask) return;

    const newStatus = destination.droppableId as TaskStatus;

    // Immediately update local state for responsive instant UI drag response
    setTasks((prev) =>
      prev.map((t) => (String(t.id) === String(draggableId) ? { ...t, status: newStatus } : t))
    );

    try {
      if (onTaskUpdate) {
        await onTaskUpdate(draggableId, newStatus, destination.index);
      }
    } catch (err) {
      console.error("Failed to update task status in drag & drop:", err);
    }
  };

  const [inlineColumn, setInlineColumn] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState("");

  const handleQuickAdd = (columnId: TaskStatus) => {
    if (!quickTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: quickTitle.trim(),
      status: columnId,
      priority: "MEDIUM",
      projectId: projectId || "p1",
      taskListId: "tl1",
      subtasks: [],
      dependencies: [],
      dependents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setQuickTitle("");
    setInlineColumn(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = tasks.filter((t) => normalizeStatus(t.status) === column.id);
          const isAddingInline = inlineColumn === column.id;

          return (
            <div
              key={column.id}
              className={`flex w-80 flex-shrink-0 flex-col gap-3 rounded-lg bg-slate-50 p-3 border border-slate-200 ${column.color.split(" ")[0]}`}
              data-testid={`column-${column.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-800">{column.title}</h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-600 shadow-2xs">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Inline Quick Add + Button matching Screenshot 2 */}
                <button
                  type="button"
                  onClick={() => setInlineColumn(isAddingInline ? null : column.id)}
                  className="p-1 rounded border border-orange-400 bg-white text-orange-600 hover:bg-orange-50 font-bold shadow-2xs cursor-pointer"
                  title="Create New Tasks"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Inline Quick Card Input matching Screenshot 2 */}
              {isAddingInline && (
                <div className="bg-white p-2.5 rounded-lg border-2 border-orange-400 shadow-md space-y-2 animate-fadeIn">
                  <textarea
                    rows={2}
                    placeholder="Enter task title and press Enter..."
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleQuickAdd(column.id);
                      }
                    }}
                    className="w-full text-xs p-1 border-none focus:outline-none font-semibold text-slate-900 resize-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(column.id)}
                      className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] rounded shadow-2xs cursor-pointer"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setInlineColumn(null)}
                      className="px-2.5 py-1 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-[10px] rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto min-h-[300px]"
                  >
                    {columnTasks.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200/80 rounded-lg my-1">
                        <AlertCircle className="mx-auto h-5 w-5 opacity-40 mb-1" />
                        <p className="text-xs font-semibold">No tasks</p>
                        <p className="text-[10px] text-slate-400">Drag task cards here</p>
                      </div>
                    ) : (
                      columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "opacity-75 cursor-grabbing" : ""}
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
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm(`Move task '${task.title}' to Trash?`)) {
                const token = localStorage.getItem("token");
                await fetch(`/api/tasks/${task.id}`, {
                  method: "DELETE",
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                }).catch(() => {});
                alert(`Task '${task.title}' moved to Trash.`);
              }
            }}
            className="p-1 rounded text-slate-300 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            title="Move Task to Trash"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <div className={colorForPriority(task.priority)}>
            <Flag className="h-3 w-3" />
          </div>
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
