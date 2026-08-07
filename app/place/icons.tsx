import type { ReactNode } from "react";
export { renderPlaceIcon as getPlaceIcon };
import {
  Coffee,
  GraduationCap,
  Landmark,
  MapPin,
  Music,
  Trees,
  Utensils,
} from "lucide-react";

export function renderPlaceIcon(
  type: string | undefined,
  className = "h-5 w-5",
): ReactNode {
  switch (type) {
    case "restaurant":
      return <Utensils className={className} />;

    case "cafe":
      return <Coffee className={className} />;

    case "park":
      return <Trees className={className} />;

    case "museum":
      return <Landmark className={className} />;

    case "live_music":
      return <Music className={className} />;

    case "university":
      return <GraduationCap className={className} />;

    default:
      return <MapPin className={className} />;
  }
}