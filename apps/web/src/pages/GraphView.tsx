import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { api } from '../api/client';
import { GraphData, Person, Household } from '../types';
import { useTranslation } from '../i18n/context';
import {
  Clock,
  User as UserIcon,
  Home as HomeIcon,
  Building,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Info,
  Layers,
} from 'lucide-react';

// Custom Node for Person
const PersonNode: React.FC<{ data: any }> = ({ data }) => {
  const isDeceased = data.status === 'DECEASED';
  return (
    <div
      className={`relative px-4 py-3 rounded-xl border-2 shadow-sm transition-all bg-white min-w-[200px] cursor-pointer hover:shadow-md ${
        data.selected
          ? 'border-purple-600 ring-2 ring-purple-200'
          : isDeceased
          ? 'border-slate-300 bg-slate-50'
          : 'border-purple-200 hover:border-purple-400'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-purple-500" />
      <div className="flex items-center space-x-2.5">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
            isDeceased ? 'bg-slate-200 text-slate-600' : 'bg-purple-100 text-purple-700'
          }`}
        >
          <UserIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-900 truncate">{data.label}</div>
          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
            <span>{data.public_id || 'Person'}</span>
            {data.gender && <span>• {data.gender}</span>}
          </div>
        </div>
      </div>
      {data.status && (
        <div className="mt-2 flex items-center justify-between text-[10px]">
          <span
            className={`px-1.5 py-0.5 rounded font-medium ${
              data.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700'
                : data.status === 'DECEASED'
                ? 'bg-slate-200 text-slate-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {data.status}
          </span>
          {data.role && (
            <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-medium">
              {data.role}
            </span>
          )}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-purple-500" />
    </div>
  );
};

// Custom Node for Household
const HouseholdNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div
      className={`relative px-4 py-3 rounded-xl border-2 shadow-sm transition-all bg-white min-w-[210px] cursor-pointer hover:shadow-md ${
        data.selected
          ? 'border-emerald-600 ring-2 ring-emerald-200'
          : 'border-emerald-200 hover:border-emerald-400'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-emerald-500" />
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
          <HomeIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-900 truncate">{data.label}</div>
          <div className="text-[11px] text-slate-500">{data.public_id || 'Household'}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
          {data.status || 'ACTIVE'}
        </span>
        <span className="text-slate-400">Administrative Unit</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-emerald-500" />
    </div>
  );
};

// Custom Node for Property
const PropertyNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div
      className={`relative px-4 py-3 rounded-xl border-2 shadow-sm transition-all bg-white min-w-[200px] cursor-pointer hover:shadow-md ${
        data.selected
          ? 'border-blue-600 ring-2 ring-blue-200'
          : 'border-blue-200 hover:border-blue-400'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 !bg-blue-500" />
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
          <Building className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-900 truncate">{data.label}</div>
          <div className="text-[11px] text-slate-500 truncate">{data.address_line || data.public_id}</div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
          {data.property_type || 'ASSET'}
        </span>
        <span className="text-slate-500">{data.district || 'Civic'}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 !bg-blue-500" />
    </div>
  );
};

const nodeTypes = {
  person: PersonNode,
  household: HouseholdNode,
  property: PropertyNode,
};

export const GraphViewPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected date for time-travel
  const queryDate = searchParams.get('date') || '2026-10-22';
  const rootType = searchParams.get('type') || 'household';
  const rootId = searchParams.get('id') || '';

  const [dateInput, setDateInput] = useState(queryDate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [personsList, setPersonsList] = useState<Person[]>([]);
  const [householdsList, setHouseholdsList] = useState<Household[]>([]);
  const [selectedEntityId, setSelectedEntityId] = useState<string>(rootId);
  const [selectedEntityType, setSelectedEntityType] = useState<'person' | 'household'>(
    rootType === 'person' ? 'person' : 'household'
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedItem, setSelectedItem] = useState<{
    type: 'node' | 'edge';
    data: any;
  } | null>(null);

  // Load initial options for selection
  useEffect(() => {
    async function loadOptions() {
      try {
        const [pRes, hRes] = await Promise.all([
          api.get<{ data: Person[] }>('/persons'),
          api.get<{ data: Household[] }>('/households'),
        ]);
        setPersonsList(pRes.data);
        setHouseholdsList(hRes.data);

        // Pick default if not provided
        if (!selectedEntityId) {
          if (hRes.data.length > 0) {
            setSelectedEntityId(hRes.data[0].id);
            setSelectedEntityType('household');
          } else if (pRes.data.length > 0) {
            setSelectedEntityId(pRes.data[0].id);
            setSelectedEntityType('person');
          }
        }
      } catch (err: any) {
        console.error('Failed to load graph options', err);
      }
    }
    loadOptions();
  }, []);

  // Fetch graph data whenever entity or date changes
  const fetchGraph = useCallback(async () => {
    if (!selectedEntityId) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        selectedEntityType === 'person'
          ? `/graph/person/${selectedEntityId}?date=${queryDate}`
          : `/graph/household/${selectedEntityId}?date=${queryDate}`;

      const res = await api.get<{ data: GraphData }>(endpoint);
      const graph = res.data;

      // Arrange nodes in clean layout
      const flowNodes: Node[] = graph.nodes.map((n) => {
        let x = 300;
        let y = 150;

        if (n.type === 'household') {
          x = 400;
          y = 80;
        } else if (n.type === 'person') {
          const personIndex = graph.nodes
            .filter((node) => node.type === 'person')
            .findIndex((node) => node.id === n.id);
          x = 100 + (personIndex % 3) * 280;
          y = 260 + Math.floor(personIndex / 3) * 160;
        } else if (n.type === 'property') {
          const propIndex = graph.nodes
            .filter((node) => node.type === 'property')
            .findIndex((node) => node.id === n.id);
          x = 150 + propIndex * 260;
          y = 520;
        }

        return {
          id: n.id,
          type: n.type,
          data: {
            ...n.data,
            label: n.label,
            id: n.id,
            nodeType: n.type,
          },
          position: { x, y },
        };
      });

      const flowEdges: Edge[] = graph.edges.map((e) => {
        const isRelationship = !e.type.includes('MEMBER') && !e.type.includes('OCCUPIES');
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label || e.type,
          type: 'smoothstep',
          animated: isRelationship,
          style: {
            stroke: isRelationship ? '#9333ea' : '#10b981',
            strokeWidth: 2,
          },
          labelStyle: {
            fill: isRelationship ? '#6b21a8' : '#047857',
            fontWeight: 600,
            fontSize: 10,
          },
          labelBgStyle: {
            fill: '#ffffff',
            fillOpacity: 0.9,
          },
          labelBgPadding: [4, 2],
          labelBgBorderRadius: 4,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isRelationship ? '#9333ea' : '#10b981',
          },
          data: e.data,
        };
      });

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (err: any) {
      setError(err?.message || 'Failed to load graph visualization');
    } finally {
      setLoading(false);
    }
  }, [selectedEntityId, selectedEntityType, queryDate, setNodes, setEdges]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const handleDateChange = (newDate: string) => {
    setDateInput(newDate);
    setSearchParams({
      type: selectedEntityType,
      id: selectedEntityId,
      date: newDate,
    });
  };

  const handleEntitySelect = (type: 'person' | 'household', id: string) => {
    setSelectedEntityType(type);
    setSelectedEntityId(id);
    setSearchParams({
      type,
      id,
      date: queryDate,
    });
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedItem({
      type: 'node',
      data: node.data,
    });
  };

  const onEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    setSelectedItem({
      type: 'edge',
      data: {
        id: edge.id,
        label: edge.label,
        ...edge.data,
      },
    });
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col bg-slate-50">
      {/* Top Controls Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">{t('v2.familyGraph')}</h1>
            <p className="text-xs text-slate-500">{t('v2.graphSubtitle')}</p>
          </div>
        </div>

        {/* Focus Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => {
                if (householdsList.length > 0) {
                  handleEntitySelect('household', householdsList[0].id);
                }
              }}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                selectedEntityType === 'household'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('v2.households')}
            </button>
            <button
              onClick={() => {
                if (personsList.length > 0) {
                  handleEntitySelect('person', personsList[0].id);
                }
              }}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${
                selectedEntityType === 'person'
                  ? 'bg-white text-purple-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('v2.persons')}
            </button>
          </div>

          <select
            value={selectedEntityId}
            onChange={(e) => handleEntitySelect(selectedEntityType, e.target.value)}
            className="text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 font-medium shadow-xs focus:border-blue-500 focus:outline-none"
          >
            {selectedEntityType === 'household'
              ? householdsList.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.public_id})
                  </option>
                ))
              : personsList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} ({p.public_id})
                  </option>
                ))}
          </select>

          {/* Time Travel Controls */}
          <div className="flex items-center space-x-2 bg-amber-50/80 border border-amber-200 px-3 py-1.5 rounded-lg text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-semibold text-amber-900">{t('v2.viewAsOf')}:</span>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => handleDateChange(e.target.value)}
              className="border border-amber-300 rounded px-2 py-0.5 text-xs bg-white text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Time Presets for Demo */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleDateChange('2024-06-01')}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors ${
                queryDate === '2024-06-01'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title="Before Rahul split from H001"
            >
              2024 (Pre-Split)
            </button>
            <button
              onClick={() => handleDateChange('2025-07-01')}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors ${
                queryDate === '2025-07-01'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title="Separation date"
            >
              2025 (Split Date)
            </button>
            <button
              onClick={() => handleDateChange('2026-10-22')}
              className={`px-2 py-1 text-[11px] rounded font-medium transition-colors ${
                queryDate === '2026-10-22'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              title="Current time"
            >
              2026 (Current)
            </button>
          </div>

          <button
            onClick={() => fetchGraph()}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-xs"
            title="Refresh graph"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex">
        <div className="flex-1 h-full">
          {error ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-red-900">{t('common.error')}</h3>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              fitView
              minZoom={0.2}
              maxZoom={2}
            >
              <Background color="#cbd5e1" gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(n) => {
                  if (n.type === 'person') return '#a855f7';
                  if (n.type === 'household') return '#10b981';
                  return '#3b82f6';
                }}
                className="!bottom-4 !right-4 !bg-white !rounded-lg !border !border-slate-200"
              />
            </ReactFlow>
          )}
        </div>

        {/* Side Details Panel */}
        <div className="w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto flex flex-col shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('v2.nodeDetails')}
            </h2>
            {selectedItem && (
              <button
                onClick={() => setSelectedItem(null)}
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {selectedItem ? (
            <div className="mt-4 space-y-4">
              {selectedItem.type === 'node' && (
                <>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        selectedItem.data.nodeType === 'person'
                          ? 'bg-purple-100 text-purple-700'
                          : selectedItem.data.nodeType === 'household'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {selectedItem.data.nodeType}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedItem.data.public_id || selectedItem.data.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedItem.data.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedItem.data.address_line || selectedItem.data.status}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-xs border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('v2.status')}:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedItem.data.status || 'ACTIVE'}
                      </span>
                    </div>

                    {selectedItem.data.role && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t('v2.role')}:</span>
                        <span className="font-semibold text-purple-700">
                          {selectedItem.data.role}
                        </span>
                      </div>
                    )}

                    {selectedItem.data.gender && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t('v2.gender')}:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedItem.data.gender}
                        </span>
                      </div>
                    )}

                    {selectedItem.data.dob && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t('v2.dob')}:</span>
                        <span className="font-mono text-slate-800">
                          {selectedItem.data.dob}
                        </span>
                      </div>
                    )}

                    {selectedItem.data.property_type && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Asset Type:</span>
                        <span className="font-semibold text-blue-700">
                          {selectedItem.data.property_type}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (selectedItem.data.nodeType === 'person') {
                        navigate(`/persons/${selectedItem.data.id}`);
                      } else if (selectedItem.data.nodeType === 'household') {
                        navigate(`/households/${selectedItem.data.id}`);
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    <span>View Full Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {selectedItem.type === 'edge' && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                      Edge / Relation
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedItem.data.label}
                    </h3>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-xs border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('v2.verification') || 'Verification'}:</span>
                      <span className="font-semibold text-emerald-700 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                        <span>{selectedItem.data.verification_status || 'VERIFIED'}</span>
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('v2.confidence')}:</span>
                      <span className="font-mono font-medium text-slate-800">
                        {selectedItem.data.confidence !== undefined
                          ? selectedItem.data.confidence
                          : '1.0'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('v2.source')}:</span>
                      <span className="text-slate-700 font-medium">
                        {selectedItem.data.source_name || 'Official Civic Register'}
                      </span>
                    </div>

                    {selectedItem.data.valid_from && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t('v2.validRange')}:</span>
                        <span className="font-mono text-[11px] text-slate-800">
                          {selectedItem.data.valid_from} → {selectedItem.data.valid_to || 'Present'}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-400">
              <Info className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs">{t('v2.clickNodeHint')}</p>
            </div>
          )}

          {/* Quick Demo Context Guide */}
          <div className="mt-auto pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
            <div className="font-semibold text-slate-700">Temporal Household Rule:</div>
            <p>
              In 2024, Rahul Kumar is a child in <strong>Household H001</strong>. In 2025, a
              separation event creates <strong>H002</strong>. Toggle the date above to watch the
              household edges adjust dynamically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphViewPage;
