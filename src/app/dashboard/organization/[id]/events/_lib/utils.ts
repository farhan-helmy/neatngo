import { SelectEvent } from "@/db/schema";
import { Activity, ActivityIcon, Circle, Dices, DicesIcon, HandCoins, HandCoinsIcon, Presentation, PresentationIcon, WorkflowIcon } from "lucide-react";

export function getEventTypeIcon(status: SelectEvent["eventType"]) {
    const eventTypeIcon = {
        WORKSHOP: WorkflowIcon,
        FUNDRAISER: HandCoinsIcon,
        VOLUNTEERING: ActivityIcon,
        MEETING: PresentationIcon,
        OTHER: DicesIcon
    }

    return eventTypeIcon[status] || Circle
}

export function formatEventType(text: string) {
    return text.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());
}