'use client';

import React, { useState, useMemo } from 'react';
import { Search, Code2, Database, Wrench, Palette, Megaphone, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Field {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const FIELDS: Field[] = [
  {
    id: 'IT',
    name: 'IT',
    category: 'IT',
    icon: <Code2 className="w-6 h-6" />,
    description: 'Build web applications, software, and digital products with code.',
  },
  {
    id: 'Management',
    name: 'Management',
    category: 'Management',
    icon: <Database className="w-6 h-6" />,
    description: 'Transform information into insights and detailed analytics.',
  },
  {
    id: 'product',
    name: 'Products',
    category: 'product',
    icon: <Wrench className="w-6 h-6" />,
    description: 'Lead strategy, roadmaps, and implementation.',
  },
  {
    id: 'design',
    name: 'Design',
    category: 'design',
    icon: <Palette className="w-6 h-6" />,
    description: 'Design user interfaces and integrated visual experiences.',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    category: 'marketing',
    icon: <Megaphone className="w-6 h-6" />,
    description: 'Tell stories and drive audience growth.',
  },
  {
    id: 'sales',
    name: 'Sales',
    category: 'sales',
    icon: <TrendingUp className="w-6 h-6" />,
    description: 'Build relationships and unlock new opportunities.',
  },
];

interface FieldSelectorProps {
  selectedFields?: string[];
  onFieldsChange?: (fields: string[]) => void;
}

export function FieldSelector({ selectedFields: propSelectedFields, onFieldsChange }: FieldSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>(propSelectedFields || []);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Update parent when fields change
  const handleToggleField = (fieldId: string) => {
    const newFields = selectedFields.includes(fieldId)
      ? selectedFields.filter((id) => id !== fieldId)
      : [...selectedFields, fieldId];
    setSelectedFields(newFields);
    onFieldsChange?.(newFields);
  };

  const filteredFields = useMemo(() => {
    return FIELDS.filter((field) => {
      const matchesSearch = field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? field.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleCategory = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const categories = [...new Set(FIELDS.map(field => field.category))];

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block font-medium mb-3 text-sm text-primary-text">
          Enter Your Area Of Expertise
        </label>
        
        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Sales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-primary-text
                focus:ring-2 focus:ring-vivid-red/20 focus:border-vivid-red
                hover:border-vivid-red/60 transition-all duration-200"
            />
          </div>
        </div>

        {/* Selected Count */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-vivid-red rounded-full text-xs font-bold">
            {selectedFields.length}
          </span>
          <span className="text-sm font-medium text-primary-text">
            Field(s) Selected
          </span>
        </div>

        {/* Category Chips */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                    isActive
                      ? 'border-vivid-red bg-red-50 text-vivid-red'
                      : 'border-gray-300 bg-white text-primary-text hover:border-vivid-red/40 hover:bg-red-50/50'
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fields Grid wrapped in ScrollArea */}
      <ScrollArea className="h-[280px] rounded-lg border border-gray-200 p-1">
        <div className="space-y-3 pr-4">
          {filteredFields.map((field) => {
            const isSelected = selectedFields.includes(field.id);
            return (
              <button
                key={field.id}
                type="button"
                onClick={() => handleToggleField(field.id)}
                className={cn(
                  'relative w-full p-4 rounded-lg border text-left transition-all duration-200 group',
                  'hover:border-vivid-red/60 hover:shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-vivid-red/20 focus:border-vivid-red',
                  isSelected
                    ? 'border-vivid-red bg-red-50 ring-2 ring-vivid-red/20'
                    : 'border-gray-300 bg-white'
                )}
              >
                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-vivid-red flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    isSelected ? 'bg-red-100 text-vivid-red' : 'bg-gray-100 text-gray-600'
                  )}>
                    {field.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={cn(
                      'font-medium mb-1',
                      isSelected ? 'text-vivid-red' : 'text-primary-text'
                    )}>
                      {field.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {field.description}
                    </p>
                  </div>
                </div>

                {/* Hover Text */}
                <div className={cn(
                  'mt-2 text-xs font-medium text-vivid-red opacity-0 group-hover:opacity-100 transition-opacity',
                  isSelected && 'opacity-100'
                )}>
                  {isSelected ? 'Selected' : 'Click to select'}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* No Results - outside ScrollArea */}
      {filteredFields.length === 0 && (
        <div className="text-center py-4 border border-gray-200 rounded-lg">
          <p className="text-gray-500 text-sm">No results matching your search</p>
        </div>
      )}
    </div>
  );
}