export type RoomStatus = 'live' | 'pending' | 'locked';

export interface Room {
    id: string; // Same as invitationId for simplicity
    status: RoomStatus;
    joinedAt: string;
    lastActivity: string;
    isWon?: boolean;
    cancellationPenaltyApplied?: boolean;
}

export interface RoomStore {
    rooms: Record<string, Room>;
    syncRoom: (invitationId: string) => void;
    updateRoomStatus: (id: string, status: RoomStatus) => void;
    closeRoom: (id: string, isWon: boolean) => void;
    cancelParticipation: (id: string) => void;
    getRoom: (id: string) => Room | undefined;
}
