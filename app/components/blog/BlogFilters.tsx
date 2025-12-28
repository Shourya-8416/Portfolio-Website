"use client";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, VALID_SECTIONS } from "@/utils/sections";

interface BlogFiltersProps {
  allTags: string[];
  selectedSection: Section | null;
  selectedTags: string[];
  onSectionChange: (section: Section | null) => void;
  onTagsChange: (tags: string[]) => void;
}

export default function BlogFilters({
  allTags,
  selectedSection,
  selectedTags,
  onSectionChange,
  onTagsChange,
}: BlogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSectionClick = (section: Section) => {
    if (selectedSection === section) {
      onSectionChange(null);
    } else {
      onSectionChange(section);
    }
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    onSectionChange(null);
    onTagsChange([]);
  };

  const hasActiveFilters = selectedSection !== null || selectedTags.length > 0;

  return (
    <div className="mb-8">
      {/* Filter Header */}
      <div className="flex items-center justify-end mb-4 gap-4">
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] text-white/80 hover:text-white hover:from-[#d9d9d92f] hover:to-[#7373732f] transition-all"
          data-blobity-radius="20"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span className="font-medium">Filter</span>
          <span className={`transition-transform text-xs ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4 justify-end">
          {selectedSection && (
            <button
              onClick={() => onSectionChange(null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#3c84c7]/30 text-[#3c84c7] rounded-full text-sm hover:bg-[#3c84c7]/50 transition-colors cursor-pointer"
              data-blobity-radius="20"
            >
              {selectedSection}
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#3c84c7]/30">
                ×
              </span>
            </button>
          )}
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white/80 rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
              data-blobity-radius="20"
            >
              {tag}
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/10">
                ×
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Expandable Filter Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-[20px] bg-gradient-to-r from-[#d9d9d91f] to-[#7373731f] std-backdrop-blur">
              {/* Section Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white/60 mb-2">Section</h4>
                <div className="flex flex-wrap gap-2">
                  {VALID_SECTIONS.map((section) => (
                    <button
                      key={section}
                      onClick={() => handleSectionClick(section)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedSection === section
                          ? "bg-[#3c84c7] text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                      }`}
                      data-blobity-radius="20"
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedTags.includes(tag)
                            ? "bg-[#3c84c7] text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                        }`}
                        data-blobity-radius="20"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
