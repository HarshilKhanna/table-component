import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef } from 'ag-grid-community';

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
  openTasks: number;
  compliance: string;
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

const TaskTable: React.FC = () => {
  const [isGroupedView, setIsGroupedView] = useState(false);

  const flatColumnDefs: ColDef[] = [
    {
      field: 'contractId',
      headerName: 'Contract ID',
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      field: 'category',
      headerName: 'Category',
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
      openTasks: 3,
      compliance: 'Pending'
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
      openTasks: 1,
      compliance: 'Compliant'
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
      openTasks: 5,
      compliance: 'Non-Compliant'
    },
    {
      taskId: 'T10',
      contractId: 'C002',
      obligationTitle: 'Budget Planning 2024',
      category: 'Finance',
      domain: 'Planning',
      subdomain: 'Budgeting',
      criticality: 'High',
      owner: 'Mike Johnson',
      openTasks: 7,
      compliance: 'Pending'
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
      openTasks: 8,
      compliance: 'Non-Compliant'
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
      openTasks: 3,
      compliance: 'Compliant'
    }
  ];

  // Process data into grouped structure
  const groupedData = useMemo(() => {
    const groups: { [key: string]: ContractGroup } = {};

    sampleData.forEach(task => {
      // Initialize contract group if it doesn't exist
      if (!groups[task.contractId]) {
        groups[task.contractId] = {
          contractId: task.contractId,
          categories: {}
        };
      }

      // Initialize category group if it doesn't exist
      if (!groups[task.contractId].categories[task.category]) {
        groups[task.contractId].categories[task.category] = {
          category: task.category,
          subdomains: {}
        };
      }

      // Initialize subdomain group if it doesn't exist
      if (!groups[task.contractId].categories[task.category].subdomains[task.subdomain]) {
        groups[task.contractId].categories[task.category].subdomains[task.subdomain] = {
          subdomain: task.subdomain,
          tasks: []
        };
      }

      // Add task to appropriate subdomain group
      groups[task.contractId].categories[task.category].subdomains[task.subdomain].tasks.push(task);
    });

    return Object.values(groups);
  }, [sampleData]);

  const renderFlatView = () => (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '600px' }}>
      <AgGridReact
        columnDefs={flatColumnDefs}
        defaultColDef={defaultColDef}
        rowData={sampleData}
        theme="legacy"
        animateRows={true}
      />
    </div>
  );

  const renderGroupedView = () => (
    <div className="task-table">
      {groupedData.map(contract => (
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
    <div>
      <button 
        className="view-toggle-button" 
        onClick={() => setIsGroupedView(!isGroupedView)}
      >
        {isGroupedView ? 'Switch to Flat View' : 'Switch to Grouped View'}
      </button>
      {isGroupedView ? renderGroupedView() : renderFlatView()}
    </div>
  );
};

export default TaskTable; 