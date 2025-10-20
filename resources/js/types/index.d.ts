import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface Auth {
    user: UserWithProfile | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    updatedProfile?: UserProfile;
    flash?: {
        success?: string;
        error?: string;
    }
    [key: string]: unknown;
}

export interface User {
    id: string; // was number
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    roles: Role[];
    created_at: string;
    updated_at: string;
    logs?: Log[];
    [key: string]: unknown;
}

// Add a user-with-profile helper
export type UserWithProfile = User & { profile?: UserProfile | null };

export interface UserProfile {
    id: string; // was number
    user: User;
    level: Level;
    avatar_url: string;
    progress_bar: number;
    total_xp: number;
    avatar_frame_url: string;
}

export interface Level {
    id: string; // was number
    order: number;
    xp_required: number;
    next_level_xp: number | null;
}

export interface Role {
    id: string;
    name: string;
}

export interface IExercise {
    id: number;
    operation: string;
    steps?: ISteps[];
}

export interface ICard {
    id: number;
    name: string;
    stats: number;
    exercises: IExercise[];
}

export interface ISteps {
    id: number;
    description: string;
    order: number;
    options: IOptions[];
}

export interface IOptions {
    id: number;
    label: string;
    isCorrect: boolean;
}

export interface PageProps extends SharedData {}

declare module '@inertiajs/core' {
    interface PageProps extends SharedData {}
}