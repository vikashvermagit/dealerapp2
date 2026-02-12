export type StockMode = 'in_stock' | 'incoming' | 'advance_order';

export interface StockDeclaration {
    id: string;
    invitationId: string;
    mode: StockMode;
    vin?: string;
    eta?: string;
    vinDeadline?: string; // Mandatory for incoming
    buyerConsentRequired: boolean;
    declaredAt: string;
    status: 'pending' | 'verified' | 'breached';
    verifiedAt?: string;
}

export interface StockStore {
    declarations: Record<string, StockDeclaration>; // Key: invitationId
    declareStock: (invitationId: string, data: Partial<StockDeclaration>) => void;
    verifyVin: (invitationId: string, vin: string) => boolean;
    getDeclarationByInvitation: (invitationId: string) => StockDeclaration | undefined;
    hasStockDeclared: (invitationId: string) => boolean;
    checkDeadlines: () => void;
}
