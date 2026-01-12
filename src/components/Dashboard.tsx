import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, ChevronDown } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Audience = Database['public']['Tables']['audiences']['Row'];
type CopyBlock = Database['public']['Tables']['copy_blocks']['Row'];
type Workspace = Database['public']['Tables']['workspaces']['Row'];
type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'audiences' | 'messaging'>('audiences');
  const [workspaces, setWorkspaces] = useState<(Workspace & { role: string })[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<(Workspace & { role: string }) | null>(null);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [copyBlocks, setCopyBlocks] = useState<CopyBlock[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<Audience | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchAudiences();
      fetchCopyBlocks();
      localStorage.setItem('selectedWorkspaceId', selectedWorkspace.id);
    }
  }, [selectedWorkspace]);

  const fetchWorkspaces = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('workspace_members')
        .select('workspace_id, role, workspaces(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      const workspacesWithRoles = (data || []).map((item: any) => ({
        ...item.workspaces,
        role: item.role,
      }));

      setWorkspaces(workspacesWithRoles);

      if (workspacesWithRoles.length > 0) {
        const savedWorkspaceId = localStorage.getItem('selectedWorkspaceId');
        const savedWorkspace = workspacesWithRoles.find((w: any) => w.id === savedWorkspaceId);
        setSelectedWorkspace(savedWorkspace || workspacesWithRoles[0]);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAudiences = async () => {
    if (!selectedWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('audiences')
        .select('*')
        .eq('workspace_id', selectedWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAudiences(data || []);
      if (data && data.length > 0) {
        setSelectedAudience(data[0]);
      } else {
        setSelectedAudience(null);
      }
    } catch (error) {
      console.error('Error fetching audiences:', error);
    }
  };

  const fetchCopyBlocks = async () => {
    if (!selectedWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('copy_blocks')
        .select('*')
        .eq('workspace_id', selectedWorkspace.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCopyBlocks(data || []);
    } catch (error) {
      console.error('Error fetching copy blocks:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAudienceSelect = (audience: Audience) => {
    setSelectedAudience(audience);
    setDropdownOpen(false);
  };

  const handleWorkspaceSelect = (workspace: Workspace & { role: string }) => {
    setSelectedWorkspace(workspace);
    setWorkspaceDropdownOpen(false);
    setSelectedAudience(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src="/wonderflow-coloricon.png" alt="Wonderflow" className="w-9 h-9" />
            </div>
            <div className="flex items-center gap-2">
              {/* Workspace Selector */}
              {workspaces.length > 0 && selectedWorkspace && (
                <div className="relative">
                  <button
                    onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm"
                  >
                    <span className="font-medium text-gray-900 max-w-[150px] truncate">
                      {selectedWorkspace.name}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 bg-primary text-blue-700 rounded-full uppercase font-semibold">
                      {selectedWorkspace.role}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${workspaceDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {workspaceDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                      {workspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          onClick={() => handleWorkspaceSelect(workspace)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                            selectedWorkspace?.id === workspace.id ? 'bg-primary/10' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-medium truncate ${
                              selectedWorkspace?.id === workspace.id ? 'text-primary' : 'text-gray-900'
                            }`}>
                              {workspace.name}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase font-semibold ml-2">
                              {workspace.role}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Audience Dropdown */}
          {audiences.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900 truncate">
                  {selectedAudience?.name || 'Select an audience'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                  {audiences.map((audience) => (
                    <button
                      key={audience.id}
                      onClick={() => handleAudienceSelect(audience)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                        selectedAudience?.id === audience.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                      }`}
                    >
                      <div className="font-medium truncate">{audience.name}</div>
                      {audience.description && (
                        <div className="text-xs text-gray-500 truncate mt-0.5">{audience.description}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setActiveTab('audiences')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'audiences'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Audiences
            {activeTab === 'audiences' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === 'messaging'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Copy
            {activeTab === 'messaging' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'audiences' && (
          <div className="p-4">
            {!selectedWorkspace ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Select a workspace to view audiences</p>
              </div>
            ) : audiences.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No audiences found in this workspace</p>
              </div>
            ) : selectedAudience ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedAudience.name}</h2>
                {selectedAudience.notes && (
                  <p className="text-gray-600 mb-4">{selectedAudience.notes}</p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {selectedAudience.goal && (
                    <div>
                      <span className="text-gray-500">Goal:</span>
                      <span className="ml-2 text-gray-900">{selectedAudience.goal}</span>
                    </div>
                  )}
                  {selectedAudience.funnel_stage && (
                    <div>
                      <span className="text-gray-500">Stage:</span>
                      <span className="ml-2 text-gray-900">{selectedAudience.funnel_stage}</span>
                    </div>
                  )}
                  {selectedAudience.platforms && selectedAudience.platforms.length > 0 && (
                    <div>
                      <span className="text-gray-500">Platforms:</span>
                      <span className="ml-2 text-gray-900">{selectedAudience.platforms.join(', ')}</span>
                    </div>
                  )}
                </div>
                {selectedAudience.tags && selectedAudience.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedAudience.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-xs text-gray-500">
                  Created: {new Date(selectedAudience.created_at).toLocaleDateString()}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'messaging' && (
          <div className="p-4 space-y-3">
            {!selectedWorkspace ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Select a workspace to view copy</p>
              </div>
            ) : copyBlocks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No copy blocks found in this workspace</p>
              </div>
            ) : (
              copyBlocks.map((block) => (
                <div key={block.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{block.notes}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {block.category && <span>Category: {block.category}</span>}
                    {block.intent && <span>Intent: {block.intent}</span>}
                    {block.tone && <span>Tone: {block.tone}</span>}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    {new Date(block.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
