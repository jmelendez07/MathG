import { Stage } from "@/types/planet";
import ConfigUI from "./config";
import { HeroSelectionUI } from "./hero-selection";
import { MissionsUI } from "./misions";
import { ProfileUI } from "./profile";
import { StageUI } from "./stage";
import { StatsUI } from "./stats";

interface UIProps {
    stage: Stage;
}

export const UI = ({ stage }: UIProps) => {
    return (
        <>
            <ProfileUI />
            <ConfigUI />
            <MissionsUI stage={stage} />
            <StageUI stage={stage} />
            <HeroSelectionUI />
            <StatsUI />
        </>
    );
}