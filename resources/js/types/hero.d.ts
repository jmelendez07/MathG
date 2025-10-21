import { Texture } from "pixi.js";
import { HeroAnimation } from "./HeroAnimations";

export default interface Hero {
    id: string;
    name: string;
    spritesheet: string;
    health: number;
    current_health: number;
    avatar_url: string;
    hero_animations: HeroAnimation[];
    hero_role: HeroRole;
    created_at: string;
    updated_at: string;
    texture?: Texture;
}

export interface HeroRole {
    id: string;
    name: string;
    description: string;
    icon_url: string;
}