import React, { useState } from 'react';
import { Sensor, Building } from '../../types';
import { campusService } from '../../services/campusService';
import { 
  Cpu, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Radio, 
  RefreshCw,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface SensorManagementViewProps {
  sensors: Sensor[];
  buildings: Building[];
}

export const SensorManagementView: React.FC<SensorManagementViewProps> = ({
  sensors,
  buildings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buildingFilter, setBuildingFilter] = useState('all');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);

  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<Sensor['type']>('Energy');
  const [formBuildingId, setFormBuildingId] = useState(buildings[0]?.id || 'b-cs');
  const [formLocation, setFormLocation] = useState('Floor 2, Zone B');
  const [formProtocol, setFormProtocol] = useState<Sensor['protocol']>('BACnet/IP');
  const [formValue, setFormValue] = useState('18.4');
  const [formUnit, setFormUnit] = useState('kWh');
  const [formStatus, setFormStatus] = useState<Sensor['status']>('online');

  const filteredSensors = sensors.filter((s) => {
    if (typeFilter !== 'all' && s.type !== typeFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (buildingFilter !== 'all' && s.buildingId !== buildingFilter) return false;

    const q = searchQuery.toLowerCase();
    return (
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.buildingName.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  });

  const handleOpenAddModal = () => {
    setEditingSensor(null);
    setFormName('Academic Quad · Micro-Meter');
    setFormType('Energy');
    setFormBuildingId(buildings[0]?.id || 'b-cs');
    setFormLocation('Floor 1, Electrical Riser A');
    setFormProtocol('BACnet/IP');
    setFormValue('14.2');
    setFormUnit('kWh');
    setFormStatus('online');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sensor: Sensor) => {
    setEditingSensor(sensor);
    setFormName(sensor.name);
    setFormType(sensor.type);
    setFormBuildingId(sensor.buildingId);
    setFormLocation(sensor.location);
    setFormProtocol(sensor.protocol);
    setFormValue(String(sensor.value));
    setFormUnit(sensor.unit);
    setFormStatus(sensor.status);
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBuilding = buildings.find(b => b.id === formBuildingId);

    if (editingSensor) {
      campusService.updateSensor(editingSensor.id, {
        name: formName,
        type: formType,
        buildingId: formBuildingId,
        buildingName: targetBuilding?.name || editingSensor.buildingName,
        location: formLocation,
        protocol: formProtocol,
        value: parseFloat(formValue) || 0,
        unit: formUnit,
        status: formStatus,
      });
    } else {
      campusService.addSensor({
        name: formName,
        type: formType,
        buildingId: formBuildingId,
        buildingName: targetBuilding?.name || 'Campus Facility',
        location: formLocation,
        protocol: formProtocol,
        value: parseFloat(formValue) || 0,
        unit: formUnit,
        status: formStatus,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to decommission IoT sensor ${id}?`)) {
      campusService.deleteSensor(id);
    }
  };

  const onlineCount = sensors.filter(s => s.status === 'online').length;
  const warningCount = sensors.filter(s => s.status === 'warning').length;
  const offlineCount = sensors.filter(s => s.status === 'offline').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
            Sensor Mesh &amp; Device Registry
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-mono font-semibold">
              {sensors.length} Active Nodes
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Provision, calibrate, reconfigure, and monitor edge devices across physical campus subnets.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Sensor</span>
        </button>
      </div>

      {/* Sensor Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B]">Online &amp; Streaming</span>
            <div className="text-2xl font-bold font-mono text-[#16A34A] mt-0.5">{onlineCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 text-[#16A34A]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B]">Threshold Warning</span>
            <div className="text-2xl font-bold font-mono text-[#F59E0B] mt-0.5">{warningCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#64748B]">Offline / Standby</span>
            <div className="text-2xl font-bold font-mono text-[#64748B] mt-0.5">{offlineCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-slate-100 text-[#64748B]">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, facility, zone..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20"
            />
          </div>

          {/* Select Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="all">All Sensor Types</option>
              <option value="Energy">Energy</option>
              <option value="Water">Water</option>
              <option value="Temperature">Temperature</option>
              <option value="Humidity">Humidity</option>
              <option value="AQI">AQI</option>
              <option value="Noise">Noise</option>
              <option value="Occupancy">Occupancy</option>
              <option value="Parking">Parking</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="warning">Warning</option>
              <option value="offline">Offline</option>
            </select>

            {/* Building */}
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="all">All Facilities</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>{b.shortName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#E2E8F0]">
          <span>Showing {filteredSensors.length} of {sensors.length} registered IoT devices</span>
          <span className="font-mono text-[#2563EB]">BACnet/IP Gateway Synchronized</span>
        </div>
      </div>

      {/* Sensor Registry Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider text-[11px] border-b border-[#E2E8F0]">
            <tr>
              <th className="p-3">Sensor ID</th>
              <th className="p-3">Device Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Location</th>
              <th className="p-3 text-right">Current Value</th>
              <th className="p-3">Status</th>
              <th className="p-3">Protocol</th>
              <th className="p-3 text-right">Last Ping</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] font-mono">
            {filteredSensors.slice(0, 20).map((sensor) => (
              <tr key={sensor.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="p-3 text-[#2563EB] font-bold">{sensor.id}</td>
                <td className="p-3 text-[#1E293B] font-sans font-medium">{sensor.name}</td>
                <td className="p-3 text-[#1E293B] font-sans">{sensor.type}</td>
                <td className="p-3 text-[#64748B] font-sans">
                  <div>{sensor.buildingName}</div>
                  <div className="text-[10px] text-[#94A3B8]">{sensor.location}</div>
                </td>
                <td className="p-3 text-right text-[#1E293B] font-bold tabular-nums">
                  {sensor.value} <span className="text-[10px] font-normal text-[#64748B]">{sensor.unit}</span>
                </td>
                <td className="p-3 font-sans">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                    sensor.status === 'warning' ? 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                    : sensor.status === 'offline' ? 'bg-slate-100 text-[#64748B] border border-slate-200'
                    : 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      sensor.status === 'warning' ? 'bg-[#F59E0B]' : sensor.status === 'offline' ? 'bg-slate-400' : 'bg-[#16A34A]'
                    }`} />
                    {sensor.status}
                  </span>
                </td>
                <td className="p-3 text-[#64748B]">{sensor.protocol}</td>
                <td className="p-3 text-right text-[#94A3B8] text-[11px]">{sensor.lastPing}</td>
                <td className="p-3 font-sans text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(sensor)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit Sensor Configuration"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sensor.id)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                      title="Decommission Sensor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Sensor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-base font-bold text-[#1E293B]">
                  {editingSensor ? `Edit Sensor ${editingSensor.id}` : 'Register New IoT Sensor'}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Configure protocol parameters, physical gateway mapping, and telemetry units.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[#1E293B] font-semibold block mb-1">Device Label</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1E293B] font-semibold block mb-1">Telemetry Dimension</label>
                  <select
                    value={formType}
                    onChange={(e: any) => setFormType(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Energy">Energy</option>
                    <option value="Water">Water</option>
                    <option value="Temperature">Temperature</option>
                    <option value="Humidity">Humidity</option>
                    <option value="AQI">AQI</option>
                    <option value="Noise">Noise</option>
                    <option value="Occupancy">Occupancy</option>
                    <option value="Parking">Parking</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#1E293B] font-semibold block mb-1">Physical Facility</label>
                  <select
                    value={formBuildingId}
                    onChange={(e) => setFormBuildingId(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                  >
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1E293B] font-semibold block mb-1">Subnet Location</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="text-[#1E293B] font-semibold block mb-1">Ingress Protocol</label>
                  <select
                    value={formProtocol}
                    onChange={(e: any) => setFormProtocol(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="BACnet/IP">BACnet/IP</option>
                    <option value="LoRaWAN">LoRaWAN</option>
                    <option value="MQTT">MQTT</option>
                    <option value="Modbus">Modbus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#1E293B] font-semibold block mb-1">Current Value</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:border-[#2563EB] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#1E293B] font-semibold block mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:border-[#2563EB] font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#1E293B] font-semibold block mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e: any) => setFormStatus(e.target.value)}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="online">Online</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#1E293B] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white font-semibold transition-all shadow-sm cursor-pointer"
                >
                  {editingSensor ? 'Save Changes' : 'Register Sensor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
