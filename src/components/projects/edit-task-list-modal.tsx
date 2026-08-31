"use client";

import { useState, useEffect } from "react";
import { X, Tag, Info } from "lucide-react";

interface EditTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskList: any;
  onSave: (updated: any) => void;
}

export default function EditTaskListModal({
  isOpen,
  onClose,
  taskList,
  onSave,
}: EditTaskListModalProps) {
  const [name, setName] = useState("");
  const [milestone, setMilestone] = useState("None");
  const [flag, setFlag] = useState<"Internal" | "External">("Internal");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (taskList) {
      setName(taskList.name || "");
      setMilestone(taskList.milestone || "None");
      setFlag(taskList.flag || "Internal");
      setTags(taskList.tags || ["software", "taskpmp"]);
    }
  }, [taskList]);

  if (!isOpen || !taskList) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleUpdate = () => {
    if (!name.trim()) {
      alert("Task List name cannot be empty");
      return;
    }
    onSave({
      ...taskList,
      name: name.trim(),
      milestone,
      flag,
      tags,
    });
    alert(`Task list '${name}' updated successfully.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn text-xs font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Edit Task List</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Task List Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-slate-300 p-2.5 text-xs font-bold focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Related Milestone</label>
            <select
              value={milestone}
              onChange={(e) => setMilestone(e.target.value)}
              className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer"
            >
              <option value="None">None</option>
              <option value="Planning">Planning</option>
              <option value="Design">Design</option>
              <option value="Build">Build</option>
              <option value="Testing">Testing</option>
              <option value="Cleaning and final walk-through work items">Cleaning and final walk-through work items</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Task List Flag</label>
            <select
              value={flag}
              onChange={(e) => setFlag(e.target.value as any)}
              className="w-full rounded border border-slate-300 p-2 text-xs bg-white focus:border-orange-500 cursor-pointer font-medium"
            >
              <option value="Internal">Internal</option>
              <option value="External">External</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tags</label>
            <div className="flex flex-wrap items-center gap-1.5 rounded border border-orange-400 p-2 bg-white min-h-[38px]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 bg-[#38bdf8] text-white px-2 py-0.5 rounded-full text-[11px] font-bold"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-slate-200 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 min-w-[80px] border-none text-xs focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={handleUpdate}
            className="rounded-md bg-orange-500 hover:bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-orange-400 bg-white px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
