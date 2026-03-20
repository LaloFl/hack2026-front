import React, { useState } from "react";

interface DropdownProps {
  title: string;
  body: string;
  minutes?: number;
}

export default function Dropdown({ title, body, minutes }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full bg-white p-0 divide-y divide-gray border border-[#a7dfd8] rounded-lg">
      <div
        className={`bg-[#f8fdfc] flex flex-row justify-between text-md p-4 ${isOpen ? "rounded-t-lg" : "rounded-lg"} cursor-pointer hover:bg-[#f0f9f8] transition-colors items-center`}
        onClick={toggleDropdown}
      >
        <p>{title}</p>
        <div className="flex flex-row gap-2 items-center">
          <p>{minutes} mins</p>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {isOpen && <p className="p-6 text-sm">{body}</p>}
    </div>
  );
}
