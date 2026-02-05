import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { ArrowLeft, Search, Copy, Check, Link2, ExternalLink, Zap, Folder } from 'lucide-react';

type UtmLink = Database['public']['Tables']['utm_links']['Row'];
type UtmFolder = Database['public']['Tables']['utm_folders']['Row'];

interface TrackingLinksListProps {
  workspaceId: string;
  onBack: () => void;
}

export default function TrackingLinksList({ workspaceId, onBack }: TrackingLinksListProps) {
  const [links, setLinks] = useState<UtmLink[]>([]);
  const [folders, setFolders] = useState<UtmFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterFolder, setFilterFolder] = useState<string>('');

  useEffect(() => {
    fetchLinks();
    fetchFolders();
  }, [workspaceId]);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('utm_links')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching tracking links:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('utm_folders')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('name', { ascending: true });

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const getLinkToCopy = (link: UtmLink): string => {
    return link.shortened_url || link.utm_url;
  };

  const copyToClipboard = async (link: UtmLink) => {
    try {
      const urlToCopy = getLinkToCopy(link);
      await navigator.clipboard.writeText(urlToCopy);
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const filteredLinks = links.filter(link => {
    const matchesSearch = searchQuery === '' ||
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.original_url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder = filterFolder === '' || link.folder_id === filterFolder;

    return matchesSearch && matchesFolder;
  });

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
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-gray-900">Tracking Links</h1>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {folders.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-3">
              <button
                onClick={() => setFilterFolder('')}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                  filterFolder === ''
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setFilterFolder(folder.id)}
                  className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                    filterFolder === folder.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Folder className="w-3 h-3" />
                  {folder.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {searchQuery || filterFolder ? 'No links match your filters' : 'No tracking links found'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLinks.map(link => {
              const hasShortLink = !!link.shortened_url;
              const displayUrl = link.shortened_url || link.utm_url;

              return (
                <div
                  key={link.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{link.name}</h3>
                        {hasShortLink && (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-primary text-white rounded-full">
                            <Zap className="w-3 h-3" />
                            Track
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{link.original_url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={link.utm_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </a>
                      <button
                        onClick={() => copyToClipboard(link)}
                        className={`p-2 rounded-lg transition-colors ${
                          copiedId === link.id
                            ? 'bg-green-100 text-green-600'
                            : 'hover:bg-gray-100 text-gray-500'
                        }`}
                        title={`Copy ${hasShortLink ? 'short' : 'full'} link`}
                      >
                        {copiedId === link.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {link.campaign_name}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                      {link.source}
                    </span>
                    <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                      {link.medium}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-mono truncate flex-1">
                        {displayUrl}
                      </p>
                    </div>
                    {hasShortLink && (
                      <p className="text-xs text-gray-300 font-mono truncate mt-1">
                        Full: {link.utm_url}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
