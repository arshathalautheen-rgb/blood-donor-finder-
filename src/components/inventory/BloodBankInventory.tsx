import React, { useState } from 'react';
import { BloodInventoryItem, BloodGroup, BloodComponent } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Minus, 
  RefreshCw, 
  CheckCircle2, 
  FileText,
  Thermometer,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BloodBankInventoryView: React.FC = () => {
  const [inventory, setInventory] = useState<BloodInventoryItem[]>(() => StorageService.getInventory());
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [orderModalItem, setOrderModalItem] = useState<BloodInventoryItem | null>(null);
  const [orderUnits, setOrderUnits] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleAdjustUnits = (id: string, delta: number) => {
    const updated = StorageService.updateInventoryUnit(id, delta);
    setInventory([...updated]);
  };

  const handleDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderModalItem) return;

    handleAdjustUnits(orderModalItem.id, -orderUnits);
    setOrderSuccess(true);
    confetti({ particleCount: 30, spread: 50 });

    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalItem(null);
      setOrderUnits(1);
    }, 1800);
  };

  const filtered = inventory.filter(item => {
    if (selectedComponent !== 'all' && item.component !== selectedComponent) return false;
    return true;
  });

  const totalUnits = inventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0);
  const criticalItems = inventory.filter(i => i.status === 'Critical Shortage').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-[#E11D48]">
              <Building2 className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Authorized Regional Blood Bank & Hospital Network
              </h2>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                AABB Accredited
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cold-chain inventory monitoring with component shelf-life and critical shortage alert thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Blood Units</span>
            <span className="text-xl font-black text-slate-900">{totalUnits} Units</span>
          </div>

          <div className={`p-3 rounded-2xl border text-right ${
            criticalItems > 0 ? 'bg-rose-50 border-rose-200 text-[#BE123C]' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <span className="text-[10px] font-bold uppercase block opacity-80">Shortage Watch</span>
            <span className="text-xl font-black">{criticalItems} Types Critical</span>
          </div>
        </div>
      </div>

      {/* Component Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          {['all', 'Red Blood Cells', 'Platelets', 'Fresh Frozen Plasma'].map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedComponent(comp)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedComponent === comp
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {comp === 'all' ? 'All Blood Products' : comp}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Synchronized with Central Immunohematology Lab</span>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => {
          const isCritical = item.status === 'Critical Shortage';
          const isExpiring = item.status === 'Expiring Soon';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                isCritical
                  ? 'border-rose-300 ring-2 ring-rose-400/20 bg-rose-50/20'
                  : isExpiring
                  ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header: Blood group + Status pill */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-[#BE123C] text-white flex items-center justify-center font-black text-xl shadow-xs">
                    {item.bloodGroup}
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-rose-100 text-[#BE123C]'
                        : isExpiring
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{item.component}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{item.facilityName}</p>
                </div>

                {/* Stock meter */}
                <div className="my-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Available:</span>
                    <span className="text-xl font-black text-slate-900">{item.unitsAvailable} Units</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full ${
                        isCritical ? 'bg-rose-500' : isExpiring ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (item.unitsAvailable / (item.criticalThreshold * 2)) * 100)}%`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>Critical Level: {item.criticalThreshold} units</span>
                    <span>Reserved: {item.reservedUnits}</span>
                  </div>
                </div>

                {/* Shelf-life & Cold Chain Indicator */}
                <div className="text-[11px] text-slate-600 space-y-1 py-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Oldest Unit Age:</span>
                    <strong className={isExpiring ? 'text-amber-700' : 'text-slate-700'}>
                      {item.oldestUnitDays} of {item.maxShelfLifeDays} days
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cold Chain Storage:</span>
                    <span className="font-semibold text-slate-700">
                      {item.component === 'Platelets' ? '20-24°C Agitated' : item.component === 'Fresh Frozen Plasma' ? '-18°C Frozen' : '1-6°C Chilled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100 mt-2">
                <button
                  onClick={() => handleAdjustUnits(item.id, -1)}
                  disabled={item.unitsAvailable <= 0}
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition"
                  title="Dispense 1 Unit"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleAdjustUnits(item.id, 1)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                  title="Add 1 Unit from incoming donation"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOrderModalItem(item)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-[#14213D] text-white text-xs font-bold hover:bg-slate-800 transition text-center"
                >
                  Hospital Requisition
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital Requisition Modal */}
      {orderModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            {orderSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-900">Hospital Requisition Authorized</h3>
                <p className="text-xs text-slate-500">
                  {orderUnits} unit(s) of {orderModalItem.bloodGroup} {orderModalItem.component} dispatched under cold chain logistics.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDispatchOrder} className="space-y-4 text-xs">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Hospital Blood Unit Requisition
                    </h3>
                    <p className="text-slate-500">
                      Direct cross-match dispatch for surgical or ICU use.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOrderModalItem(null)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#BE123C] text-white font-black text-lg flex items-center justify-center">
                    {orderModalItem.bloodGroup}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{orderModalItem.component}</span>
                    <span className="text-[11px] text-slate-500">
                      Currently available: {orderModalItem.unitsAvailable} units
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Units to Allocate
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={orderModalItem.unitsAvailable}
                    value={orderUnits}
                    onChange={(e) => setOrderUnits(Math.min(orderModalItem.unitsAvailable, Math.max(1, Number(e.target.value))))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-base focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Receiving Hospital Department
                  </label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none">
                    <option>Operating Room 4 — Cardiac Surgery</option>
                    <option>Emergency Trauma Resuscitation Bay</option>
                    <option>Neonatal Intensive Care Unit (NICU)</option>
                    <option>Pediatric Oncology Day Ward</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOrderModalItem(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E11D48] text-white font-bold hover:bg-[#BE123C] transition shadow-sm"
                  >
                    Confirm & Dispatch Units
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
