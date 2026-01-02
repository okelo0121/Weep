"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      className={`transition-all duration-300 ease-out overflow-hidden ${
        isVisible ? "max-h-40" : "max-h-0 opacity-0"
      }`}
    >
      <div className="bg-[#FFF9F5]">
        <div className="container">
          <div className="flex border-l border-r border-border">
            <a
              href="https://www.pinecone.io/blog/growing-ai-ambitions/"
              target="_blank"
              rel="noopener noreferrer"
              className="block grow py-2 pl-4 pr-4 text-sm/[1.2] text-foreground sm:pl-8"
            >
              New announcement:{'  '}
              Ash Ashutosh, accomplished entrepreneur and tech veteran, joins Pinecone
              as new CEO - <span className="underline">Learn more</span>
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="group flex flex-shrink-0 cursor-pointer items-center gap-1 pr-4 text-xs/[1.2] text-muted-foreground transition-colors hover:text-foreground sm:pr-8"
              aria-label="Dismiss announcement"
            >
              Dismiss
              <X className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
