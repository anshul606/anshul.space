"use client";

import { useState, useEffect } from "react";
import { getGeneralSettings, updateGeneralSettings } from "@/lib/achievements-firestore";

interface TechStackItem {
  name: string;
  iconSvg?: string;
}

const PREDEFINED_TECH = [
  "TypeScript",
  "Next.js",
  "React.js",
  "Tailwind CSS",
  "Node.js",
  "Firebase",
  "Convex",
  "Rust",
  "Three.js",
  "Git / GitHub",
  "HTML 5",
  "CSS 3"
];

const inputClasses =
  "px-4 py-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors text-sm";
const textAreaClasses =
  "w-full px-4 py-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors text-xs font-mono";

export default function AdminSettingsForm() {
  const [availableForWork, setAvailableForWork] = useState(false);
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [customTech, setCustomTech] = useState("");
  const [customSvg, setCustomSvg] = useState("");
  const [locationName, setLocationName] = useState("Jaipur, India");
  const [locationLat, setLocationLat] = useState("26.9124");
  const [locationLng, setLocationLng] = useState("75.7873");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getGeneralSettings();
        if (settings) {
          setAvailableForWork(settings.availableForWork);
          setTechStack(settings.techStack || PREDEFINED_TECH.map(name => ({ name })));
          setLocationName(settings.locationName || "Jaipur, India");
          setLocationLat(String(settings.locationLat ?? "26.9124"));
          setLocationLng(String(settings.locationLng ?? "75.7873"));
          setTimezone(settings.timezone || "Asia/Kolkata");
        } else {
          setTechStack(PREDEFINED_TECH.map(name => ({ name })));
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    const lat = parseFloat(locationLat);
    const lng = parseFloat(locationLng);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setMessage({ type: "error", text: "Latitude must be a valid number between -90 and 90." });
      setIsSaving(false);
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setMessage({ type: "error", text: "Longitude must be a valid number between -180 and 180." });
      setIsSaving(false);
      return;
    }

    try {
      await updateGeneralSettings(availableForWork, techStack, locationName, lat, lng, timezone);
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } catch (err) {
      console.error("Failed to update settings:", err);
      setMessage({ type: "error", text: "Failed to update settings" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTech = (name: string, iconSvg?: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    if (techStack.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())) {
      setMessage({ type: "error", text: `"${trimmedName}" is already in your tech stack` });
      return;
    }
    
    // Quick sanitization check on SVG if provided
    let svgToSave = iconSvg?.trim() || "";
    if (svgToSave && !svgToSave.toLowerCase().startsWith("<svg")) {
      setMessage({ type: "error", text: "Invalid custom icon. Must be a valid SVG string starting with '<svg'" });
      return;
    }

    setTechStack(prev => [...prev, { name: trimmedName, iconSvg: svgToSave || undefined }]);
    setMessage(null);
  };

  const handleRemoveTech = (index: number) => {
    setTechStack(prev => prev.filter((_, idx) => idx !== index));
    setMessage(null);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTech(customTech, customSvg);
    setCustomTech("");
    setCustomSvg("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-[#6b7280]">Loading settings...</span>
      </div>
    );
  }

  // Predefined options that are not currently active
  const inactivePredefined = PREDEFINED_TECH.filter(
    name => !techStack.some(active => active.name.toLowerCase() === name.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Availability Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider mb-2">
            General Portfolio Settings
          </h3>
          <p className="text-[#6b7280] text-xs">
            Toggle options to configure the status indicator shown on your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#1a1a1a]/50 p-4 border border-[rgba(255,255,255,0.06)] rounded-lg">
          <input
            type="checkbox"
            id="available-for-work"
            checked={availableForWork}
            onChange={(e) => {
              setAvailableForWork(e.target.checked);
              setMessage(null);
            }}
            className="w-5 h-5 accent-[#06b6d4] rounded bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] focus:ring-1 focus:ring-[#06b6d4] cursor-pointer"
            disabled={isSaving}
          />
          <label htmlFor="available-for-work" className="text-sm font-medium text-white cursor-pointer select-none">
            Available for Work (shows glowing green indicator next to role on homepage)
          </label>
        </div>
      </div>

      {/* Location & Clock Map Section */}
      <div className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div>
          <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider mb-2">
            Location & Map Settings
          </h3>
          <p className="text-[#6b7280] text-xs">
            Configure your location name, coordinates, and timezone for the live Map component on your homepage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 flex flex-col">
            <label htmlFor="location-name" className="text-xs font-semibold text-[#a1a1a1]">Location Name</label>
            <input
              type="text"
              id="location-name"
              placeholder="e.g. Jaipur, India"
              value={locationName}
              onChange={e => { setLocationName(e.target.value); setMessage(null); }}
              className={inputClasses}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1 flex flex-col">
            <label htmlFor="timezone-name" className="text-xs font-semibold text-[#a1a1a1]">Timezone ID</label>
            <input
              type="text"
              id="timezone-name"
              placeholder="e.g. Asia/Kolkata"
              value={timezone}
              onChange={e => { setTimezone(e.target.value); setMessage(null); }}
              className={inputClasses}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1 flex flex-col">
            <label htmlFor="location-lat" className="text-xs font-semibold text-[#a1a1a1]">Latitude</label>
            <input
              type="text"
              id="location-lat"
              placeholder="e.g. 26.9124"
              value={locationLat}
              onChange={e => { setLocationLat(e.target.value); setMessage(null); }}
              className={inputClasses}
              disabled={isSaving}
            />
          </div>

          <div className="space-y-1 flex flex-col">
            <label htmlFor="location-lng" className="text-xs font-semibold text-[#a1a1a1]">Longitude</label>
            <input
              type="text"
              id="location-lng"
              placeholder="e.g. 75.7873"
              value={locationLng}
              onChange={e => { setLocationLng(e.target.value); setMessage(null); }}
              className={inputClasses}
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Tech Stack Management */}
      <div className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div>
          <h3 className="text-sm font-medium text-[#06b6d4] uppercase tracking-wider mb-2">
            Tech Stack Cards
          </h3>
          <p className="text-[#6b7280] text-xs">
            Configure the tech stack cards displayed on your homepage. You can add or remove items below.
          </p>
        </div>

        {/* Active Tech Stack List */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#a1a1a1]">Active Tech Stack ({techStack.length})</label>
          {techStack.length === 0 ? (
            <p className="text-[#6b7280] text-sm italic bg-[#1a1a1a]/30 p-4 rounded-lg border border-dashed border-white/5">No tech stacks added. Default list will be used on homepage.</p>
          ) : (
            <div className="flex flex-wrap gap-2 bg-[#1a1a1a]/30 p-4 border border-[rgba(255,255,255,0.06)] rounded-lg">
              {techStack.map((tech, index) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#26262b] border border-white/8 rounded-md text-sm text-[#f5f5f7] select-none"
                >
                  <span className="flex items-center gap-1.5">
                    {tech.iconSvg && (
                      <span className="w-3.5 h-3.5 flex items-center justify-center opacity-65" dangerouslySetInnerHTML={{ __html: tech.iconSvg }} />
                    )}
                    <span>{tech.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(index)}
                    className="text-[#6b7280] hover:text-[#ff3344] focus:outline-none font-bold text-xs px-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Tech Stack Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Predefined Add Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#a1a1a1]">Quick Add Predefined</label>
            {inactivePredefined.length === 0 ? (
              <p className="text-[#6b7280] text-xs italic">All predefined technologies are active.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                {inactivePredefined.map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleAddTech(name)}
                    className="px-2.5 py-1 bg-white/[0.02] border border-white/5 hover:border-[#06b6d4]/50 hover:bg-[#06b6d4]/5 rounded text-xs text-[#a09fa6] hover:text-[#06b6d4] transition-all cursor-pointer"
                  >
                    + {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Add Form */}
          <div className="space-y-4 bg-[#1a1a1a]/20 p-4 border border-[rgba(255,255,255,0.06)] rounded-lg">
            <h4 className="text-xs font-semibold text-[#a1a1a1]">Add Custom Tech Stack</h4>
            <form onSubmit={handleAddCustom} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="custom-tech-name" className="block text-[10px] text-[#6b7280] uppercase tracking-wider">Technology Name</label>
                <input
                  type="text"
                  id="custom-tech-name"
                  placeholder="e.g. Docker, Python, Go"
                  value={customTech}
                  onChange={e => setCustomTech(e.target.value)}
                  className={`${inputClasses} w-full`}
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="custom-tech-svg" className="block text-[10px] text-[#6b7280] uppercase tracking-wider">Custom SVG Icon Code (Optional)</label>
                <textarea
                  id="custom-tech-svg"
                  placeholder="<svg ...>...</svg>"
                  value={customSvg}
                  onChange={e => setCustomSvg(e.target.value)}
                  className={`${textAreaClasses} w-full`}
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#06b6d4] hover:bg-[#22d3ee] text-black text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Add Technology
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Message & Save controls */}
      <div className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
