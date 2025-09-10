/**
 * Select Component Usage Examples
 * Demonstrates Select, CountrySelect, ProvinceSelect, and CascadingCountryProvinceSelect
 */

import { useState } from 'react';
import { Space, Divider, Card, Alert } from 'antd';
import { Select, CountrySelect, ProvinceSelect, CascadingCountryProvinceSelect, RoleSelect } from './Select';

export function SelectExamples() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <Alert
        message="Backend Integration Required"
        description="The locationAPI.fetchCountries() and locationAPI.fetchProvinces() functions must be implemented with actual backend endpoints before these components will work."
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Divider orientation="left">Basic Select</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Select
          placeholder="Basic select"
          style={{ width: 200 }}
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
      </Space>

      <Divider orientation="left">Role Select</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <RoleSelect style={{ width: 200 }} />
      </Space>

      <Divider orientation="left">Individual Country/Province Selects</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <CountrySelect
            style={{ width: 200 }}
            value={selectedCountry}
            onChange={setSelectedCountry}
          />
          <ProvinceSelect
            style={{ width: 200 }}
            country={selectedCountry}
            value={selectedProvince}
            onChange={setSelectedProvince}
          />
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>
          Selected: Country = "{selectedCountry}", Province = "{selectedProvince}"
        </div>
      </Space>

      <Divider orientation="left">Cascading Country/Province Select</Divider>
      <CascadingCountryProvinceSelect
        countryValue={selectedCountry}
        provinceValue={selectedProvince}
        onCountryChange={setSelectedCountry}
        onProvinceChange={setSelectedProvince}
      />

      <Divider orientation="left">API Implementation Guide</Divider>
      <Card title="Backend Integration" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14 }}>
          <p><strong>To use these components, implement the following API endpoints:</strong></p>
          <div style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            <div>GET /api/countries</div>
            <div style={{ color: '#666', fontSize: 12, marginLeft: 16 }}>
              Returns: CountryOption[] = [{'{'} value: "SG", label: "Singapore" {'}'}]
            </div>
            <div style={{ marginTop: 8 }}>GET /api/provinces?country=SG</div>
            <div style={{ color: '#666', fontSize: 12, marginLeft: 16 }}>
              Returns: ProvinceOption[] = [{'{'} value: "SG-CENTRAL", label: "Central Region", countryCode: "SG" {'}'}]
            </div>
          </div>
          
          <p style={{ marginTop: 16 }}><strong>Then update the locationAPI in Select.tsx:</strong></p>
          <div style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
            <div>async fetchCountries(): Promise&lt;CountryOption[]&gt; {'{'}</div>
            <div style={{ marginLeft: 16 }}>const response = await fetch('/api/countries');</div>
            <div style={{ marginLeft: 16 }}>return response.json();</div>
            <div>{'}'}</div>
          </div>
        </div>
      </Card>

      <Divider orientation="left">Expected Countries</Divider>
      <div style={{ fontSize: 14 }}>
        <p>The backend should support these Southeast Asian countries:</p>
        <ul>
          <li><strong>Singapore</strong> - Regions: Central, East, North, Northeast, West</li>
          <li><strong>Malaysia</strong> - States: Johor, Kedah, Kelantan, KL, Melaka, etc.</li>
          <li><strong>Vietnam</strong> - Cities/Provinces: Hanoi, Ho Chi Minh City, Da Nang, etc.</li>
        </ul>
      </div>
    </div>
  );
}

export default SelectExamples;
