'use client';

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useCategories } from '@/features/category/services/categoryApi';
import { useProvinces, useCitiesByProvince } from '@/features/location/services/locationApi';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/utils';

/**
 * ActivityFilters Component
 * 
 * Why:
 * - Allows users to narrow down results
 * - Cascading province -> city selection
 * - Debounced search for performance
 * - Mobile-friendly collapsible panel
 */

interface FilterValues {
    search: string;
    categoryId: string;
    province: string;
    city: string;
}

interface ActivityFiltersProps {
    onFilterChange: (filters: FilterValues) => void;
}

export const ActivityFilters = ({ onFilterChange }: ActivityFiltersProps) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterValues>({
        search: '',
        categoryId: '',
        province: '',
        city: '',
    });

    const { data: categories } = useCategories();
    const { data: provinces } = useProvinces();
    const { data: cities } = useCitiesByProvince(filters.province || null);

    // Notify parent when filters change
    useEffect(() => {
        const timeout = setTimeout(() => {
            onFilterChange(filters);
        }, 400); // Debounce 400ms
        return () => clearTimeout(timeout);
    }, [filters, onFilterChange]);

    const handleChange = (key: keyof FilterValues, value: string) => {
        setFilters(prev => {
            const next = { ...prev, [key]: value };
            // Reset city when province changes
            if (key === 'province') next.city = '';
            return next;
        });
    };

    const clearFilters = () => {
        setFilters({ search: '', categoryId: '', province: '', city: '' });
    };

    const hasActiveFilters =
        filters.search || filters.categoryId || filters.province || filters.city;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            {/* Search Row */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <Input
                        value={filters.search}
                        onChange={e => handleChange('search', e.target.value)}
                        placeholder="Cari aktivitas olahraga..."
                        leftIcon={<Search className="w-5 h-5" />}
                    />
                </div>
                <Button
                    variant="outline"
                    size="md"
                    onClick={() => setShowFilters(!showFilters)}
                    leftIcon={<SlidersHorizontal className="w-5 h-5" />}
                    className={cn(showFilters && 'border-blue-500 text-blue-600')}
                >
                    <span className="hidden sm:inline">Filter</span>
                    {hasActiveFilters && (
                        <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            !
                        </span>
                    )}
                </Button>
                {hasActiveFilters && (
                    <Button variant="ghost" size="md" onClick={clearFilters} leftIcon={<X className="w-4 h-4" />}>
                        <span className="hidden sm:inline">Reset</span>
                    </Button>
                )}
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Kategori
                        </label>
                        <select
                            value={filters.categoryId}
                            onChange={e => handleChange('categoryId', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Semua Kategori</option>
                            {categories?.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Province */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Provinsi
                        </label>
                        <select
                            value={filters.province}
                            onChange={e => handleChange('province', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Semua Provinsi</option>
                            {provinces?.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* City - only shown when province selected */}
                    {filters.province && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Kota
                            </label>
                            <select
                                value={filters.city}
                                onChange={e => handleChange('city', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Semua Kota</option>
                                {cities?.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};