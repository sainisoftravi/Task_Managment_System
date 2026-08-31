"use client";

import { useState } from "react";
import { LayoutGrid, Check, Sparkles, X, ArrowRight, ShieldCheck, Cpu, HardHat, Megaphone, Truck, Activity, FileSpreadsheet, Building2, ShoppingBag, Stethoscope } from "lucide-react";

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateKey: string) => void;
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
}

export default function TemplateGalleryModal({ isOpen, onClose, onSelectTemplate }: TemplateGalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const templates: TemplateCard[] = [
    {
      id: "SOFTWARE_IT",
      category: "Software/IT",
      title: "Standard Software & IT Engineering",
      description: "Complete SDLC workflow with Sprint Planning, Code Review, QA Testing, and Cloud Deployment.",
      phasesCount: 4,
      tasksCount: 18,
      icon: Cpu,
      color: "bg-blue-500",
    },
    {
      id: "CONSTRUCTION",
      category: "Construction",
      title: "Villa Construction & Civil Work",
      description: "Pre-construction, Site Clearance, Foundation, Structural Framing, and Final Inspection.",
      phasesCount: 5,
      tasksCount: 24,
      icon: HardHat,
      color: "bg-amber-500",
    },
    {
      id: "DIGITAL_MARKETING",
      category: "Marketing/Sales",
      title: "Digital Marketing & SEO Campaign",
      description: "Keyword Research, Content Writing, Social Media Ads, Influencer Outreach, and Analytics.",
      phasesCount: 3,
      tasksCount: 15,
      icon: Megaphone,
      color: "bg-[#0070BA]",
    },
    {
      id: "MANUFACTURING",
      category: "Manufacturing",
      title: "Manufacturing Quality Inspection",
      description: "Raw Material Sourcing, Assembly Line QA, Tolerance Testing, and Logistics Dispatch.",
      phasesCount: 4,
      tasksCount: 20,
      icon: Activity,
      color: "bg-purple-500",
    },
    {
      id: "VEHICLE_INSPECTION",
      category: "Logistics",
      title: "Vehicle Fleet & Safety Inspection",
      description: "Engine Check, Transmission Test, Safety Compliance, and Regulatory Certification.",
      phasesCount: 3,
      tasksCount: 12,
      icon: Truck,
      color: "bg-emerald-500",
    },
    {
      id: "UX_RESEARCH",
      category: "Design",
      title: "UX Research & Product Design",
      description: "User Interviews, Wireframing, Figma Prototypes, Usability Testing, and Handoff.",
      phasesCount: 4,
      tasksCount: 16,
      icon: Sparkles,
      color: "bg-indigo-500",
    },
    {
      id: "PHARMA",
      category: "Healthcare",
      title: "Pharma Clinical Trial Protocol",
      description: "Phase 1 Safety Review, Patient Recruitment, Lab Diagnostics, and FDA Submission.",
      phasesCount: 5,
      tasksCount: 30,
      icon: Stethoscope,
      color: "bg-teal-500",
    },
    {
      id: "APARTMENT_MAINTENANCE",
      category: "Property Management",
      title: "Apartment Routine Maintenance",
      description: "Elevator Service, Water Tank Sanitization, Generator Inspection, and Security Audit.",
      phasesCount: 3,
      tasksCount: 10,
      icon: Building2,
      color: "bg-rose-500",
    },
  ];

  if (!isOpen) return null;

  const categories = ["ALL", "Software/IT", "Construction", "Marketing/Sales", "Manufacturing", "Logistics", "Healthcare"];

  const filtered = templates.filter((t) => selectedCategory === "ALL" || t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs font-sans">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white p-6 shadow-2xl border border-slate-200 flex flex-col">
        {/* Gallery Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-[#0070BA]" />
              <span>Project Template Gallery</span>
            </h2>
            <p className="text-xs text-slate-500">Choose a predefined enterprise template to launch your project instantly</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-100 text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full transition-colors ${
                selectedCategory === cat
                  ? "bg-[#0070BA] text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Cards Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs hover:border-[#0070BA] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg text-white shadow-xs ${tpl.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {tpl.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#0070BA] transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-3">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{tpl.phasesCount} Phases • {tpl.tasksCount} Tasks</span>
                  <button
                    onClick={() => {
                      onSelectTemplate(tpl.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 font-bold text-[#0070BA] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
