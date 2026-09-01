"use client";

import { useState } from "react";
import {
  X,
  Info,
  Edit2,
  Plus,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Maximize2,
  ChevronDown,
  ChevronRight,
  Tag,
  Lock,
  Globe,
  ArrowLeft
} from "lucide-react";
import { Project } from "@/types";
import { getNextSequentialProjectKey } from "@/lib/utils";

interface NewProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrowseTemplates: () => void;
  onProjectCreated: (newProject: Project) => void;
  existingProjects: Project[];
  selectedTemplateId?: string;
}

export default function NewProjectFormModal({
  isOpen,
  onClose,
  onBrowseTemplates,
  onProjectCreated,
  existingProjects,
  selectedTemplateId = "BLANK",
}: NewProjectFormModalProps) {
  const [title, setTitle] = useState<string>("");
  const [owner, setOwner] = useState<string>("u1");
  const [template, setTemplate] = useState<string>(selectedTemplateId);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState<string>("");
  const [isStrict, setIsStrict] = useState<boolean>(false);
  const [projectGroup, setProjectGroup] = useState<string>("Default Group");
  const [description, setDescription] = useState<string>("");
  const [businessHours, setBusinessHours] = useState<string>("Standard Business Hours");
  const [layout, setLayout] = useState<string>("Standard Layout");
  const [tags, setTags] = useState<string[]>(["Enterprise", "Q3"]);
  const [tagInput, setTagInput] = useState<string>("");

  // Collapsible Accordions
  const [rollupEnabled, setRollupEnabled] = useState<boolean>(true);
  const [tabsAccordionOpen, setTabsAccordionOpen] = useState<boolean>(true);
  const [accessAccordionOpen, setAccessAccordionOpen] = useState<boolean>(true);
  const [projectAccess, setProjectAccess] = useState<"PRIVATE" | "PUBLIC">("PRIVATE");

  // Selected Tabs for Project
  const [selectedTabs, setSelectedTabs] = useState<string[]>([
    "Dashboard",
    "Tasks",
    "Users",
    "Reports",
    "Documents",
    "Phases",
    "Time Logs",
    "Forums",
    "Timesheet",
  ]);

  if (!isOpen) return null;

  const availableModules = [
    "Dashboard",
    "Tasks",
    "Users",
    "Reports",
    "Documents",
    "Phases",
    "Time Logs",
    "Finance",
    "Expense Claims",
    "Bugs",
    "Forums",
    "Pages",
    "Timesheet",
  ];

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleTabModule = (mod: string) => {
    if (selectedTabs.includes(mod)) {
      setSelectedTabs(selectedTabs.filter((t) => t !== mod));
    } else {
      setSelectedTabs([...selectedTabs, mod]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a Project Title");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const savedPrefix = (typeof window !== "undefined" && localStorage.getItem("portal_project_prefix")) || "DT";
    const generatedKey = getNextSequentialProjectKey(existingProjects, savedPrefix);
    const numericUniqueId = `473238${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    let createdProject: any = null;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: title.trim(),
          key: generatedKey,
          startDate: startDate || new Date().toISOString().split("T")[0],
          dueDate: endDate || undefined,
          description: description || `Group: ${projectGroup} | Business Hours: ${businessHours}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        createdProject = data.project;
      }
    } catch (e) {
      console.warn("API creation fallback:", e);
    }

    const finalProject: Project = createdProject || ({
      id: numericUniqueId,
      name: title.trim(),
      key: generatedKey,
      status: "ACTIVE",
      startDate: startDate ? new Date(startDate) : new Date(),
      dueDate: endDate ? new Date(endDate) : undefined,
      description: description || `Group: ${projectGroup}`,
      owner: { id: owner, name: owner === "u2" ? "Divakar Pandiy" : owner === "u3" ? "Sushil Verma" : "Ravi Saini", email: "ravi@taskpmp.local" } as any,
      _count: { tasks: 0, milestones: 0, timeLogs: 0 },
      budgetVariance: "+$0 (Surplus)",
      pct: 0,
      tags: tags,
    } as any);

    // Save to user_custom_projects in localStorage
    try {
      const customProjects: Project[] = JSON.parse(localStorage.getItem("user_custom_projects") || "[]");
      const filteredCustom = customProjects.filter((p) => p.id !== finalProject.id);
      filteredCustom.unshift(finalProject);
      localStorage.setItem("user_custom_projects", JSON.stringify(filteredCustom));
    } catch {}

    onProjectCreated(finalProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans p-4">
      <div className="w-full max-w-4xl max-h-[92vh] rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Step 2 Header */}
        <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">New Project</h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-bold shadow-2xs">
              <span>{layout}</span>
              <Edit2 className="h-3 w-3 cursor-pointer hover:text-blue-700" />
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 2 Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
          
          {/* Project Title (Required) */}
          <div>
            <label className="flex items-center gap-1 text-xs font-bold text-slate-800 mb-1.5">
              <span>Project Title</span>
              <span className="text-rose-500 font-bold">*</span>
              <span title="Unique title for your project">
                <Info className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. 07 Command Center Automation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-900 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Row 1: Owner & Template */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Owner</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#0066FF] focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="u1">Ravi Saini (Current User)</option>
                <option value="u2">Divakar Pandiy</option>
                <option value="u3">Sushil Verma</option>
                <option value="u4">Admin User</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#0066FF] focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="BLANK">Blank project</option>
                <option value="SOFTWARE_IT">Software & IT Engineering</option>
                <option value="CONSTRUCTION">Construction & Civil Work</option>
                <option value="DIGITAL_MARKETING">Digital Marketing Campaign</option>
                <option value="PHARMA">Pharma Clinical Trial Protocol</option>
              </select>
            </div>
          </div>

          {/* Row 2: Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#0066FF] focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#0066FF] focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Checkbox: Strict Project */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="strictProjectCheck"
              checked={isStrict}
              onChange={(e) => setIsStrict(e.target.checked)}
              className="rounded text-[#0066FF] focus:ring-0 h-4 w-4 cursor-pointer"
            />
            <label htmlFor="strictProjectCheck" className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer">
              <span>Make this a strict project</span>
              <span title="Enforces start/due date boundaries for tasks within project dates">
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </span>
            </label>
          </div>

          {/* Project Group */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">Project Group</label>
              <button
                type="button"
                onClick={() => {
                  const grp = prompt("Enter New Group Name:", "Engineering Team");
                  if (grp) setProjectGroup(grp);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0066FF] hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add new group</span>
              </button>
            </div>
            <select
              value={projectGroup}
              onChange={(e) => setProjectGroup(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#0066FF] focus:outline-none shadow-2xs cursor-pointer"
            >
              <option value="Default Group">Default Group</option>
              <option value="Internal Operations">Internal Operations</option>
              <option value="Client Projects">Client Projects</option>
              <option value="Research & Development">Research & Development</option>
            </select>
          </div>

          {/* Description Rich Text Editor Toolbar */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Description</label>
            <div className="rounded-lg border border-slate-300 overflow-hidden bg-white shadow-2xs">
              {/* Rich Text Toolbar */}
              <div className="bg-slate-100 border-b border-slate-200 p-2 flex items-center flex-wrap gap-1 text-slate-600">
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <Underline className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <Strikethrough className="h-3.5 w-3.5" />
                </button>
                <span className="h-4 w-px bg-slate-300 mx-1" />
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <AlignCenter className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <AlignRight className="h-3.5 w-3.5" />
                </button>
                <span className="h-4 w-px bg-slate-300 mx-1" />
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <List className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center">
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
                <span className="h-4 w-px bg-slate-300 mx-1" />
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-xs font-bold flex items-center gap-1 px-2 bg-blue-50 text-[#0066FF]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold">AI Assistant</span>
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Add detailed project goals, deliverables, and scope..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs text-slate-800 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Row 3: Business Hours & Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Business Hours</label>
              <select
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#0066FF] focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="Standard Business Hours">Standard Business Hours (9 AM - 6 PM)</option>
                <option value="24x7 Shift Support">24x7 Shift Support</option>
                <option value="US Eastern Time (EST)">US Eastern Time (EST)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Layout</label>
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#0066FF] focus:outline-none shadow-2xs cursor-pointer"
              >
                <option value="Standard Layout">Standard Layout</option>
                <option value="Agile Software Layout">Agile Software Layout</option>
                <option value="Construction WBS Layout">Construction WBS Layout</option>
              </select>
            </div>
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Tags</label>
            <div className="rounded-lg border border-slate-300 bg-white p-2 flex items-center flex-wrap gap-1.5 focus-within:border-[#0066FF]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                >
                  <Tag className="h-3 w-3 text-slate-400" />
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-600 font-bold ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Enter a tag name and press Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="flex-1 min-w-[160px] text-xs text-slate-800 focus:outline-none px-1 py-0.5"
              />
            </div>
          </div>

          {/* Collapsible Accordion 1: Roll-up */}
          <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50/50">
            <div className="p-3.5 flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rollupEnabled}
                  onChange={(e) => setRollupEnabled(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-0 h-4 w-4 cursor-pointer"
                />
                <span>Roll-up (Automatically roll-up dates, work hours, time logs, and completion % to parent tasks & milestones)</span>
              </label>
            </div>
          </div>

          {/* Collapsible Accordion 2: Customize Tabs for this Project */}
          <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setTabsAccordionOpen(!tabsAccordionOpen)}
              className="w-full p-3.5 bg-slate-50 text-left flex items-center justify-between font-bold text-xs text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Customize Tabs for this Project</span>
              {tabsAccordionOpen ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
            </button>

            {tabsAccordionOpen && (
              <div className="p-4 border-t border-slate-200 flex flex-wrap gap-2">
                {availableModules.map((mod) => {
                  const isSelected = selectedTabs.includes(mod);
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => toggleTabModule(mod)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#0066FF] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isSelected ? `✓ ${mod}` : `+ ${mod}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Collapsible Accordion 3: Project Access */}
          <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setAccessAccordionOpen(!accessAccordionOpen)}
              className="w-full p-3.5 bg-slate-50 text-left flex items-center justify-between font-bold text-xs text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span>Project Access Privacy</span>
              {accessAccordionOpen ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
            </button>

            {accessAccordionOpen && (
              <div className="p-4 border-t border-slate-200 space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:border-[#0066FF]">
                  <input
                    type="radio"
                    name="accessPrivacy"
                    checked={projectAccess === "PRIVATE"}
                    onChange={() => setProjectAccess("PRIVATE")}
                    className="mt-0.5 text-[#0066FF] focus:ring-0 h-4 w-4 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Lock className="h-3.5 w-3.5 text-slate-600" />
                      <span>Private</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Only added project users can access and view tasks under this project.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:border-[#0066FF]">
                  <input
                    type="radio"
                    name="accessPrivacy"
                    checked={projectAccess === "PUBLIC"}
                    onChange={() => setProjectAccess("PUBLIC")}
                    className="mt-0.5 text-[#0066FF] focus:ring-0 h-4 w-4 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Globe className="h-3.5 w-3.5 text-slate-600" />
                      <span>Public</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      All portal users can view and follow project progress.
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Step 2 Footer Actions */}
        <div className="border-t border-slate-200 bg-slate-50 p-4 px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBrowseTemplates}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Browse Templates</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="px-6 py-2 text-xs font-bold text-white rounded-lg bg-[#0066FF] hover:bg-blue-700 disabled:opacity-50 shadow-md transition-colors cursor-pointer"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
