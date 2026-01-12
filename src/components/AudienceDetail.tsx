import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Copy, Check, Facebook, Instagram, Linkedin, Twitter, Youtube, Search, Captions, MousePointerClick, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import AITargetingReport from './AITargetingReport';

type Audience = Database['public']['Tables']['audiences']['Row'];
type PainPoint = Database['public']['Tables']['audience_pain_points']['Row'];
type ContentPillar = Database['public']['Tables']['audience_content_pillars']['Row'];
type ContentBlock = Database['public']['Tables']['audience_content_blocks']['Row'];
type TargetingLayer = Database['public']['Tables']['audience_targeting_layers']['Row'];

interface AudienceDetailProps {
  audience: Audience;
  onBack: () => void;
}

interface PillarWithBlocks extends ContentPillar {
  blocks: ContentBlock[];
}

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  google: Search,
};

export default function AudienceDetail({ audience, onBack }: AudienceDetailProps) {
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [pillars, setPillars] = useState<PillarWithBlocks[]>([]);
  const [targetingLayers, setTargetingLayers] = useState<TargetingLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPillars, setExpandedPillars] = useState<Set<string>>(new Set());
  const [expandedTargeting, setExpandedTargeting] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAudienceDetails();
  }, [audience.id]);

  const fetchAudienceDetails = async () => {
    setLoading(true);
    try {
      const [painPointsRes, pillarsRes, blocksRes, targetingRes] = await Promise.all([
        supabase
          .from('audience_pain_points')
          .select('*')
          .eq('audience_id', audience.id)
          .order('sort_order', { ascending: true }),
        supabase
          .from('audience_content_pillars')
          .select('*')
          .eq('audience_id', audience.id)
          .order('sort_order', { ascending: true }),
        supabase
          .from('audience_content_blocks')
          .select('*')
          .eq('audience_id', audience.id)
          .order('position', { ascending: true }),
        supabase
          .from('audience_targeting_layers')
          .select('*')
          .eq('audience_id', audience.id)
          .order('sort_order', { ascending: true }),
      ]);

      if (painPointsRes.error) throw painPointsRes.error;
      if (pillarsRes.error) throw pillarsRes.error;
      if (blocksRes.error) throw blocksRes.error;
      if (targetingRes.error) throw targetingRes.error;

      setPainPoints(painPointsRes.data || []);
      setTargetingLayers(targetingRes.data || []);

      const pillarsWithBlocks = (pillarsRes.data || []).map((pillar) => ({
        ...pillar,
        blocks: (blocksRes.data || []).filter((block) => block.content_pillar_id === pillar.id),
      }));
      setPillars(pillarsWithBlocks);
    } catch (error) {
      console.error('Error fetching audience details:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePillar = (pillarId: string) => {
    setExpandedPillars((prev) => {
      const next = new Set(prev);
      if (next.has(pillarId)) {
        next.delete(pillarId);
      } else {
        next.add(pillarId);
      }
      return next;
    });
  };

  const toggleTargeting = (layerId: string) => {
    setExpandedTargeting((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const normalized = platform.toLowerCase();
    const Icon = platformIcons[normalized];
    return Icon || null;
  };

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
            <h1 className="text-lg font-bold text-gray-900">{audience.name}</h1>
            <p className="text-xs text-gray-500">
              Created {new Date(audience.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {audience.notes && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Description
            </h2>
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{audience.notes}</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Audience Details
          </h2>
          <div>
          <div className="grid grid-cols-2 gap-4">
            {audience.goal && (
              <div>
                <span className="text-xs font-medium text-gray-600">Goal:</span>
                <p className="text-sm font-bold text-gray-900 capitalize">{audience.goal}</p>
              </div>
            )}
            {audience.funnel_stage && (
              <div>
                <span className="text-xs font-medium text-gray-600">Funnel Stage:</span>
                <p className="text-sm font-bold text-gray-900 capitalize">{audience.funnel_stage}</p>
              </div>
            )}
            {audience.funnel_type && (
              <div>
                <span className="text-xs font-medium text-gray-600">Funnel Type:</span>
                <p className="text-sm font-bold text-gray-900 capitalize">{audience.funnel_type}</p>
              </div>
            )}
          </div>
             <div className="flex flex-wrap gap-2">
              {audience.platforms.map((platform, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-primary text-white rounded-full text-sm font-medium"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

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

        {painPoints.length > 0 && (
          <div>
            <div className="flex items-center gap-3">
            <MousePointerClick className="h-4 w-4 text-gray-700" />
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Pain Points
            </span>
          </div>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 px-5 scrollbar-hide">
              {painPoints.map((painPoint) => (
                <div
                  key={painPoint.id}
                  className="flex-shrink-0 w-72 bg-white rounded-lg p-4 border border-gray-200 snap-start"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{painPoint.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{painPoint.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {pillars.length > 0 && (
          <div>
            <div className="flex items-center gap-3">
            <Captions className="h-4 w-4 text-gray-700" />
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Content Pillars
            </span>
            </div>
            <div className="space-y-3">
              {pillars.map((pillar) => {
                const isExpanded = expandedPillars.has(pillar.id);
                return (
                  <div key={pillar.id} className="border border-gray-100 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => togglePillar(pillar.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{pillar.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{pillar.core_promise}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-3" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 ml-3" />
                      )}
                    </button>

                    {isExpanded && pillar.blocks.length > 0 && (
                      <div className="p-4 space-y-3">
                        {pillar.blocks.map((block) => (
                          <div
                            key={block.id}
                            className="pl-4 border-l-2 border-primary/30 space-y-2"
                          >
                            {block.block_type && (
                              <span className="inline-block text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                                {block.block_type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase())}
                              </span>
                            )}

                            {block.messaging && block.objection == null && (
                              <div className="relative group">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Messaging</p>
                                    <p className="text-sm text-gray-900">{block.messaging}</p>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(block.messaging!, block.id)}
                                    className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                    title="Copy to clipboard"
                                  >
                                    {copiedId === block.id ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}

                            {block.intent && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Intent</p>
                                <p className="text-sm text-gray-600">{block.intent}</p>
                              </div>
                            )}

                            {block.objection && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Objection</p>
                                <p className="text-sm text-gray-600">{block.objection}</p>
                              </div>
                            )}

                            {block.reframe && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Reframe</p>
                                <p className="text-sm text-gray-600">{block.reframe}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {isExpanded && pillar.blocks.length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500 bg-white">
                        No content blocks for this pillar
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {targetingLayers.length > 0 && (
          <div>
            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-gray-700" />
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Targeting Layers
            </h2>
            </div>
            <div className="space-y-3">
              {targetingLayers.map((layer) => {
                const isExpanded = expandedTargeting.has(layer.id);
                const PlatformIcon = getPlatformIcon(layer.platform);

                return (
                  <div key={layer.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleTargeting(layer.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {PlatformIcon && <PlatformIcon className="w-5 h-5 text-gray-600" />}
                        <div>
                          <h3 className="font-semibold text-gray-900">{layer.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">{layer.platform}</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>

                    {isExpanded && layer.ai_targeting_report && (
                      <div className="p-4 bg-white">
                        <h4 className="text-sm font-semibold text-gray-700 mb-4">AI Targeting Report</h4>
                        <AITargetingReport
                          data={typeof layer.ai_targeting_report === 'string'
                            ? JSON.parse(layer.ai_targeting_report)
                            : layer.ai_targeting_report
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
