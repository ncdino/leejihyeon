"use client";

import { useState, useEffect } from "react";

interface PostActionsProps {
  handleEdit: () => void;
  handleDelete: () => void;
  isDeleting: boolean;
  className?: string;
  iconClassName?: string;
}

export default function PostActions({
  handleEdit,
  handleDelete,
  isDeleting,
  className,
  iconClassName,
}: PostActionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) setShowDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
        className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 border border-white/30"
      >
        <i className={`bx bx-dots-vertical-rounded text-xl ${iconClassName}`} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          <button
            onClick={handleEdit}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
          >
            <i className="bx bx-edit-alt text-lg"></i>
            수정하기
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 disabled:opacity-50"
          >
            <i className="bx bx-trash text-lg"></i>
            {isDeleting ? "삭제 중..." : "삭제하기"}
          </button>
        </div>
      )}
    </div>
  );
}
