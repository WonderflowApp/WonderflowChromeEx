import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { ArrowLeft, Folder, Grid, Star } from 'lucide-react';

type Board = Database['public']['Tables']['boards']['Row'];
type SubBoard = Database['public']['Tables']['sub_boards']['Row'];

interface SubBoardWithCount extends SubBoard {
  asset_count: number;
}

interface BoardDetailProps {
  board: Board;
  onBack: () => void;
  onViewBoardAssets: (boardId: string) => void;
  onViewSubBoardAssets: (boardId: string, subBoardId: string) => void;
}

export default function BoardDetail({ board, onBack, onViewBoardAssets, onViewSubBoardAssets }: BoardDetailProps) {
  const [subBoards, setSubBoards] = useState<SubBoardWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAssetCount, setTotalAssetCount] = useState(0);

  useEffect(() => {
    fetchSubBoards();
    fetchTotalAssetCount();
  }, [board.id]);

  const fetchTotalAssetCount = async () => {
    try {
      const { count } = await supabase
        .from('storage_assets')
        .select('*', { count: 'exact', head: true })
        .eq('board_id', board.id)
        .is('archived_at', null);

      setTotalAssetCount(count || 0);
    } catch (error) {
      console.error('Error fetching total asset count:', error);
    }
  };

  const fetchSubBoards = async () => {
    try {
      const { data: subBoardsData, error } = await supabase
        .from('sub_boards')
        .select('*')
        .eq('board_id', board.id)
        .eq('is_deleted', false)
        .order('position', { ascending: true });

      if (error) throw error;

      const subBoardsWithCounts = await Promise.all(
        (subBoardsData || []).map(async (subBoard) => {
          const { count } = await supabase
            .from('storage_assets')
            .select('*', { count: 'exact', head: true })
            .eq('sub_board_id', subBoard.id)
            .is('archived_at', null);

          return {
            ...subBoard,
            asset_count: count || 0,
          };
        })
      );

      setSubBoards(subBoardsWithCounts);
    } catch (error) {
      console.error('Error fetching sub-boards:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <Folder className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-gray-900 truncate">{board.name}</h1>
                  {board.is_favorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                  )}
                </div>
                {board.description && (
                  <p className="text-xs text-gray-500 truncate">{board.description}</p>
                )}
              </div>
            </div>
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
              onClick={() => onViewBoardAssets(board.id)}
              className="w-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-primary hover:bg-primary/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Grid className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900">View All Board Assets</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {totalAssetCount} {totalAssetCount === 1 ? 'asset' : 'assets'} in this board
                  </p>
                </div>
              </div>
            </button>

            {subBoards.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No sub-boards found</p>
                <p className="text-sm text-gray-400 mt-1">This board has no sub-boards yet</p>
              </div>
            ) : (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3 px-1">Sub-boards</h2>
                <div className="space-y-3">
                  {subBoards.map(subBoard => (
                    <button
                      key={subBoard.id}
                      onClick={() => onViewSubBoardAssets(board.id, subBoard.id)}
                      className="w-full bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Folder className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 truncate mb-1">{subBoard.name}</h3>
                          {subBoard.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{subBoard.description}</p>
                          )}
                          <div className="text-xs text-gray-500">
                            {subBoard.asset_count} {subBoard.asset_count === 1 ? 'asset' : 'assets'}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
