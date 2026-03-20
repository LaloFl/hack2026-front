"use client";

import { MOCK_TRAININGS } from "@/app/models/mocks";
import { Training } from "@/app/models/models";
import { useRouter } from "next/navigation";

// Replace with your real API call

function TrainingCard({ training }: { training: Training }) {
  const router = useRouter();

  return (
    <div className="w-[300px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {/* Header image */}
      <div className="h-[160px] bg-gray-100 overflow-hidden relative">
        <img
          src={training.primary_image_url}
          alt={training.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback gradient when no image */}
        <div className="absolute inset-0 bg-brand-gradient opacity-20 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <h2 className="text-sm font-semibold text-gray-900 leading-snug">
            {training.name}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
            {training.subtitle}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() =>
              router.push(`/admin/create/${training.lectures[0].lecture_id}`)
            }
            className="w-full py-2 rounded-xl bg-brand-gradient text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            ✦ Create lecture
          </button>
          <a
            href={training.training_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium hover:border-gray-300 hover:text-gray-700 transition-all text-center"
          >
            Go to training ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex justify-center items-start p-6 w-full min-h-screen bg-gray-50">
      <div className="max-w-[960px] min-w-[350px] w-full flex flex-col gap-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              Admin
            </p>
            <h1 className="text-base font-semibold text-gray-800">
              Available trainings
            </h1>
          </div>
          <span className="text-xs bg-light-teal/10 text-light-teal border border-light-teal/20 rounded-full px-3 py-1">
            {MOCK_TRAININGS.length} trainings
          </span>
        </div>

        {/* Cards grid */}
        <div className="flex flex-wrap gap-4">
          {MOCK_TRAININGS.map((training) => (
            <TrainingCard key={training.id} training={training} />
          ))}
        </div>
      </div>
    </div>
  );
}
