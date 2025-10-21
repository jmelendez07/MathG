import { Directions } from '@/enums/hero-directions';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getPolygonCentroid(points: [number, number][]) {
    const n = points.length;
    let x = 0, y = 0;
    for (let i = 0; i < n; i++) {
        x += points[i][0];
        y += points[i][1];
    }
    return { x: x / n, y: y / n };
}

export function isPointInPolygon(x: number, y: number, polygon: [number, number][]) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / ((yj - yi) || 1) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function getRow(direction: Directions): number {
    switch (direction) {
        case Directions.DOWN:
            return 10;
        case Directions.LEFT:
            return 9;
        case Directions.RIGHT:
            return 11;
        case Directions.UP:
            return 8;
        default:
            return 10;
    }
}

export const HERO_FRAME_SIZE = 64;
export const HERO_MOVING_SPEED = 0.2;
export const HERO_MOVING_SPEED_RUNNING = 0.45;
export const MAP_SCALE = 1;
export const ALLOWED_KEYS = ["KeyW", "KeyA", "KeyS", "KeyD", "Space"];