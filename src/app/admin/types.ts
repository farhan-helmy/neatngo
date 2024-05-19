export interface UserData {
    id: string;
    email: string | null;
    name: string | null;
    phone: string | null;
    nameOfDisorder: string | null;
    isPaid: boolean | null;
    membershipStart: string | null;
    membershipExpiry: string | null;
}