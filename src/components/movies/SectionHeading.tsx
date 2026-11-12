// src/components/movies/SectionHeading.tsx
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionTo?: string;
  children?: React.ReactNode;
}

export default function SectionHeading({
  title,
  subtitle,
  actionText,
  actionTo,
  children,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3 border-b border-white/5 pb-4">
      <div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="mt-1.5 text-sm text-secondary-text max-w-xl pl-3.5">
            {subtitle}
          </p>
        )}
      </div>

      {actionText && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center space-x-1 text-sm font-medium text-primary hover:text-primary/80 transition group pl-3.5 sm:pl-0"
        >
          <span>{actionText}</span>
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}

      {children}
    </div>
  );
}
