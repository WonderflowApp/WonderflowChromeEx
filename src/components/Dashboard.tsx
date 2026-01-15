import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, ChevronDown, Home, ChevronRight, Building2 } from 'lucide-react';
import type { Database } from '../lib/database.types';
import AudienceList from './AudienceList';
import AudienceDetail from './AudienceDetail';
import PlaybookList from './PlaybookList';
import PlaybookDetail from './PlaybookDetail';

type Audience = Database['public']['Tables']['audiences']['Row'];
type Playbook = Database['public']['Tables']['playbooks']['Row'];
type Workspace = Database['public']['Tables']['workspaces']['Row'];

type View =
  | { type: 'dashboard' }
  | { type: 'audienceList' }
  | { type: 'audienceDetail'; audience: Audience }
  | { type: 'playbookList' }
  | { type: 'playbookDetail'; playbook: Playbook };

const getInitialView = (): View => {
  try {
    const savedView = localStorage.getItem('currentView');
    if (savedView) {
      const parsedView = JSON.parse(savedView);
      if (parsedView.type === 'audienceList' || parsedView.type === 'playbookList') {
        return { type: parsedView.type };
      }
      if (parsedView.type === 'audienceDetail' && parsedView.audienceId) {
        return { type: 'dashboard' };
      }
      if (parsedView.type === 'playbookDetail' && parsedView.playbookId) {
        return { type: 'dashboard' };
      }
    }
  } catch (error) {
    console.error('Error loading initial view:', error);
  }
  return { type: 'dashboard' };
};

export default function Dashboard() {
  const [view, setView] = useState<View>(getInitialView());
  const [workspaces, setWorkspaces] = useState<(Workspace & { role: string })[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<(Workspace & { role: string }) | null>(null);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [viewRestored, setViewRestored] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchAudiences();
      fetchPlaybooks();
      localStorage.setItem('selectedWorkspaceId', selectedWorkspace.id);
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    if (viewRestored || !selectedWorkspace) return;

    const savedView = localStorage.getItem('currentView');
    if (savedView && audiences.length > 0 && playbooks.length > 0) {
      try {
        const parsedView = JSON.parse(savedView);

        if (parsedView.workspaceId !== selectedWorkspace.id) {
          setViewRestored(true);
          return;
        }

        if (parsedView.type === 'audienceDetail' && parsedView.audienceId) {
          const audience = audiences.find(a => a.id === parsedView.audienceId);
          if (audience) {
            setView({ type: 'audienceDetail', audience });
          }
        } else if (parsedView.type === 'playbookDetail' && parsedView.playbookId) {
          const playbook = playbooks.find(p => p.id === parsedView.playbookId);
          if (playbook) {
            setView({ type: 'playbookDetail', playbook });
          }
        }
        setViewRestored(true);
      } catch (error) {
        console.error('Error restoring view:', error);
        setViewRestored(true);
      }
    } else if (selectedWorkspace) {
      setViewRestored(true);
    }
  }, [audiences, playbooks, selectedWorkspace, viewRestored]);

  useEffect(() => {
    if (!selectedWorkspace) return;

    if (view.type === 'audienceDetail') {
      localStorage.setItem('currentView', JSON.stringify({
        type: 'audienceDetail',
        audienceId: view.audience.id,
        workspaceId: selectedWorkspace.id
      }));
    } else if (view.type === 'playbookDetail') {
      localStorage.setItem('currentView', JSON.stringify({
        type: 'playbookDetail',
        playbookId: view.playbook.id,
        workspaceId: selectedWorkspace.id
      }));
    } else if (view.type === 'audienceList') {
      localStorage.setItem('currentView', JSON.stringify({
        type: 'audienceList',
        workspaceId: selectedWorkspace.id
      }));
    } else if (view.type === 'playbookList') {
      localStorage.setItem('currentView', JSON.stringify({
        type: 'playbookList',
        workspaceId: selectedWorkspace.id
      }));
    } else {
      localStorage.setItem('currentView', JSON.stringify({
        type: 'dashboard',
        workspaceId: selectedWorkspace.id
      }));
    }
  }, [view, selectedWorkspace]);

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

  const fetchPlaybooks = async () => {
    if (!selectedWorkspace) return;

    try {
      const { data, error } = await supabase
        .from('playbooks')
        .select('*')
        .eq('workspace_id', selectedWorkspace.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setPlaybooks(data || []);
    } catch (error) {
      console.error('Error fetching playbooks:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleWorkspaceSelect = (workspace: Workspace & { role: string }) => {
    setSelectedWorkspace(workspace);
    setWorkspaceDropdownOpen(false);
    setView({ type: 'dashboard' });
    setViewRestored(false);
    localStorage.removeItem('currentView');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

  if (view.type === 'playbookList') {
    return (
      <PlaybookList
        playbooks={playbooks}
        onSelectPlaybook={(playbook) => setView({ type: 'playbookDetail', playbook })}
        onBack={() => setView({ type: 'dashboard' })}
      />
    );
  }

  if (view.type === 'playbookDetail') {
    return (
      <PlaybookDetail
        playbook={view.playbook}
        onBack={() => setView({ type: 'playbookList' })}
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

          <div className="relative bg-primary/5 border border-primary px-4 py-2 rounded-2xl my-2">
            <p className="text-sm font-semibold text-primary-dark">
              Reference Audiences & Copy As You Work
            </p>
            <p className="text-xs text-primary-dark">
              Open this panel while creating ads, emails, or landing pages. Pull audience insights and approved messaging without switching tools.
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
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-md font-bold text-gray-900">Audiences</h2>
                {audiences.length > 0 && (
                  <button
                    onClick={() => setView({ type: 'audienceList' })}
                    className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {audiences.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No audiences found in this workspace</p>
                </div>
              ) : (
                <button
                  onClick={() => setView({ type: 'audienceDetail', audience: audiences[0] })}
                  className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary transition-all text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{audiences[0].name}</h3>
                  {audiences[0].notes && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{audiences[0].notes}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {audiences[0].goal && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                        {audiences[0].goal}
                      </span>
                    )}
                    {audiences[0].funnel_stage && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full capitalize">
                        {audiences[0].funnel_stage}
                      </span>
                    )}
                  </div>
                     <p className="text-xs text-gray-500">
                 Created {new Date(audiences[0].created_at).toLocaleDateString()}
                </p>
                </button>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-md font-bold text-gray-900">Playbooks</h2>
                {playbooks.length > 0 && (
                  <button
                    onClick={() => setView({ type: 'playbookList' })}
                    className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {playbooks.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No playbooks found in this workspace</p>
                </div>
              ) : (
                <button
                  onClick={() => setView({ type: 'playbookDetail', playbook: playbooks[0] })}
                  className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{playbooks[0].name}</h3>
                  </div>
                  {playbooks[0].description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{playbooks[0].description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Updated {new Date(playbooks[0].updated_at).toLocaleDateString()}
                  </p>
                </button>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
