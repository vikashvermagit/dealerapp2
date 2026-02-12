import { create } from 'zustand';
import type { StockStore, StockDeclaration, StockMode } from './types';
import { useAdminStore } from '../admin/store';

export const useStockStore = create<StockStore>((set, get) => ({
    declarations: {
        'inv-1': {
            id: 'stock-1',
            invitationId: 'inv-1',
            mode: 'in_stock',
            vin: '1G6AF5S3XLU123456',
            buyerConsentRequired: false,
            declaredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            status: 'verified',
            verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
        },
        'inv-2': {
            id: 'stock-2',
            invitationId: 'inv-2',
            mode: 'incoming',
            eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
            vinDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
            buyerConsentRequired: false,
            declaredAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            status: 'pending',
        },
        'inv-3': {
            id: 'stock-3',
            invitationId: 'inv-3',
            mode: 'incoming',
            eta: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
            vinDeadline: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago (Breached!)
            buyerConsentRequired: false,
            declaredAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            status: 'pending', // Will be picked up by checkDeadlines
        }
    },

    declareStock: (invitationId, data) => {
        const id = crypto.randomUUID();
        const declaredAt = new Date().toISOString();

        const newDeclaration: StockDeclaration = {
            id,
            invitationId,
            mode: data.mode as StockMode,
            vin: data.vin,
            eta: data.eta,
            vinDeadline: data.vinDeadline,
            buyerConsentRequired: data.mode === 'advance_order',
            declaredAt,
            status: 'pending',
        };

        // Basic verification logic for demo
        if (data.mode === 'in_stock' && data.vin) {
            newDeclaration.status = 'verified';
            newDeclaration.verifiedAt = new Date().toISOString();
        }

        set(state => ({
            declarations: {
                ...state.declarations,
                [invitationId]: newDeclaration
            }
        }));

        // Log to Audit Trail
        const adminStore = useAdminStore.getState();
        adminStore.auditLogs = [
            {
                id: `audit-${Date.now()}`,
                action: 'settings_changed',
                performedBy: 'John Dealer (Owner)',
                ipAddress: '192.168.1.1',
                timestamp: new Date().toISOString(),
                metadata: { invitationId, stockMode: data.mode, vin: data.vin }
            },
            ...adminStore.auditLogs
        ];
    },

    verifyVin: (invitationId, vin) => {
        const declaration = get().declarations[invitationId];
        if (!declaration) return false;

        // Simulated VIN verification (simple length check for demo)
        const isValid = vin.length === 17;

        if (isValid) {
            set(state => ({
                declarations: {
                    ...state.declarations,
                    [invitationId]: {
                        ...declaration,
                        vin,
                        status: 'verified',
                        verifiedAt: new Date().toISOString()
                    }
                }
            }));
        }

        return isValid;
    },

    getDeclarationByInvitation: (invitationId) => {
        return get().declarations[invitationId];
    },

    hasStockDeclared: (invitationId) => {
        return !!get().declarations[invitationId];
    },

    checkDeadlines: () => {
        const { declarations } = get();
        const now = new Date();
        let changed = false;

        const updatedDeclarations = { ...declarations };

        Object.values(updatedDeclarations).forEach(d => {
            if (d.mode === 'incoming' && d.status === 'pending' && d.vinDeadline) {
                if (new Date(d.vinDeadline) < now) {
                    updatedDeclarations[d.invitationId] = { ...d, status: 'breached' };
                    changed = true;
                }
            }
        });

        if (changed) {
            set({ declarations: updatedDeclarations });
        }
    }
}));
