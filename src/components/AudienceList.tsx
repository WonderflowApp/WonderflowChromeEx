import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Audience = Database['public']['Tables']['audiences']['Row'];

interface AudienceListProps {
  audiences: Audience[];
  onSelectAudience: (audience: Audience) => void;
  onBack: () => void;
}

export default function AudienceList({ audiences, onSelectAudience, onBack }: AudienceListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAudiences = audiences.filter((audience) => {
    const query = searchQuery.toLowerCase();
    return (
      audience.name.toLowerCase().includes(query) ||
      audience.notes?.toLowerCase().includes(query) ||
      audience.goal?.toLowerCase().includes(query) ||
      audience.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">All Audiences</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
          <input
            type="text"
            placeholder="Search audiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredAudiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'No audiences found matching your search' : 'No audiences available'}
              </p>
            </div>
          ) : (
            filteredAudiences.map((audience) => (
              <button
                key={audience.id}
                onClick={() => onSelectAudience(audience)}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-primary transition-all text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{audience.name}</h3>
                {audience.notes && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{audience.notes}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  {audience.goal && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {audience.goal}
                    </span>
                  )}
                  {audience.funnel_stage && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      {audience.funnel_stage}
                    </span>
                  )}
                </div>
                {audience.tags && audience.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {audience.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                    {audience.tags.length > 3 && (
                      <span className="text-xs px-2 py-0.5 text-gray-500">
                        +{audience.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                  <p className="text-xs text-gray-500 mt-2">
                 Created {new Date(audience.created_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
