"use client";

import { useState } from "react";
import {
  LayoutGrid,
  Check,
  Sparkles,
  X,
  ArrowRight,
  ShieldCheck,
  Cpu,
  HardHat,
  Megaphone,
  Truck,
  Activity,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Building2,
  Stethoscope,
  Kanban,
  List as ListIcon
} from "lucide-react";

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  onProceedToForm: () => void;
}

interface TemplateCard {
  id: string;
  category: string;
  title: string;
  description: string;
  phasesCount: number;
  tasksCount: number;
  icon: any;
  color: string;
  isCustom?: boolean;
}

export default function TemplateGalleryModal({
  isOpen,
  onClose,
  onSelectTemplate,
  onProceedToForm,
}: TemplateGalleryModalProps) {
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("BLANK");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOption, setFilterOption] = useState<string>("All Templates");
  const [doNotShowAgain, setDoNotShowAgain] = useState<boolean>(false);

  if (!isOpen) return null;

  const filterTabs = [
    "All",
    "Project Templates",
    "Software/IT",
    "Construction",
    "Pharma",
    "Marketing/Sales",
    "More (···)",
  ];

  const templates: TemplateCard[] = [
    {
      id: "SOFTWARE_IT",
      category: "Software/IT",
      title: "Software & IT Engineering",
      description: "Complete SDLC workflow with Sprint Planning, Code Review, QA Testing, and Cloud Deployment.",
      phasesCount: 4,
      tasksCount: 18,
      icon: Cpu,
      color: "bg-blue-600 text-white",
    },
    {
      id: "CONSTRUCTION",
      category: "Construction",
      title: "Construction & Civil Engineering",
      description: "Pre-construction, Site Clearance, Foundation, Structural Framing, and Final Inspection.",
      phasesCount: 5,
      tasksCount: 24,
      icon: HardHat,
      color: "bg-amber-600 text-white",
    },
    {
      id: "DIGITAL_MARKETING",
      category: "Marketing/Sales",
      title: "Digital Marketing Campaign",
      description: "Keyword Research, Content Writing, Social Media Ads, Influencer Outreach, and Analytics.",
      phasesCount: 3,
      tasksCount: 15,
      icon: Megaphone,
      color: "bg-[#0066FF] text-white",
    },
    {
      id: "PHARMA",
      category: "Pharma",
      title: "Pharma Clinical Trial Protocol",
      description: "Phase 1 Safety Review, Patient Recruitment, Lab Diagnostics, and Regulatory Submission.",
      phasesCount: 5,
      tasksCount: 30,
      icon: Stethoscope,
      color: "bg-teal-600 text-white",
    },
    {
      id: "MANUFACTURING",
      category: "Others",
      title: "Manufacturing Quality Inspection",
      description: "Raw Material Sourcing, Assembly Line QA, Tolerance Testing, and Logistics Dispatch.",
      phasesCount: 4,
      tasksCount: 20,
      icon: Activity,
      color: "bg-purple-600 text-white",
    },
    {
      id: "UX_RESEARCH",
      category: "Software/IT",
      title: "UX Research & Product Design",
      description: "User Interviews, Wireframing, Figma Prototypes, Usability Testing, and Dev Handoff.",
      phasesCount: 4,
      tasksCount: 16,
      icon: Sparkles,
      color: "bg-indigo-600 text-white",
    },
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory =
      selectedTab === "All" ||
      (selectedTab === "Project Templates" && true) ||
      (selectedTab === "Software/IT" && tpl.category === "Software/IT") ||
      (selectedTab === "Construction" && tpl.category === "Construction") ||
      (selectedTab === "Pharma" && tpl.category === "Pharma") ||
      (selectedTab === "Marketing/Sales" && tpl.category === "Marketing/Sales") ||
      selectedTab.includes("More");

    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCreateProject = () => {
    onSelectTemplate(selectedTemplateId);
    onProceedToForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans p-4">
      <div className="w-full max-w-5xl max-h-[92vh] rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Step 1 Header Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-[#0066FF]" />
                <span>Select Project Template</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose a pre-configured template layout or start with a blank project
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Tabs & Search Bar Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-semibold scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    selectedTab === tab
                      ? "bg-[#0066FF] text-white font-bold shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filter Dropdown & Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs focus:border-[#0066FF] focus:outline-none appearance-none pr-8 cursor-pointer"
                >
                  <option value="All Templates">All Templates</option>
                  <option value="System Templates">System Templates</option>
                  <option value="My Custom Templates">My Custom Templates</option>
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <div className="relative w-48 sm:w-56">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white pl-8 pr-3 py-1.5 text-xs focus:border-[#0066FF] focus:outline-none shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-slate-50/50">
          
          {/* Blank Project Card (Default selected) */}
          <div
            onClick={() => setSelectedTemplateId("BLANK")}
            className={`rounded-xl border-2 border-dashed p-5 transition-all cursor-pointer flex flex-col justify-between group ${
              selectedTemplateId === "BLANK"
                ? "border-[#0066FF] bg-blue-50/60 ring-2 ring-[#0066FF]/20 shadow-md"
                : "border-slate-300 bg-white hover:border-[#0066FF] hover:bg-slate-50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-[#0066FF] flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                {selectedTemplateId === "BLANK" && (
                  <span className="h-6 w-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-xs">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                Blank Project
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Start everything from scratch. Configure custom milestones, task lists, and modules manually.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>0 Phases • Custom Layout</span>
              <span className="text-[#0066FF] font-bold">Standard</span>
            </div>
          </div>

          {/* Predefined Template Cards */}
          {filteredTemplates.map((tpl) => {
            const Icon = tpl.icon;
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`rounded-xl border p-5 transition-all cursor-pointer flex flex-col justify-between group bg-white ${
                  isSelected
                    ? "border-[#0066FF] ring-2 ring-[#0066FF]/20 shadow-md bg-blue-50/20"
                    : "border-slate-200 hover:border-[#0066FF] hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg shadow-xs ${tpl.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {isSelected ? (
                      <span className="h-6 w-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-xs">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {tpl.category}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                    {tpl.description}
                  </p>

                  {/* Layout View Badges */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      <ListIcon className="h-3 w-3 text-slate-500" /> List
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      <Kanban className="h-3 w-3 text-slate-500" /> Kanban
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{tpl.phasesCount} Phases • {tpl.tasksCount} Tasks</span>
                  <span className="font-bold text-[#0066FF] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Select <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step 1 Footer Actions */}
        <div className="border-t border-slate-200 bg-white p-4 px-6 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={doNotShowAgain}
              onChange={(e) => setDoNotShowAgain(e.target.checked)}
              className="rounded text-[#0066FF] focus:ring-0 h-4 w-4"
            />
            <span>Do not show this again</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              className="px-5 py-2 text-xs font-bold text-white rounded-lg bg-[#0066FF] hover:bg-blue-700 shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Create Project</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
