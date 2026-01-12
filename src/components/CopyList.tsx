import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import type { Database } from '../lib/database.types';

type CopyBlock = Database['public']['Tables']['copy_blocks']['Row'];

interface CopyListProps {
  copyBlocks: CopyBlock[];
  onSelectCopyBlock: (copyBlock: CopyBlock) => void;
  onBack: () => void;
}

export default function CopyList({ copyBlocks, onSelectCopyBlock, onBack }: CopyListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCopyBlocks = copyBlocks.filter((block) => {
    const query = searchQuery.toLowerCase();
    return (
      block.name.toLowerCase().includes(query) ||
      block.notes?.toLowerCase().includes(query) ||
      block.category?.toLowerCase().includes(query) ||
      block.type?.toLowerCase().includes(query) ||
      block.intent?.toLowerCase().includes(query)
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
          <h1 className="text-xl font-bold text-gray-900">All Copy</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search copy blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredCopyBlocks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {searchQuery ? 'No copy blocks found matching your search' : 'No copy blocks available'}
              </p>
            </div>
          ) : (
            filteredCopyBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => onSelectCopyBlock(block)}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-primary transition-all text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{block.name}</h3>
                  <div className="flex gap-2">
                    {block.type && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {block.type}
                      </span>
                    )}
                    {block.status && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {block.status}
                      </span>
                    )}
                  </div>
                </div>
                {block.notes && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{block.notes}</p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  {block.category && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {block.category}
                    </span>
                  )}
                  {block.intent && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {block.intent}
                    </span>
                  )}
                  {block.tone && (
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {block.tone}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
