import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DraggablePortal } from './DraggablePortal';

interface SortPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySort: (sortState: SortState[]) => void;
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

const FIELD_OPTIONS = [
  { label: 'Task ID', value: 'taskId', icon: '📋', isNumeric: true },
  { label: 'Contract ID', value: 'contractId', icon: '📄', isNumeric: true },
  { label: 'Obligation Title', value: 'obligationTitle', icon: '📝', isNumeric: false },
  { label: 'Category', value: 'category', icon: '🏷️', isNumeric: false },
  { label: 'Domain', value: 'domain', icon: '🌐', isNumeric: false },
  { label: 'Subdomain', value: 'subdomain', icon: '📁', isNumeric: false },
  { label: 'Criticality', value: 'criticality', icon: '⚠️', isNumeric: false },
  { label: 'Owner', value: 'owner', icon: '👤', isNumeric: false },
  { label: 'Triggered Tasks', value: 'triggeredTasks', icon: '🔔', isNumeric: true },
  { label: 'Open Tasks', value: 'openTasks', icon: '📊', isNumeric: true },
  { label: 'Compliance', value: 'compliance', icon: '✓', isNumeric: false },
];

const SortPanel: React.FC<SortPanelProps> = ({ isOpen, onClose, onApplySort }) => {
  const [sortRules, setSortRules] = useState<SortState[]>([
    { field: '', order: 'asc' }
  ]);

  const handleAddSort = () => {
    setSortRules([...sortRules, { field: '', order: 'asc' }]);
  };

  const handleRemoveSort = (index: number) => {
    if (sortRules.length === 1) {
      setSortRules([{ field: '', order: 'asc' }]);
    } else {
      const newRules = sortRules.filter((_, i) => i !== index);
      setSortRules(newRules);
    }
  };

  const handleSortChange = (index: number, field: string, value: any) => {
    const newRules = [...sortRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setSortRules(newRules);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sortRules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSortRules(items);
  };

  const handleApplySort = () => {
    const validRules = sortRules.filter(rule => rule.field);
    onApplySort(validRules);
    onClose();
  };

  const isNumericField = (fieldValue: string) => {
    const field = FIELD_OPTIONS.find(option => option.value === fieldValue);
    return field?.isNumeric || false;
  };

  const handleClearAll = () => {
    setSortRules([{ field: '', order: 'asc' }]);
  };

  if (!isOpen) return null;

  const hasValidRules = sortRules.some(rule => rule.field);

  return (
    <>
      <div className="sort-overlay open" onClick={onClose} />
      <div className="sort-panel open" style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div className="sort-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '12px'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#333' }}>Sort by</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '4px 8px',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sort-rules">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '20px',
                  minHeight: '100px'
                }}
              >
                {sortRules.map((rule, index) => (
                  <Draggable
                    key={index}
                    draggableId={`sort-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => {
                      const child = (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            background: snapshot.isDragging ? '#f8f9fa' : 'white',
                            border: '1px solid #e9ecef',
                            borderRadius: '6px',
                            padding: '16px',
                            transition: 'all 0.2s ease',
                            boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center'
                          }}>
                            <div
                              {...provided.dragHandleProps}
                              style={{
                                cursor: 'grab',
                                color: '#666',
                                padding: '8px',
                                borderRadius: '4px',
                                background: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              ⋮⋮
                            </div>
                            <select
                              value={rule.field}
                              onChange={(e) => handleSortChange(index, 'field', e.target.value)}
                              style={{
                                flex: 2,
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            >
                              <option value="">Select field</option>
                              {FIELD_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.icon} {option.label}
                                </option>
                              ))}
                            </select>

                            <select
                              value={rule.order}
                              onChange={(e) => handleSortChange(index, 'order', e.target.value)}
                              style={{
                                flex: 1,
                                minWidth: '120px',
                                padding: '8px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px'
                              }}
                            >
                              {isNumericField(rule.field) ? (
                                <>
                                  <option value="asc">Ascending</option>
                                  <option value="desc">Descending</option>
                                </>
                              ) : (
                                <>
                                  <option value="asc">A to Z</option>
                                  <option value="desc">Z to A</option>
                                </>
                              )}
                            </select>

                            <button
                              onClick={() => handleRemoveSort(index)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#dc3545',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '4px',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff1f1'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );

                      return snapshot.isDragging ? (
                        <DraggablePortal>{child}</DraggablePortal>
                      ) : (
                        child
                      );
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '20px',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddSort}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#ccc';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#ddd';
              }}
            >
              + Add sort
            </button>
            <button
              onClick={handleClearAll}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#ccc';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#ddd';
              }}
            >
              Clear all
            </button>
          </div>
          <button
            onClick={handleApplySort}
            disabled={!hasValidRules}
            style={{
              padding: '8px 24px',
              border: 'none',
              borderRadius: '4px',
              background: hasValidRules ? '#0d6efd' : '#e9ecef',
              color: hasValidRules ? 'white' : '#666',
              cursor: hasValidRules ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (hasValidRules) {
                e.currentTarget.style.backgroundColor = '#0b5ed7';
              }
            }}
            onMouseOut={(e) => {
              if (hasValidRules) {
                e.currentTarget.style.backgroundColor = '#0d6efd';
              }
            }}
          >
            Apply Sort
          </button>
        </div>
      </div>
    </>
  );
};

export default SortPanel; 