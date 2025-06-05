import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';
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
  [key: string]: string | number;
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

  const flatColumnDefs: ColDef[] = [
    {
      field: 'taskId',
      headerName: 'Task ID',
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      field: 'contractId',
      headerName: 'Contract ID',
      sortable: true,
      filter: true,
      width: 120,
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
    },
    {
      field: 'category',
      headerName: 'Category',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: 'domain',
      headerName: 'Domain',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: 'subdomain',
      headerName: 'Subdomain',
      sortable: true,
      filter: true,
      width: 130,
    },
    {
      field: 'criticality',
      headerName: 'Criticality',
      sortable: true,
      filter: true,
      width: 110,
    },
    {
      field: 'owner',
      headerName: 'Owner',
      sortable: true,
      filter: true,
      width: 130,
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
    },
  ];

  const groupedColumnDefs: ColDef[] = [
    {
      field: 'taskId',
      headerName: 'Task ID',
      sortable: true,
      filter: true,
      width: 100,
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
    },
    {
      field: 'domain',
      headerName: 'Domain',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: 'criticality',
      headerName: 'Criticality',
      sortable: true,
      filter: true,
      width: 110,
    },
    {
      field: 'owner',
      headerName: 'Owner',
      sortable: true,
      filter: true,
      width: 130,
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

  const renderFlatView = () => (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '600px' }}>
      <AgGridReact
        columnDefs={flatColumnDefs}
        defaultColDef={defaultColDef}
        rowData={sortedAndFilteredData}
        theme="legacy"
        animateRows={true}
      />
    </div>
  );

  const renderGroupedView = () => (
    <div className="task-table">
      {groupDataByHierarchy(sortedAndFilteredData).map(contract => (
        <details key={contract.contractId} open className="contract-group">
          <summary className="group-header contract-header">
            Contract: {contract.contractId}
          </summary>
          <div className="category-container">
            {Object.values(contract.categories).map(category => (
              <details key={category.category} open className="category-group">
                <summary className="group-header category-header">
                  Category: {category.category}
                </summary>
                <div className="subdomain-container">
                  {Object.values(category.subdomains).map(subdomain => (
                    <details key={subdomain.subdomain} open className="subdomain-group">
                      <summary className="group-header subdomain-header">
                        Subdomain: {subdomain.subdomain}
                      </summary>
                      <div className="ag-theme-alpine" style={{ width: '100%', height: 'auto', minHeight: '150px' }}>
                        <AgGridReact
                          columnDefs={groupedColumnDefs}
                          defaultColDef={defaultColDef}
                          rowData={subdomain.tasks}
                          theme="legacy"
                          animateRows={true}
                          domLayout="autoHeight"
                        />
                      </div>
                    </details>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  );

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
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
          </svg>
          Filter
        </button>
        <button
          className="sort-button"
          onClick={() => setIsSortPanelOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
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