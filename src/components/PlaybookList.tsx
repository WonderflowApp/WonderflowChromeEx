import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Playbook = Database['public']['Tables']['playbooks']['Row'];

interface PlaybookListProps {
  playbooks: Playbook[];
  onSelectPlaybook: (playbook: Playbook) => void;
  onBack: () => void;
}

export default function PlaybookList({ playbooks, onSelectPlaybook, onBack }: PlaybookListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaybooks = playbooks.filter((playbook) => {
    const query = searchQuery.toLowerCase();
    return (
      playbook.name.toLowerCase().includes(query) ||
      playbook.description?.toLowerCase().includes(query)
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
          <h1 className="text-xl font-bold text-gray-900">All Playbooks</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search playbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredPlaybooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'No playbooks found matching your search' : 'No playbooks available'}
              </p>
            </div>
          ) : (
            filteredPlaybooks.map((playbook) => (
              <button
                key={playbook.id}
                onClick={() => onSelectPlaybook(playbook)}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-primary transition-all text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{playbook.name}</h3>
                </div>
                {playbook.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{playbook.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Updated {new Date(playbook.updated_at).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
