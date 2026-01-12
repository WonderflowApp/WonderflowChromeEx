import { ArrowLeft } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Audience = Database['public']['Tables']['audiences']['Row'];

interface AudienceDetailProps {
  audience: Audience;
  onBack: () => void;
}

export default function AudienceDetail({ audience, onBack }: AudienceDetailProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{audience.name}</h1>
            <p className="text-sm text-gray-500">
              Created {new Date(audience.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {audience.notes && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Description
            </h2>
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{audience.notes}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Audience Details
          </h2>
          <div className="space-y-3">
            {audience.goal && (
              <div>
                <span className="text-sm font-medium text-gray-600">Goal:</span>
                <p className="text-gray-900 mt-1">{audience.goal}</p>
              </div>
            )}
            {audience.funnel_stage && (
              <div>
                <span className="text-sm font-medium text-gray-600">Funnel Stage:</span>
                <p className="text-gray-900 mt-1">{audience.funnel_stage}</p>
              </div>
            )}
            {audience.funnel_type && (
              <div>
                <span className="text-sm font-medium text-gray-600">Funnel Type:</span>
                <p className="text-gray-900 mt-1">{audience.funnel_type}</p>
              </div>
            )}
            {audience.mode && (
              <div>
                <span className="text-sm font-medium text-gray-600">Mode:</span>
                <p className="text-gray-900 mt-1">{audience.mode}</p>
              </div>
            )}
          </div>
        </div>

        {audience.platforms && audience.platforms.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Targeting Platforms
            </h2>
            <div className="flex flex-wrap gap-2">
              {audience.platforms.map((platform, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}

        {audience.estimated_reach_min !== null && audience.estimated_reach_max !== null && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Estimated Reach
            </h2>
            <p className="text-gray-900">
              {audience.estimated_reach_min.toLocaleString()} - {audience.estimated_reach_max.toLocaleString()}
            </p>
          </div>
        )}

        {audience.tags && audience.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {audience.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
