import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { ArrowLeft, Search, Folder, Star, Grid } from 'lucide-react';

type Board = Database['public']['Tables']['boards']['Row'];

interface BoardWithCount extends Board {
  asset_count: number;
}

interface BoardsListProps {
  workspaceId: string;
  onBack: () => void;
  onSelectBoard: (board: Board) => void;
  onViewAllAssets: () => void;
}

export default function BoardsList({ workspaceId, onBack, onSelectBoard, onViewAllAssets }: BoardsListProps) {
  const [boards, setBoards] = useState<BoardWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBoards();
  }, [workspaceId]);

  const fetchBoards = async () => {
    try {
      const { data: boardsData, error } = await supabase
        .from('boards')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_deleted', false)
        .order('is_favorite', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const boardsWithCounts = await Promise.all(
        (boardsData || []).map(async (board) => {
          const { count } = await supabase
            .from('storage_assets')
            .select('*', { count: 'exact', head: true })
            .eq('board_id', board.id)
            .is('archived_at', null);

          return {
            ...board,
            asset_count: count || 0,
          };
        })
      );

      setBoards(boardsWithCounts);
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBoards = boards.filter(board =>
    searchQuery === '' ||
    board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Folder className="w-5 h-5 text-primary flex-shrink-0" />
              <h1 className="text-lg font-bold text-gray-900 truncate">Creative Boards</h1>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={onViewAllAssets}
              className="w-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-primary hover:bg-primary/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Grid className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">View All Assets</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Browse all creative assets without board filters</p>
                </div>
              </div>
            </button>

            {filteredBoards.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchQuery ? 'No boards match your search' : 'No boards found'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBoards.map(board => (
                  <button
                    key={board.id}
                    onClick={() => onSelectBoard(board)}
                    className="w-full bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Folder className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900 truncate">{board.name}</h3>
                          {board.is_favorite && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          )}
                        </div>
                        {board.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{board.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{board.asset_count} {board.asset_count === 1 ? 'asset' : 'assets'}</span>
                          <span>•</span>
                          <span>{new Date(board.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
