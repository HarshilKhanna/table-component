import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import FilterPanel from './FilterPanel';
import SortPanel from './SortPanel';
import { SortState } from './SortPanel';

// Register AG Grid Modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface TaskData {
  taskId: string;
  contractId: string;
  obligationTitle: string;
  category: string;
  domain: string;
  subdomain: string;
  criticality: string;
  owner: string;
  triggeredTasks: number;
  openTasks: number;
  compliance: string;
  isGroupRow?: boolean;
  isExpanded?: boolean;
  [key: string]: string | number | boolean | undefined;
}

interface CustomCellRendererParams extends ICellRendererParams {
  data: TaskData;
  value: string;
}

interface SubdomainGroup {
  subdomain: string;
  tasks: TaskData[];
}

interface CategoryGroup {
  category: string;
  subdomains: { [key: string]: SubdomainGroup };
}

interface ContractGroup {
  contractId: string;
  categories: { [key: string]: CategoryGroup };
}

interface FilterState {
  condition: 'AND' | 'OR';
  filters: {
    [key: string]: {
      operator: string;
      value: string | string[];
    };
  };
}

const TaskTable: React.FC = () => {
  const [isGroupedView, setIsGroupedView] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    condition: 'AND',
    filters: {}
  });
  const [activeSorts, setActiveSorts] = useState<SortState[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const columnDefs: ColDef[] = [
    {
      field: 'contractId',
      headerName: 'Contract ID',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) {
          const isExpanded = params.data.isExpanded;
          return (
            <div 
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600,
                color: '#1a73e8'
              }}
              onClick={() => toggleGroup(params.value as string)}
            >
              <span>{isExpanded ? '▼' : '▶'}</span>
              {params.value}
            </div>
          );
        }
        return params.value;
      }
    },
    {
      field: 'taskId',
      headerName: 'Task ID',
      sortable: true,
      filter: true,
      width: 100,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) return '';
        return params.value;
      }
    },
    {
      field: 'obligationTitle',
      headerName: 'Obligation Title',
      sortable: true,
      filter: true,
      wrapText: true,
      autoHeight: true,
      flex: 2,
      minWidth: 200,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) {
          return (
            <div style={{ fontWeight: 500 }}>{params.value}</div>
          );
        }
        return params.value;
      }
    },
    {
      field: 'category',
      headerName: 'Category',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) return '';
        return params.value;
      }
    },
    {
      field: 'domain',
      headerName: 'Domain',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) return '';
        return params.value;
      }
    },
    {
      field: 'subdomain',
      headerName: 'Subdomain',
      sortable: true,
      filter: true,
      width: 130,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) return '';
        return params.value;
      }
    },
    {
      field: 'criticality',
      headerName: 'Criticality',
      sortable: true,
      filter: true,
      width: 110,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) return '';
        return params.value;
      }
    },
    {
      field: 'owner',
      headerName: 'Owner',
      sortable: true,
      filter: true,
      width: 130,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) return '';
        return params.value;
      }
    },
    {
      field: 'triggeredTasks',
      headerName: 'Triggered Tasks',
      sortable: true,
      filter: true,
      type: 'numericColumn',
      width: 130,
    },
    {
      field: 'openTasks',
      headerName: 'Open Tasks',
      sortable: true,
      filter: true,
      type: 'numericColumn',
      width: 110,
    },
    {
      field: 'compliance',
      headerName: 'Compliance',
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: (params: CustomCellRendererParams) => {
        if (params.data.isGroupRow) return '';
        return (
          <span className={`compliance-status ${(params.value as string).toLowerCase()}`}>
            {params.value}
          </span>
        );
      }
    },
  ];

  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  const sampleData: TaskData[] = [
    {
      taskId: 'T001',
      contractId: 'C001',
      obligationTitle: 'Review Security Protocols',
      category: 'Security',
      domain: 'IT',
      subdomain: 'Cybersecurity',
      criticality: 'High',
      owner: 'John Doe',
      triggeredTasks: 2,
      openTasks: 3,
      compliance: 'Pending'
    },
    {
      taskId: 'T002',
      contractId: 'C001',
      obligationTitle: 'Update Firewall Rules',
      category: 'Security',
      domain: 'IT',
      subdomain: 'Network',
      criticality: 'High',
      owner: 'Jane Smith',
      triggeredTasks: 1,
      openTasks: 2,
      compliance: 'Compliant'
    },
    {
      taskId: 'T003',
      contractId: 'C002',
      obligationTitle: 'Annual Financial Audit',
      category: 'Finance',
      domain: 'Accounting',
      subdomain: 'Audit',
      criticality: 'Medium',
      owner: 'Mike Johnson',
      triggeredTasks: 4,
      openTasks: 5,
      compliance: 'Non-Compliant'
    },
    {
      taskId: 'T004',
      contractId: 'C002',
      obligationTitle: 'Quarterly Tax Filing',
      category: 'Finance',
      domain: 'Accounting',
      subdomain: 'Tax',
      criticality: 'High',
      owner: 'Sarah Wilson',
      triggeredTasks: 0,
      openTasks: 1,
      compliance: 'Compliant'
    },
    {
      taskId: 'T005',
      contractId: 'C003',
      obligationTitle: 'Employee Training Program',
      category: 'HR',
      domain: 'Training',
      subdomain: 'Development',
      criticality: 'Medium',
      owner: 'Lisa Anderson',
      triggeredTasks: 3,
      openTasks: 4,
      compliance: 'Pending'
    },
    {
      taskId: 'T006',
      contractId: 'C003',
      obligationTitle: 'Performance Reviews',
      category: 'HR',
      domain: 'Personnel',
      subdomain: 'Evaluation',
      criticality: 'Low',
      owner: 'Lisa Anderson',
      triggeredTasks: 6,
      openTasks: 8,
      compliance: 'Non-Compliant'
    },
    {
      taskId: 'T007',
      contractId: 'C001',
      obligationTitle: 'Data Backup Verification',
      category: 'Security',
      domain: 'IT',
      subdomain: 'Data Management',
      criticality: 'High',
      owner: 'John Doe',
      triggeredTasks: 0,
      openTasks: 1,
      compliance: 'Compliant'
    },
    {
      taskId: 'T008',
      contractId: 'C004',
      obligationTitle: 'Supply Chain Audit',
      category: 'Operations',
      domain: 'Logistics',
      subdomain: 'Audit',
      criticality: 'Medium',
      owner: 'Robert Brown',
      triggeredTasks: 4,
      openTasks: 6,
      compliance: 'Pending'
    },
    {
      taskId: 'T009',
      contractId: 'C004',
      obligationTitle: 'Inventory Management Review',
      category: 'Operations',
      domain: 'Logistics',
      subdomain: 'Inventory',
      criticality: 'Medium',
      owner: 'Robert Brown',
      triggeredTasks: 2,
      openTasks: 3,
      compliance: 'Compliant'
    },
    {
      taskId: 'T010',
      contractId: 'C002',
      obligationTitle: 'Budget Planning 2024',
      category: 'Finance',
      domain: 'Planning',
      subdomain: 'Budgeting',
      criticality: 'High',
      owner: 'Mike Johnson',
      triggeredTasks: 5,
      openTasks: 7,
      compliance: 'Pending'
    },
    {
      taskId: 'T011',
      contractId: 'C005',
      obligationTitle: 'Data Privacy Compliance Review',
      category: 'Legal',
      domain: 'Compliance',
      subdomain: 'Privacy',
      criticality: 'High',
      owner: 'Emma Davis',
      triggeredTasks: 3,
      openTasks: 4,
      compliance: 'Pending'
    },
    {
      taskId: 'T012',
      contractId: 'C005',
      obligationTitle: 'GDPR Documentation Update',
      category: 'Legal',
      domain: 'Compliance',
      subdomain: 'Privacy',
      criticality: 'High',
      owner: 'Emma Davis',
      triggeredTasks: 2,
      openTasks: 2,
      compliance: 'Compliant'
    },
    {
      taskId: 'T013',
      contractId: 'C006',
      obligationTitle: 'Server Infrastructure Upgrade',
      category: 'IT',
      domain: 'Infrastructure',
      subdomain: 'Hardware',
      criticality: 'Medium',
      owner: 'David Chen',
      triggeredTasks: 5,
      openTasks: 6,
      compliance: 'Pending'
    },
    {
      taskId: 'T014',
      contractId: 'C006',
      obligationTitle: 'Network Security Assessment',
      category: 'Security',
      domain: 'IT',
      subdomain: 'Network',
      criticality: 'High',
      owner: 'David Chen',
      triggeredTasks: 3,
      openTasks: 4,
      compliance: 'Non-Compliant'
    },
    {
      taskId: 'T015',
      contractId: 'C007',
      obligationTitle: 'Employee Training Records Update',
      category: 'HR',
      domain: 'Training',
      subdomain: 'Records',
      criticality: 'Low',
      owner: 'Sophie Turner',
      triggeredTasks: 1,
      openTasks: 2,
      compliance: 'Compliant'
    },
    {
      taskId: 'T016',
      contractId: 'C007',
      obligationTitle: 'Workplace Safety Audit',
      category: 'HR',
      domain: 'Safety',
      subdomain: 'Audit',
      criticality: 'Medium',
      owner: 'Sophie Turner',
      triggeredTasks: 4,
      openTasks: 5,
      compliance: 'Pending'
    },
    {
      taskId: 'T017',
      contractId: 'C008',
      obligationTitle: 'Vendor Contract Review',
      category: 'Legal',
      domain: 'Contracts',
      subdomain: 'Review',
      criticality: 'Medium',
      owner: 'James Wilson',
      triggeredTasks: 2,
      openTasks: 3,
      compliance: 'Compliant'
    },
    {
      taskId: 'T018',
      contractId: 'C008',
      obligationTitle: 'Supplier Agreement Update',
      category: 'Legal',
      domain: 'Contracts',
      subdomain: 'Update',
      criticality: 'Medium',
      owner: 'James Wilson',
      triggeredTasks: 1,
      openTasks: 2,
      compliance: 'Pending'
    },
    {
      taskId: 'T019',
      contractId: 'C009',
      obligationTitle: 'Customer Data Migration',
      category: 'IT',
      domain: 'Data',
      subdomain: 'Migration',
      criticality: 'High',
      owner: 'Linda Martinez',
      triggeredTasks: 6,
      openTasks: 8,
      compliance: 'Non-Compliant'
    },
    {
      taskId: 'T020',
      contractId: 'C009',
      obligationTitle: 'Database Backup Verification',
      category: 'IT',
      domain: 'Data',
      subdomain: 'Backup',
      criticality: 'High',
      owner: 'Linda Martinez',
      triggeredTasks: 2,
      openTasks: 3,
      compliance: 'Pending'
    },
    {
      taskId: 'T021',
      contractId: 'C010',
      obligationTitle: 'Marketing Campaign Compliance',
      category: 'Marketing',
      domain: 'Compliance',
      subdomain: 'Campaigns',
      criticality: 'Medium',
      owner: 'Tom Baker',
      triggeredTasks: 3,
      openTasks: 4,
      compliance: 'Compliant'
    },
    {
      taskId: 'T022',
      contractId: 'C010',
      obligationTitle: 'Social Media Policy Review',
      category: 'Marketing',
      domain: 'Policy',
      subdomain: 'Review',
      criticality: 'Low',
      owner: 'Tom Baker',
      triggeredTasks: 1,
      openTasks: 2,
      compliance: 'Compliant'
    },
    {
      taskId: 'T023',
      contractId: 'C011',
      obligationTitle: 'Financial Audit Preparation',
      category: 'Finance',
      domain: 'Audit',
      subdomain: 'Preparation',
      criticality: 'High',
      owner: 'Rachel Green',
      triggeredTasks: 5,
      openTasks: 7,
      compliance: 'Pending'
    },
    {
      taskId: 'T024',
      contractId: 'C011',
      obligationTitle: 'Tax Compliance Review',
      category: 'Finance',
      domain: 'Tax',
      subdomain: 'Review',
      criticality: 'High',
      owner: 'Rachel Green',
      triggeredTasks: 4,
      openTasks: 5,
      compliance: 'Non-Compliant'
    },
    {
      taskId: 'T025',
      contractId: 'C012',
      obligationTitle: 'Product Safety Assessment',
      category: 'Operations',
      domain: 'Safety',
      subdomain: 'Assessment',
      criticality: 'High',
      owner: 'Mark Thompson',
      triggeredTasks: 3,
      openTasks: 4,
      compliance: 'Pending'
    },
    {
      taskId: 'T026',
      contractId: 'C012',
      obligationTitle: 'Quality Control Process Update',
      category: 'Operations',
      domain: 'Quality',
      subdomain: 'Process',
      criticality: 'Medium',
      owner: 'Mark Thompson',
      triggeredTasks: 2,
      openTasks: 3,
      compliance: 'Compliant'
    },
    {
      taskId: 'T027',
      contractId: 'C013',
      obligationTitle: 'Environmental Compliance Audit',
      category: 'Operations',
      domain: 'Environment',
      subdomain: 'Audit',
      criticality: 'High',
      owner: 'Alice Cooper',
      triggeredTasks: 4,
      openTasks: 6,
      compliance: 'Non-Compliant'
    },
    {
      taskId: 'T028',
      contractId: 'C013',
      obligationTitle: 'Waste Management Review',
      category: 'Operations',
      domain: 'Environment',
      subdomain: 'Management',
      criticality: 'Medium',
      owner: 'Alice Cooper',
      triggeredTasks: 2,
      openTasks: 3,
      compliance: 'Pending'
    },
    {
      taskId: 'T029',
      contractId: 'C014',
      obligationTitle: 'Software License Compliance',
      category: 'IT',
      domain: 'Licensing',
      subdomain: 'Compliance',
      criticality: 'Medium',
      owner: 'Peter Parker',
      triggeredTasks: 3,
      openTasks: 4,
      compliance: 'Compliant'
    },
    {
      taskId: 'T030',
      contractId: 'C014',
      obligationTitle: 'IT Asset Inventory Update',
      category: 'IT',
      domain: 'Asset',
      subdomain: 'Inventory',
      criticality: 'Low',
      owner: 'Peter Parker',
      triggeredTasks: 1,
      openTasks: 2,
      compliance: 'Compliant'
    }
  ];

  const sortedAndFilteredData = useMemo(() => {
    // First apply filters
    let result = sampleData;
    
    if (Object.keys(activeFilters.filters).length > 0) {
      result = result.filter(task => {
        const filterEntries = Object.entries(activeFilters.filters);
        
        if (activeFilters.condition === 'AND') {
          return filterEntries.every(([field, filter]) => {
            const value = task[field];
            const { operator, value: filterValue } = filter;

            switch (operator) {
              case 'is':
                return value === filterValue || 
                       (typeof value === 'number' && Number(value) === Number(filterValue));
              case 'contains':
                return typeof value === 'string' && 
                       typeof filterValue === 'string' && 
                       value.toLowerCase().includes(filterValue.toLowerCase());
              case 'greaterThan':
                return typeof value === 'number' && 
                       Number(value) > Number(filterValue);
              case 'lessThan':
                return typeof value === 'number' && 
                       Number(value) < Number(filterValue);
              default:
                return true;
            }
          });
        } else {
          return filterEntries.some(([field, filter]) => {
            const value = task[field];
            const { operator, value: filterValue } = filter;

            switch (operator) {
              case 'is':
                return value === filterValue || 
                       (typeof value === 'number' && Number(value) === Number(filterValue));
              case 'contains':
                return typeof value === 'string' && 
                       typeof filterValue === 'string' && 
                       value.toLowerCase().includes(filterValue.toLowerCase());
              case 'greaterThan':
                return typeof value === 'number' && 
                       Number(value) > Number(filterValue);
              case 'lessThan':
                return typeof value === 'number' && 
                       Number(value) < Number(filterValue);
              default:
                return true;
            }
          });
        }
      });
    }

    // Then apply sorts
    if (activeSorts.length > 0) {
      result = [...result].sort((a, b) => {
        for (const sort of activeSorts) {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          
          if (aValue === bValue) continue;
          
          const isNumeric = ['taskId', 'contractId', 'triggeredTasks', 'openTasks'].includes(sort.field);
          
          if (isNumeric) {
            const aNum = typeof aValue === 'string' ? parseInt(aValue.replace(/\D/g, '')) : Number(aValue);
            const bNum = typeof bValue === 'string' ? parseInt(bValue.replace(/\D/g, '')) : Number(bValue);
            return sort.order === 'asc' ? aNum - bNum : bNum - aNum;
          } else {
            const aString = String(aValue).toLowerCase();
            const bString = String(bValue).toLowerCase();
            return sort.order === 'asc' 
              ? aString.localeCompare(bString)
              : bString.localeCompare(aString);
          }
        }
        return 0;
      });
    }

    return result;
  }, [sampleData, activeFilters, activeSorts]);

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    setIsFilterPanelOpen(false);
  };

  const handleApplySort = (sortRules: SortState[]) => {
    setActiveSorts(sortRules);
    setIsSortPanelOpen(false);
  };

  const groupDataByHierarchy = (data: any[]) => {
    const groups: { [key: string]: ContractGroup } = {};

    data.forEach(task => {
      if (!groups[task.contractId]) {
        groups[task.contractId] = {
          contractId: task.contractId,
          categories: {}
        };
      }

      if (!groups[task.contractId].categories[task.category]) {
        groups[task.contractId].categories[task.category] = {
          category: task.category,
          subdomains: {}
        };
      }

      if (!groups[task.contractId].categories[task.category].subdomains[task.subdomain]) {
        groups[task.contractId].categories[task.category].subdomains[task.subdomain] = {
          subdomain: task.subdomain,
          tasks: []
        };
      }

      groups[task.contractId].categories[task.category].subdomains[task.subdomain].tasks.push(task);
    });

    return Object.values(groups);
  };

  const toggleGroup = (contractId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(contractId)) {
      newExpandedGroups.delete(contractId);
    } else {
      newExpandedGroups.add(contractId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  const renderFlatView = () => (
    <div className="ag-theme-alpine">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={sortedAndFilteredData}
        defaultColDef={defaultColDef}
        animateRows={false}
        theme="legacy"
      />
    </div>
  );

  const renderGroupedView = () => {
    const groupedByContract = sortedAndFilteredData.reduce((acc, task) => {
      if (!acc[task.contractId]) {
        acc[task.contractId] = [];
      }
      acc[task.contractId].push(task);
      return acc;
    }, {} as { [key: string]: TaskData[] });

    return (
      <div className="task-table">
        <div className="static-headers">
          <div className="header-cell">Group</div>
          <div className="header-cell">Task ID</div>
          <div className="header-cell">Obligation Title</div>
          <div className="header-cell">Category</div>
          <div className="header-cell">Domain</div>
          <div className="header-cell">Subdomain</div>
          <div className="header-cell">Criticality</div>
          <div className="header-cell">Owner</div>
          <div className="header-cell">Triggered Tasks</div>
          <div className="header-cell">Open Tasks</div>
          <div className="header-cell">Compliance</div>
        </div>

        <div className="groups-container">
          {Object.entries(groupedByContract).map(([contractId, tasks]) => (
            <div key={contractId} className="contract-group">
              <div 
                className={`group-row ${expandedGroups.has(contractId) ? 'expanded' : ''}`}
                onClick={() => toggleGroup(contractId)}
              >
                <div className="group-title-cell">
                  <span className="expand-icon">{expandedGroups.has(contractId) ? '▼' : '▶'}</span>
                  <span className="group-title">{contractId}</span>
                  <span className="task-count">({tasks.length})</span>
                </div>
                {/* Empty cells to maintain grid structure */}
                {Array(10).fill(null).map((_, i) => (
                  <div key={i} className="cell"></div>
                ))}
              </div>
              {expandedGroups.has(contractId) && (
                <div className="group-content">
                  {tasks.map((task) => (
                    <div key={task.taskId} className="task-row">
                      <div className="cell"></div>
                      <div className="cell">{task.taskId}</div>
                      <div className="cell">{task.obligationTitle}</div>
                      <div className="cell">{task.category}</div>
                      <div className="cell">{task.domain}</div>
                      <div className="cell">{task.subdomain}</div>
                      <div className="cell">{task.criticality}</div>
                      <div className="cell">{task.owner}</div>
                      <div className="cell">{task.triggeredTasks}</div>
                      <div className="cell">{task.openTasks}</div>
                      <div className="cell">
                        <span className={`compliance-status ${task.compliance.toLowerCase()}`}>
                          {task.compliance}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="task-table-container">
      <div className="table-header">
        <button 
          className="view-toggle-button" 
          onClick={() => setIsGroupedView(!isGroupedView)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
          {isGroupedView ? 'Switch to Flat View' : 'Switch to Grouped View'}
        </button>
        <button
          className="filter-button"
          onClick={() => setIsFilterPanelOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
          </svg>
          Filter
        </button>
        <button
          className="sort-button"
          onClick={() => setIsSortPanelOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
          </svg>
          Sort
        </button>
      </div>

      {isGroupedView ? renderGroupedView() : renderFlatView()}

      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        onApplyFilters={handleApplyFilters}
        data={sampleData}
      />

      <SortPanel
        isOpen={isSortPanelOpen}
        onClose={() => setIsSortPanelOpen(false)}
        onApplySort={handleApplySort}
      />
    </div>
  );
};

export default TaskTable; 