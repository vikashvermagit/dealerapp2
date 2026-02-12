import { create } from 'zustand';
import type { RoomStore, Room } from './types';
import { useAdminStore } from '../admin/store';

export const useRoomStore = create<RoomStore>((set, get) => ({
    rooms: {},

    syncRoom: (invitationId: string) => {
        const { rooms } = get();
        if (rooms[invitationId]) return;

        const newRoom: Room = {
            id: invitationId,
            status: 'live',
            joinedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };

        set(state => ({
            rooms: { ...state.rooms, [invitationId]: newRoom }
        }));
    },

    updateRoomStatus: (id, status) => {
        set(state => {
            const room = state.rooms[id];
            if (!room) return state;

            return {
                rooms: {
                    ...state.rooms,
                    [id]: { ...room, status, lastActivity: new Date().toISOString() }
                }
            };
        });
    },

    closeRoom: (id, isWon) => {
        set(state => {
            const room = state.rooms[id];
            if (!room) return state;

            return {
                rooms: {
                    ...state.rooms,
                    [id]: {
                        ...room,
                        status: 'locked',
                        isWon,
                        lastActivity: new Date().toISOString()
                    }
                }
            };
        });
    },

    cancelParticipation: (id) => {
        const room = get().rooms[id];
        if (!room) return;

        // Log Penalty to Audit Trail
        const adminStore = useAdminStore.getState();
        adminStore.auditLogs = [
            {
                id: `audit-${Date.now()}`,
                action: 'settings_changed',
                performedBy: 'John Dealer (Owner)',
                ipAddress: '192.168.1.1',
                timestamp: new Date().toISOString(),
                metadata: {
                    eventId: 'ROOM_ABANDONED',
                    roomId: id,
                    penalty: 'Credit Forfeited',
                    message: 'Dealer canceled participation after room entry.'
                }
            },
            ...adminStore.auditLogs
        ];

        // Clean up room state
        set(state => {
            const newRooms = { ...state.rooms };
            delete newRooms[id];
            return { rooms: newRooms };
        });

        // We don't refund credits in useInvitationStore
        // But we should notify the invitation store if we have a way to revert 'joined' status
        // For this demo, abandonment just removes it from the 'Active Rooms' list.
    },

    getRoom: (id) => get().rooms[id]
}));
