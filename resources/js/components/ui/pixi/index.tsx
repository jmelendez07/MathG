import { Stage } from "@/types/planet";
import ConfigUI from "./config";
import { HeroSelectionUI } from "./hero-selection";
import { MissionsUI } from "./misions";
import { ProfileUI } from "./profile";
import { StageUI } from "./stage";
import { StatsUI } from "./stats";
import { Texture } from "pixi.js";

interface UIProps {
    stage: Stage;
    avatarFrameTexture: Texture;
    avatarProfileTexture: Texture;
    configTexture: Texture;
    missionsTexture: Texture;
    stageMapTexture: Texture;
}

export const UI = ({ 
    stage, 
    avatarFrameTexture, 
    avatarProfileTexture, 
    configTexture, 
    missionsTexture,
    stageMapTexture 
}: UIProps) => {
    return (
        <>
            <ProfileUI avatarFrameTexture={avatarFrameTexture} avatarProfileTexture={avatarProfileTexture} />
            <ConfigUI texture={configTexture} />
            <MissionsUI texture={missionsTexture} stage={stage} />
            <StageUI texture={stageMapTexture} stage={stage} />
            <StatsUI />
            <HeroSelectionUI />
        </>
    );
}