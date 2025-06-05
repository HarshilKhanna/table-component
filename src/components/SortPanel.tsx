import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
    const newRules = sortRules.filter((_, i) => i !== index);
    setSortRules(newRules);
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
  };

  const isNumericField = (fieldValue: string) => {
    const field = FIELD_OPTIONS.find(option => option.value === fieldValue);
    return field?.isNumeric || false;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="sort-overlay open" onClick={onClose} />
      <div className="sort-panel open">
        <div className="sort-header">
          <h3>Sort by</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sort-rules">
            {(provided) => (
              <div
                className="sort-rows"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {sortRules.map((rule, index) => (
                  <Draggable
                    key={index}
                    draggableId={`sort-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="sort-row"
                        style={{
                          ...provided.draggableProps.style,
                          marginBottom: '8px'
                        }}
                      >
                        <div className="sort-controls">
                          <div
                            {...provided.dragHandleProps}
                            className="drag-handle"
                            title="Drag to reorder"
                          >
                            ⋮⋮
                          </div>
                          <select
                            value={rule.field}
                            onChange={(e) => handleSortChange(index, 'field', e.target.value)}
                            className="field-select"
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
                            className="order-select"
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
                            className="remove-sort"
                            onClick={() => handleRemoveSort(index)}
                            title="Remove sort"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="sort-actions">
          <button className="add-sort" onClick={handleAddSort}>
            + Add sort
          </button>
          <button className="add-sort" onClick={() => setSortRules([{ field: '', order: 'asc' }])}>
            Clear all
          </button>
          <button className="apply-sort" onClick={handleApplySort}>
            Apply Sort
          </button>
        </div>
      </div>
    </>
  );
};

export default SortPanel; 