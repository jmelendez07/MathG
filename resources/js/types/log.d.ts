import { User } from ".";

export default interface Log {
    id: string;
    user_id: string;
    action: string;
    route: string;
    ip_address: string | null;
    user_agent: string | null;
    status_code: number | null;
    execution_time: number | null;
    metadata: Metadata;
    created_at: string;
    updated_at: string;
    user?: User;
}

interface Metadata {
    name: string;
    email: string;
    role: string;
    date: string;
    referer: string;
    url: string;
}