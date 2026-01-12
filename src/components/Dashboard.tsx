import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, ChevronDown, Home, ChevronRight, Building2 } from 'lucide-react';
import type { Database } from '../lib/database.types';
import AudienceList from './AudienceList';
import AudienceDetail from './AudienceDetail';
import CopyList from './CopyList';
import CopyDetail from './CopyDetail';

type Audience = Database['public']['Tables']['audiences']['Row'];
type CopyBlock = Database['public']['Tables']['copy_blocks']['Row'];
type Workspace = Database['public']['Tables']['workspaces']['Row'];

type View =
  | { type: 'dashboard' }
  | { type: 'audienceList' }
  | { type: 'audienceDetail'; audience: Audience }
  | { type: 'copyList' }
  | { type: 'copyDetail'; copyBlock: CopyBlock };

export default function Dashboard() {
  const [view, setView] = useState<View>({ type: 'dashboard' });
  const [workspaces, setWorkspaces] = useState<(Workspace & { role: string })[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<(Workspace & { role: string }) | null>(null);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [copyBlocks, setCopyBlocks] = useState<CopyBlock[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleWorkspaceSelect = (workspace: Workspace & { role: string }) => {
    setSelectedWorkspace(workspace);
    setWorkspaceDropdownOpen(false);
    setView({ type: 'dashboard' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (view.type === 'audienceList') {
    return (
      <AudienceList
        audiences={audiences}
        onSelectAudience={(audience) => setView({ type: 'audienceDetail', audience })}
        onBack={() => setView({ type: 'dashboard' })}
      />
    );
  }

  if (view.type === 'audienceDetail') {
    return (
      <AudienceDetail
        audience={view.audience}
        onBack={() => setView({ type: 'audienceList' })}
      />
    );
  }

  if (view.type === 'copyList') {
    return (
      <CopyList
        copyBlocks={copyBlocks}
        onSelectCopyBlock={(copyBlock) => setView({ type: 'copyDetail', copyBlock })}
        onBack={() => setView({ type: 'dashboard' })}
      />
    );
  }

  if (view.type === 'copyDetail') {
    return (
      <CopyDetail
        copyBlock={view.copyBlock}
        onBack={() => setView({ type: 'copyList' })}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img src="/wonderflow-coloricon.png" alt="Wonderflow" className="w-9 h-9" />
            </div>
            <div className="flex items-center gap-2">
              {workspaces.length > 0 && selectedWorkspace && (
                <div className="relative">
                  <button
                    onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1 bg-white text-gray-700 hover:text-gray-900 rounded-lg transition-colors text-sm"
                  >
                     <Building2 className="h-4 w-4" />
                    <span className="font-medium max-w-[150px] truncate">
                      {selectedWorkspace.name}
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
                            <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase font-semibold ml-2">
                              {workspace.role}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <a
                href="https://app.wonderflow.io"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Open App"
              >
                <Home className="w-4 h-4 text-gray-600" />
              </a>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="relative bg-primary/5 border border-primary p-2 rounded-xl">
            <p className="text-sm font-semibold text-primary">
              Use Wonderflow as a reference while you work
            </p>
            <p className="text-xs text-gray-800">
              Open this panel while writing ads, emails, or landing pages. Pull audience insights and approved messaging without switching tools.
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {!selectedWorkspace ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Select a workspace</p>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Audiences</h2>
                {audiences.length > 0 && (
                  <button
                    onClick={() => setView({ type: 'audienceList' })}
                    className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {audiences.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No audiences found in this workspace</p>
                </div>
              ) : (
                <button
                  onClick={() => setView({ type: 'audienceDetail', audience: audiences[0] })}
                  className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary transition-all text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{audiences[0].name}</h3>
                  {audiences[0].notes && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{audiences[0].notes}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {audiences[0].goal && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {audiences[0].goal}
                      </span>
                    )}
                    {audiences[0].funnel_stage && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                        {audiences[0].funnel_stage}
                      </span>
                    )}
                  </div>
                </button>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">Copy</h2>
                {copyBlocks.length > 0 && (
                  <button
                    onClick={() => setView({ type: 'copyList' })}
                    className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {copyBlocks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No copy blocks found in this workspace</p>
                </div>
              ) : (
                <button
                  onClick={() => setView({ type: 'copyDetail', copyBlock: copyBlocks[0] })}
                  className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{copyBlocks[0].name}</h3>
                    <div className="flex gap-2">
                      {copyBlocks[0].type && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {copyBlocks[0].type}
                        </span>
                      )}
                      {copyBlocks[0].status && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          {copyBlocks[0].status}
                        </span>
                      )}
                    </div>
                  </div>
                  {copyBlocks[0].notes && (
                    <p className="text-sm text-gray-600 line-clamp-2">{copyBlocks[0].notes}</p>
                  )}
                </button>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
