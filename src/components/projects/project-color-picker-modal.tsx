"use client";

import { useState } from "react";
import { X, Check, Palette } from "lucide-react";
import { Project } from "@/types";

interface ProjectColorPickerModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onColorSelected: (colorHex: string) => void;
}

export default function ProjectColorPickerModal({
  project,
  isOpen,
  onClose,
  onColorSelected,
}: ProjectColorPickerModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("#0066FF");

  if (!isOpen || !project) return null;

  const colorPalette = [
    { name: "Ocean Blue", hex: "#0066FF" },
    { name: "Teal Green", hex: "#00C49F" },
    { name: "Emerald Green", hex: "#10B981" },
    { name: "Amber Gold", hex: "#F59E0B" },
    { name: "Rose Red", hex: "#EF4444" },
    { name: "Purple", hex: "#8B5CF6" },
    { name: "Indigo", hex: "#6366F1" },
    { name: "Pink", hex: "#EC4899" },
  ];

  const handleSave = () => {
    onColorSelected(selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs font-sans p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl border border-slate-200 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Palette className="h-4 w-4 text-[#0066FF]" />
            <span>Select Project Accent Color</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="py-4">
          <p className="text-xs text-slate-500 mb-3">
            Choose an accent color badge for <strong className="text-slate-900">{project.name}</strong>
          </p>

          <div className="grid grid-cols-4 gap-3">
            {colorPalette.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setSelectedColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className="h-10 rounded-lg flex items-center justify-center text-white shadow-xs hover:scale-105 transition-transform relative cursor-pointer"
                title={c.name}
              >
                {selectedColor === c.hex && <Check className="h-5 w-5 font-bold" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-[#0066FF] text-white text-xs font-bold hover:bg-blue-700 shadow-xs cursor-pointer"
          >
            Apply Color
          </button>
        </div>
      </div>
    </div>
  );
}
