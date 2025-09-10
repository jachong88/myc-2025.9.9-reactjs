/**
 * MYC Select Components
 *
 * Standardized Select wrappers following MYC design system.
 * Includes cascading Country/Province functionality with backend API integration.
 */

import { Select as AntSelect } from 'antd';
import type { SelectProps as AntSelectProps } from 'antd';
import { useState, useEffect } from 'react';

/**
 * Standard Select component with consistent defaults
 */
export function Select(props: AntSelectProps) {
  return <AntSelect {...props} />;
}

/**
 * Country/Province option interfaces for backend data
 */
export interface CountryOption {
  value: string;
  label: string;
}

export interface ProvinceOption {
  value: string;
  label: string;
  countryCode: string;
}

/**
 * API service functions (to be implemented with actual backend endpoints)
 */
export const locationAPI = {
  /**
   * Fetch countries from backend API
   * Replace with actual API endpoint
   */
  async fetchCountries(): Promise<CountryOption[]> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/countries');
    // return response.json();
    
    throw new Error('locationAPI.fetchCountries() must be implemented with actual backend endpoint');
  },

  /**
   * Fetch provinces by country from backend API
   * Replace with actual API endpoint
   */
  async fetchProvinces(countryCode: string): Promise<ProvinceOption[]> {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/provinces?country=${countryCode}`);
    // return response.json();
    
    throw new Error('locationAPI.fetchProvinces() must be implemented with actual backend endpoint');
  }
};

/**
 * Country Select component with backend API integration
 */
export function CountrySelect({
  onChange,
  ...props
}: AntSelectProps & {
  onChange?: (value: string) => void;
}) {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      setError(null);
      try {
        const countryData = await locationAPI.fetchCountries();
        setCountries(countryData);
      } catch (err) {
        setError('Failed to load countries');
        console.error('Error loading countries:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  return (
    <Select
      placeholder="Select Country"
      options={countries}
      onChange={onChange}
      loading={loading}
      status={error ? 'error' : undefined}
      {...props}
    />
  );
}

/**
 * Province Select component with backend API integration
 * Automatically loads provinces when country changes
 */
export function ProvinceSelect({
  country,
  onChange,
  ...props
}: AntSelectProps & {
  country?: string;
  onChange?: (value: string) => void;
}) {
  const [provinces, setProvinces] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProvinces = async () => {
      if (!country) {
        setProvinces([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const provinceData = await locationAPI.fetchProvinces(country);
        const formattedProvinces = provinceData.map(province => ({
          value: province.value,
          label: province.label
        }));
        setProvinces(formattedProvinces);
      } catch (err) {
        setError('Failed to load provinces');
        console.error('Error loading provinces:', err);
        setProvinces([]);
      } finally {
        setLoading(false);
      }
    };

    loadProvinces();
  }, [country]);

  return (
    <Select
      placeholder={country ? "Select Province/State" : "Select Country first"}
      disabled={!country}
      options={provinces}
      onChange={onChange}
      loading={loading}
      status={error ? 'error' : undefined}
      {...props}
    />
  );
}

/**
 * Cascading Country/Province Select Pair
 * Manages the relationship between country and province selects
 * Automatically loads data from backend APIs
 */
export function CascadingCountryProvinceSelect({
  onCountryChange,
  onProvinceChange,
  countryValue,
  provinceValue,
  ...props
}: {
  onCountryChange?: (country: string) => void;
  onProvinceChange?: (province: string) => void;
  countryValue?: string;
  provinceValue?: string;
} & Omit<AntSelectProps, 'onChange' | 'value' | 'loading'>) {
  
  const handleCountryChange = (country: string) => {
    onCountryChange?.(country);
    // Clear province when country changes
    onProvinceChange?.('');
  };

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <CountrySelect
          value={countryValue}
          onChange={handleCountryChange}
          {...props}
        />
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <ProvinceSelect
          country={countryValue}
          value={provinceValue}
          onChange={onProvinceChange}
          {...props}
        />
      </div>
    </div>
  );
}

/**
 * Role Select component for user roles
 * Based on design system specifications
 */
export function RoleSelect(props: AntSelectProps) {
  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' },
    { value: 'staff', label: 'Staff' },
  ];

  return (
    <Select
      placeholder="Select Role"
      options={roleOptions}
      {...props}
    />
  );
}

export default Select;
