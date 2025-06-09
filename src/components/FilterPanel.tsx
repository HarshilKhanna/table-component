import React, { useState, useRef, useEffect } from 'react';

interface FilterPanelProps {
  data: any[];
  onApplyFilters: (filters: FilterState) => void;
  onClose: () => void;
  isOpen: boolean;
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

interface FilterRow {
  field: string;
  operator: string;
  value: string | string[];
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  suggestions,
  placeholder,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only show suggestions if there's input text
    if (value.length > 0) {
      const filtered = suggestions.filter(
        suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions for better performance
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
    setActiveIndex(-1);
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If no suggestions or not open, don't handle keyboard navigation
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div 
      ref={wrapperRef} 
      className="autocomplete-wrapper"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-owns="suggestions-list"
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => value.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className={className}
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
      />
      {isOpen && filteredSuggestions.length > 0 && (
        <ul 
          id="suggestions-list"
          className="autocomplete-suggestions"
          role="listbox"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              id={`suggestion-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`autocomplete-suggestion ${index === activeIndex ? 'active' : ''}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const OPERATORS = {
  is: 'is',
  contains: 'contains',
  greaterThan: 'greaterThan',
  lessThan: 'lessThan',
};

const FilterPanel: React.FC<FilterPanelProps> = ({ data, onApplyFilters, onClose, isOpen }) => {
  const [filters, setFilters] = useState<FilterRow[]>([
    { field: '', operator: 'is', value: '' }
  ]);
  const [condition, setCondition] = useState<'AND' | 'OR'>('AND');

  // Get unique values for dropdown options
  const getUniqueValues = (field: string) => {
    return [...new Set(data.map(item => item[field]))].filter(Boolean);
  };

  const FIELD_OPTIONS = [
    { label: 'Task ID', value: 'taskId', icon: '📋' },
    { label: 'Contract ID', value: 'contractId', icon: '📄' },
    { label: 'Obligation Title', value: 'obligationTitle', icon: '📝' },
    { label: 'Category', value: 'category', icon: '🏷️' },
    { label: 'Domain', value: 'domain', icon: '🌐' },
    { label: 'Subdomain', value: 'subdomain', icon: '📁' },
    { label: 'Criticality', value: 'criticality', icon: '⚠️' },
    { label: 'Owner', value: 'owner', icon: '👤' },
    { label: 'Triggered Tasks', value: 'triggeredTasks', icon: '🔔' },
    { label: 'Open Tasks', value: 'openTasks', icon: '📊' },
    { label: 'Compliance', value: 'compliance', icon: '✓' },
  ];

  const isNumericField = (field: string) => {
    return field === 'triggeredTasks' || field === 'openTasks';
  };

  const handleAddFilter = () => {
    setFilters([...filters, { field: '', operator: 'is', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    
    if (field === 'field') {
      newFilters[index].operator = isNumericField(value) ? 'greaterThan' : 'is';
      newFilters[index].value = '';
    }
    
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters([{ field: '', operator: 'is', value: '' }]);
    setCondition('AND');
  };

  const handleApplyFilters = () => {
    const filterState: FilterState = {
      condition,
      filters: {}
    };
    
    filters.forEach(filter => {
      if (filter.field && filter.value) {
        filterState.filters[filter.field] = {
          operator: filter.operator,
          value: filter.value
        };
      }
    });
    
    onApplyFilters(filterState);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="filter-overlay open" onClick={onClose} />
      <div className="filter-panel open">
        <div className="filter-header">
          <h3>Filter by</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="filter-rows">
          {filters.map((filter, index) => (
            <div key={index} className="filter-row">
              <div className="filter-condition">
                {index === 0 ? (
                  'Where'
                ) : (
                  <>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as 'AND' | 'OR')}
                      className="condition-select"
                    >
                      <option value="AND">And</option>
                      <option value="OR">Or</option>
                    </select>
                  </>
                )}
              </div>
              
              <div className="filter-controls">
                <select
                  value={filter.field}
                  onChange={(e) => handleFilterChange(index, 'field', e.target.value)}
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
                  value={filter.operator}
                  onChange={(e) => handleFilterChange(index, 'operator', e.target.value)}
                  className="operator-select"
                >
                  {isNumericField(filter.field) ? (
                    <>
                      <option value="greaterThan">greater than</option>
                      <option value="lessThan">less than</option>
                      <option value="is">equals</option>
                    </>
                  ) : (
                    <>
                      <option value="is">equals</option>
                      <option value="contains">contains</option>
                    </>
                  )}
                </select>

                {isNumericField(filter.field) ? (
                  <input
                    type="number"
                    value={filter.value as string}
                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                    className="value-input"
                    min="0"
                  />
                ) : (
                  <AutocompleteInput
                    value={filter.value as string}
                    onChange={(value) => handleFilterChange(index, 'value', value)}
                    suggestions={getUniqueValues(filter.field)}
                    placeholder="Type a value"
                    className="value-input"
                  />
                )}

                <button
                  className="remove-filter"
                  onClick={() => handleRemoveFilter(index)}
                  title="Remove filter"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="filter-actions">
          <button className="add-filter" onClick={handleAddFilter}>
            + Add filter
          </button>
          <button className="add-filter" onClick={handleClearFilters}>
            Clear all
          </button>
          <button className="apply-filters" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel; 