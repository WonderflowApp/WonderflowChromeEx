import { Users, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface EstimatedReach {
  max: number;
  min: number;
  confidence: string;
}

interface AudienceSuggestions {
  exclusions?: string[];
  lookalike_seeds?: string[];
  custom_audiences?: string[];
}

interface TargetingCategory {
  category: string;
  priority: string;
  recommendations: string[];
}

interface AITargetingReportData {
  platform?: string;
  estimated_reach?: EstimatedReach;
  audience_suggestions?: AudienceSuggestions;
  targeting_categories?: TargetingCategory[];
}

interface AITargetingReportProps {
  data: AITargetingReportData;
}

export default function AITargetingReport({ data }: AITargetingReportProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (index: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const getPriorityColor = (priority: string): string => {
    const normalized = priority.toLowerCase();
    if (normalized === 'high') return 'bg-red-100 text-red-700 border-red-200';
    if (normalized === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getConfidenceColor = (confidence: string): string => {
    const normalized = confidence.toLowerCase();
    if (normalized === 'high') return 'bg-green-100 text-green-700 border-green-200';
    if (normalized === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-orange-100 text-orange-700 border-orange-200';
  };

  return (
    <div className="space-y-6">
      {data.estimated_reach && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold text-gray-900">Estimated Reach</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Minimum</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.estimated_reach.min)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Maximum</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(data.estimated_reach.max)}</p>
            </div>
          </div>
          {data.estimated_reach.confidence && (
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(data.estimated_reach.confidence)}`}>
                {data.estimated_reach.confidence.charAt(0).toUpperCase() + data.estimated_reach.confidence.slice(1)} Confidence
              </span>
            </div>
          )}
        </div>
      )}

      {data.audience_suggestions && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-semibold text-gray-900">Audience Suggestions</h3>
          </div>

          <div className="space-y-5">
            {data.audience_suggestions.exclusions && data.audience_suggestions.exclusions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h4 className="text-sm font-semibold text-gray-700">Exclusions</h4>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <ul className="space-y-2">
                    {data.audience_suggestions.exclusions.map((exclusion, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="flex-1">{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {data.audience_suggestions.lookalike_seeds && data.audience_suggestions.lookalike_seeds.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Lookalike Seeds</h4>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <ul className="space-y-2">
                    {data.audience_suggestions.lookalike_seeds.map((seed, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="flex-1">{seed}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {data.audience_suggestions.custom_audiences && data.audience_suggestions.custom_audiences.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Custom Audiences</h4>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <ul className="space-y-2">
                    {data.audience_suggestions.custom_audiences.map((audience, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="flex-1">{audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {data.targeting_categories && data.targeting_categories.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-semibold text-gray-900">Targeting Categories</h3>
          </div>

          <div className="space-y-3">
            {data.targeting_categories.map((category, index) => {
              const isExpanded = expandedCategories.has(index);
              return (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(index)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-semibold text-gray-900">{category.category}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(category.priority)}`}>
                        {category.priority.charAt(0).toUpperCase() + category.priority.slice(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {category.recommendations.map((rec, recIndex) => (
                          <span
                            key={recIndex}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200 hover:bg-gray-200 transition-colors"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
