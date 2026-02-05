import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { ArrowLeft, Search, Copy, Check, Link2, ExternalLink, Tag } from 'lucide-react';

type TrackingLink = Database['public']['Tables']['tracking_links']['Row'];

interface TrackingLinksListProps {
  workspaceId: string;
  onBack: () => void;
}

export default function TrackingLinksList({ workspaceId, onBack }: TrackingLinksListProps) {
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCampaign, setFilterCampaign] = useState<string>('');

  useEffect(() => {
    fetchLinks();
  }, [workspaceId]);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('tracking_links')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching tracking links:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (link: TrackingLink) => {
    try {
      await navigator.clipboard.writeText(link.full_url);
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const campaigns = [...new Set(links.map(l => l.utm_campaign).filter(Boolean))];

  const filteredLinks = links.filter(link => {
    const matchesSearch = searchQuery === '' ||
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.utm_campaign?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.utm_source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.base_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCampaign = filterCampaign === '' || link.utm_campaign === filterCampaign;

    return matchesSearch && matchesCampaign;
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {campaigns.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterCampaign('')}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                  filterCampaign === ''
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {campaigns.map(campaign => (
                <button
                  key={campaign}
                  onClick={() => setFilterCampaign(campaign || '')}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                    filterCampaign === campaign
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {campaign}
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
              {searchQuery || filterCampaign ? 'No links match your search' : 'No tracking links found'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLinks.map(link => (
              <div
                key={link.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{link.name}</h3>
                    <p className="text-xs text-gray-500 truncate mt-1">{link.base_url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={link.full_url}
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
                      title="Copy link"
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
                  {link.utm_campaign && (
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                      {link.utm_campaign}
                    </span>
                  )}
                  {link.utm_source && (
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                      {link.utm_source}
                    </span>
                  )}
                  {link.utm_medium && (
                    <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                      {link.utm_medium}
                    </span>
                  )}
                </div>

                {link.tags && link.tags.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 flex-wrap">
                    <Tag className="w-3 h-3 text-gray-400" />
                    {link.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-gray-500">
                        {tag}{idx < link.tags!.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-mono truncate">{link.full_url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
