import { Donor, BloodRequest, SurgeryBloodPlan, BloodInventoryItem, ScreeningResult } from '../types';
import { INITIAL_DONORS, INITIAL_REQUESTS, INITIAL_SURGERY_PLANS, INITIAL_INVENTORY } from '../data/mockData';

const KEYS = {
  DONORS: 'bloodlink_donors_v1',
  REQUESTS: 'bloodlink_requests_v1',
  SURGERY_PLANS: 'bloodlink_surgery_plans_v1',
  INVENTORY: 'bloodlink_inventory_v1',
  SCREENINGS: 'bloodlink_screenings_v1',
  CURRENT_USER_DONOR_ID: 'bloodlink_current_donor_id_v1',
  NOTIFICATIONS: 'bloodlink_notifications_v1',
  CONSENT_RECORDS: 'bloodlink_consent_records_v1'
};

export const StorageService = {
  getDonors(): Donor[] {
    try {
      const data = localStorage.getItem(KEYS.DONORS);
      return data ? JSON.parse(data) : INITIAL_DONORS;
    } catch {
      return INITIAL_DONORS;
    }
  },

  saveDonors(donors: Donor[]) {
    localStorage.setItem(KEYS.DONORS, JSON.stringify(donors));
  },

  getRequests(): BloodRequest[] {
    try {
      const data = localStorage.getItem(KEYS.REQUESTS);
      return data ? JSON.parse(data) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  },

  saveRequests(requests: BloodRequest[]) {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
  },

  addRequest(request: Omit<BloodRequest, 'id' | 'createdAt' | 'matchedDonorsCount' | 'respondedDonorsCount'>): BloodRequest {
    const current = this.getRequests();
    const newReq: BloodRequest = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      matchedDonorsCount: Math.floor(Math.random() * 8) + 4,
      respondedDonorsCount: 0
    };
    const updated = [newReq, ...current];
    this.saveRequests(updated);
    return newReq;
  },

  getSurgeryPlans(): SurgeryBloodPlan[] {
    try {
      const data = localStorage.getItem(KEYS.SURGERY_PLANS);
      return data ? JSON.parse(data) : INITIAL_SURGERY_PLANS;
    } catch {
      return INITIAL_SURGERY_PLANS;
    }
  },

  saveSurgeryPlans(plans: SurgeryBloodPlan[]) {
    localStorage.setItem(KEYS.SURGERY_PLANS, JSON.stringify(plans));
  },

  advanceSurgeryMilestone(planId: string): SurgeryBloodPlan | null {
    const plans = this.getSurgeryPlans();
    const target = plans.find(p => p.id === planId);
    if (!target) return null;

    if (target.currentMilestone < 5) {
      target.milestones[target.currentMilestone - 1].status = 'completed';
      target.milestones[target.currentMilestone - 1].completedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      
      target.currentMilestone = (target.currentMilestone + 1) as 1 | 2 | 3 | 4 | 5;
      target.milestones[target.currentMilestone - 1].status = 'in_progress';
      
      if (target.currentMilestone === 5) {
        target.crossmatchStatus = 'Crossmatched & Compatible';
      }
      this.saveSurgeryPlans(plans);
    }
    return target;
  },

  getInventory(): BloodInventoryItem[] {
    try {
      const data = localStorage.getItem(KEYS.INVENTORY);
      return data ? JSON.parse(data) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  },

  saveInventory(inventory: BloodInventoryItem[]) {
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(inventory));
  },

  updateInventoryUnit(id: string, delta: number) {
    const inv = this.getInventory();
    const item = inv.find(i => i.id === id);
    if (item) {
      item.unitsAvailable = Math.max(0, item.unitsAvailable + delta);
      item.lastUpdated = 'Just now';
      if (item.unitsAvailable <= item.criticalThreshold) {
        item.status = 'Critical Shortage';
      } else {
        item.status = 'Adequate';
      }
      this.saveInventory(inv);
    }
    return inv;
  },

  getScreeningResults(): ScreeningResult[] {
    try {
      const data = localStorage.getItem(KEYS.SCREENINGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveScreeningResult(result: ScreeningResult) {
    const list = this.getScreeningResults();
    const updated = [result, ...list];
    localStorage.setItem(KEYS.SCREENINGS, JSON.stringify(updated));
  },

  respondToRequest(requestId: string, donorName: string): boolean {
    const reqs = this.getRequests();
    const req = reqs.find(r => r.id === requestId);
    if (req) {
      req.respondedDonorsCount += 1;
      req.unitsFulfilled = Math.min(req.unitsNeeded, req.unitsFulfilled + 1);
      if (req.unitsFulfilled >= req.unitsNeeded) {
        req.status = 'Fulfilled';
      } else {
        req.status = 'Donors Responded';
      }
      this.saveRequests(reqs);
      return true;
    }
    return false;
  },

  resetToDefault() {
    localStorage.removeItem(KEYS.DONORS);
    localStorage.removeItem(KEYS.REQUESTS);
    localStorage.removeItem(KEYS.SURGERY_PLANS);
    localStorage.removeItem(KEYS.INVENTORY);
    localStorage.removeItem(KEYS.SCREENINGS);
  }
};
