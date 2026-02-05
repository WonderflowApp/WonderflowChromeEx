import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import {
  ArrowLeft,
  Search,
  Download,
  Image,
  FileVideo,
  File,
  Grid,
  List,
  X,
  Check,
  ChevronRight
} from 'lucide-react';

type StorageAsset = Database['public']['Tables']['storage_assets']['Row'];
type Board = Database['public']['Tables']['boards']['Row'];
type SubBoard = Database['public']['Tables']['sub_boards']['Row'];

interface CreativeGalleryProps {
  workspaceId: string;
  boardId?: string;
  subBoardId?: string;
  onBack: () => void;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return FileVideo;
  return File;
}

export default function CreativeGallery({ workspaceId, boardId, subBoardId, onBack }: CreativeGalleryProps) {
  const [assets, setAssets] = useState<StorageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<StorageAsset | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [boardName, setBoardName] = useState<string | null>(null);
  const [subBoardName, setSubBoardName] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
    if (boardId) {
      fetchBoardName();
    }
    if (subBoardId) {
      fetchSubBoardName();
    }
  }, [workspaceId, boardId, subBoardId]);

  const fetchBoardName = async () => {
    if (!boardId) return;
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('name')
        .eq('id', boardId)
        .maybeSingle();

      if (error) throw error;
      setBoardName(data?.name || null);
    } catch (error) {
      console.error('Error fetching board name:', error);
    }
  };

  const fetchSubBoardName = async () => {
    if (!subBoardId) return;
    try {
      const { data, error } = await supabase
        .from('sub_boards')
        .select('name')
        .eq('id', subBoardId)
        .maybeSingle();

      if (error) throw error;
      setSubBoardName(data?.name || null);
    } catch (error) {
      console.error('Error fetching sub-board name:', error);
    }
  };

  const fetchAssets = async () => {
    try {
      let query = supabase
        .from('storage_assets')
        .select('*')
        .eq('workspace_id', workspaceId)
        .is('archived_at', null);

      if (subBoardId) {
        query = query.eq('sub_board_id', subBoardId);
      } else if (boardId) {
        query = query.eq('board_id', boardId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsset = async (asset: StorageAsset) => {
    setDownloading(asset.id);
    try {
      const { data, error } = await supabase.storage
        .from('creative-storage')
        .download(asset.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = asset.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadedId(asset.id);
      setTimeout(() => setDownloadedId(null), 2000);
    } catch (error) {
      console.error('Error downloading asset:', error);
    } finally {
      setDownloading(null);
    }
  };

  const getAssetUrl = (asset: StorageAsset) => {
    return asset.file_url;
  };

  const getThumbnailUrl = (asset: StorageAsset) => {
    if (asset.thumbnail_url) {
      return asset.thumbnail_url;
    }
    if (asset.mime_type.startsWith('image/')) {
      return asset.file_url;
    }
    return null;
  };

  const filteredAssets = assets.filter(asset =>
    searchQuery === '' ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Image className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <h1 className="text-lg font-bold text-gray-900 truncate">Creative</h1>
                {boardName && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{boardName}</span>
                  </>
                )}
                {subBoardName && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{subBoardName}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search creative..."
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
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery ? 'No creative assets match your search' : 'No creative assets found'}
            </p>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredAssets.map(asset => {
                  const thumbnailUrl = getThumbnailUrl(asset);
                  const FileIcon = getFileIcon(asset.mime_type);

                  return (
                    <div
                      key={asset.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden"
                      >
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileIcon className="w-12 h-12 text-gray-400" />
                        )}
                      </button>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 truncate">{asset.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatFileSize(asset.size)}</p>
                        <button
                          onClick={() => downloadAsset(asset)}
                          disabled={downloading === asset.id}
                          className={`mt-2 w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            downloadedId === asset.id
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {downloading === asset.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700"></div>
                          ) : downloadedId === asset.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              Downloaded
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3" />
                              Download
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAssets.map(asset => {
                  const thumbnailUrl = getThumbnailUrl(asset);
                  const FileIcon = getFileIcon(asset.mime_type);

                  return (
                    <div
                      key={asset.id}
                      className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                      >
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{asset.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
                      </div>
                      <button
                        onClick={() => downloadAsset(asset)}
                        disabled={downloading === asset.id}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                          downloadedId === asset.id
                            ? 'bg-green-100 text-green-600'
                            : 'hover:bg-gray-100 text-gray-500'
                        }`}
                      >
                        {downloading === asset.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                        ) : downloadedId === asset.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {selectedAsset && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-full max-h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 truncate pr-4">{selectedAsset.name}</h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {selectedAsset.mime_type.startsWith('image/') ? (
                <img
                  src={getAssetUrl(selectedAsset)}
                  alt={selectedAsset.name}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              ) : selectedAsset.mime_type.startsWith('video/') ? (
                <video
                  src={getAssetUrl(selectedAsset)}
                  controls
                  className="max-w-full max-h-[60vh]"
                />
              ) : (
                <div className="text-center py-12">
                  <File className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">{selectedAsset.name}</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">{selectedAsset.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedAsset.size)}</p>
                </div>
              </div>
              {selectedAsset.description && (
                <p className="text-sm text-gray-600 mb-3">{selectedAsset.description}</p>
              )}
              <button
                onClick={() => downloadAsset(selectedAsset)}
                disabled={downloading === selectedAsset.id}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                {downloading === selectedAsset.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
