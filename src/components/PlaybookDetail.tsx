import { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, ChevronDown, Loader2 } from 'lucide-react';
import type { Database } from '../lib/database.types';
import { supabase } from '../lib/supabase';

type Playbook = Database['public']['Tables']['playbooks']['Row'];
type PlaybookPage = Database['public']['Tables']['playbook_pages']['Row'];
type PlaybookSection = Database['public']['Tables']['playbook_sections']['Row'];
type SectionVariant = Database['public']['Tables']['section_variants']['Row'];

interface PlaybookDetailProps {
  playbook: Playbook;
  onBack: () => void;
}

interface SectionWithVariants extends PlaybookSection {
  variants: SectionVariant[];
}

export default function PlaybookDetail({ playbook, onBack }: PlaybookDetailProps) {
  const [pages, setPages] = useState<PlaybookPage[]>([]);
  const [currentPage, setCurrentPage] = useState<PlaybookPage | null>(null);
  const [sections, setSections] = useState<SectionWithVariants[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [copiedSections, setCopiedSections] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, [playbook.id]);

  useEffect(() => {
    if (currentPage) {
      fetchSections(currentPage.id);
    }
  }, [currentPage]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('playbook_pages')
        .select('*')
        .eq('playbook_id', playbook.id)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setPages(data || []);
      if (data && data.length > 0) {
        setCurrentPage(data[0]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (pageId: string) => {
    try {
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('playbook_sections')
        .select('*')
        .eq('page_id', pageId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (sectionsError) throw sectionsError;

      if (!sectionsData || sectionsData.length === 0) {
        setSections([]);
        return;
      }

      const typedSectionsData: PlaybookSection[] = sectionsData as PlaybookSection[];
      const sectionIds = typedSectionsData.map(s => s.id);
      const { data: variantsData, error: variantsError } = await supabase
        .from('section_variants')
        .select('*')
        .in('section_id', sectionIds)
        .order('is_primary', { ascending: false });

      if (variantsError) throw variantsError;

      const typedVariantsData: SectionVariant[] = (variantsData || []) as SectionVariant[];
      const sectionsWithVariants: SectionWithVariants[] = typedSectionsData.map(section => ({
        ...section,
        variants: typedVariantsData.filter(v => v.section_id === section.id)
      }));

      setSections(sectionsWithVariants);

      const defaultVariants: Record<string, string> = {};
      sectionsWithVariants.forEach(section => {
        if (section.variants.length > 0) {
          const primaryVariant = section.variants.find(v => v.is_primary);
          defaultVariants[section.id] = primaryVariant?.id || section.variants[0].id;
        }
      });
      setSelectedVariants(defaultVariants);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleCopySection = async (sectionId: string) => {
    const variantId = selectedVariants[sectionId];
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const variant = section.variants.find(v => v.id === variantId);
    if (!variant || !variant.content) return;

    try {
      await navigator.clipboard.writeText(variant.content);
      setCopiedSections(prev => ({ ...prev, [sectionId]: true }));
      setTimeout(() => {
        setCopiedSections(prev => ({ ...prev, [sectionId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (loading) {
    return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{playbook.name}</h1>
            {playbook.description && (
              <p className="text-sm text-gray-500">{playbook.description}</p>
            )}
          </div>
        </div>

        {pages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page)}
                className={`px-2 py-1 rounded-full font-medium text-xs whitespace-nowrap transition-all ${
                  currentPage?.id === page.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No pages found in this playbook</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No active sections found on this page</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {section.name}
                  </h3>
                </div>

                {section.variants.length > 0 && (
                  <>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Select variant
                      </label>
                      <div className="relative">
                        <select
                          value={selectedVariants[section.id] || ''}
                          onChange={(e) =>
                            setSelectedVariants(prev => ({
                              ...prev,
                              [section.id]: e.target.value
                            }))
                          }
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
                        >
                          {section.variants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.variant_label}
                              {variant.is_primary ? ' (Primary)' : ''}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {selectedVariants[section.id] && (
                      <>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                            {section.variants.find(v => v.id === selectedVariants[section.id])?.content}
                          </p>
                        </div>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleCopySection(section.id)}
                            className={`flex items-center gap-2 font-medium text-sm transition-all ${
                              copiedSections[section.id]
                                ? 'text-green-700'
                                : 'text-primary hover:text-primary-dark'
                            }`}
                          >
                            {copiedSections[section.id] ? (
                              <>
                                <Check className="w-4 h-4" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}

                {section.variants.length === 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500 text-sm">No variants available for this section</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
