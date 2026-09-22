import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { FilterStatus } from '../types/assignment';

interface FilterTabsContextType {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
}

const FilterTabsContext = createContext<FilterTabsContextType | null>(null);

function useFilterTabsContext(): FilterTabsContextType {
  const context = useContext(FilterTabsContext);
  if (!context) {
    throw new Error('FilterTabs.* phải được dùng bên trong <FilterTabs>');
  }
  return context;
}

interface FilterTabsProps {
  value: FilterStatus;
  onChange: (value: FilterStatus) => void;
  children: ReactNode;
}

function FilterTabs({ value, onChange, children }: FilterTabsProps) {
  const contextValue = useMemo<FilterTabsContextType>(
    () => ({ value, onChange }),
    [value, onChange],
  );

  return (
    <FilterTabsContext.Provider value={contextValue}>
      <div className="filter-tabs">{children}</div>
    </FilterTabsContext.Provider>
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <div className="filter-tabs__list" role="tablist">
      {children}
    </div>
  );
}

interface TabProps {
  value: FilterStatus;
  count?: number;
  children: ReactNode;
}

function Tab({ value, count, children }: TabProps) {
  const { value: activeValue, onChange } = useFilterTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={isActive ? 'filter-tab filter-tab--active' : 'filter-tab'}
      onClick={() => onChange(value)}
    >
      {children}
      {typeof count === 'number' && <span className="filter-tab__count">{count}</span>}
    </button>
  );
}

FilterTabs.List = List;
FilterTabs.Tab = Tab;

export default FilterTabs;
