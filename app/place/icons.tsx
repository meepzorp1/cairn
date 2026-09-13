import type { ReactNode } from "react";
export { renderPlaceIcon as getPlaceIcon };
import {
  Bed,
  Beer,
  Coffee,
  FerrisWheel,
  GraduationCap,
  Landmark,
  Library,
  MapPin,
  Mountain,
  Music,
  Palette,
  ShoppingBag,
  Trees,
  Umbrella,
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
    case "coffee_shop":
    case "bakery":
      return <Coffee className={className} />;

    case "park":
      return <Trees className={className} />;

    case "hiking_area":
      return <Mountain className={className} />;

    case "beach":
      return <Umbrella className={className} />;

    case "museum":
      return <Landmark className={className} />;

    case "art_gallery":
      return <Palette className={className} />;

    case "library":
      return <Library className={className} />;

    case "university":
      return <GraduationCap className={className} />;

    case "shopping_mall":
    case "store":
      return <ShoppingBag className={className} />;

    case "bar":
    case "night_club":
      return <Beer className={className} />;

    case "live_music":
    case "event_venue":
    case "performing_arts_theater":
    case "concert_hall":
      return <Music className={className} />;

    case "tourist_attraction":
    case "amusement_park":
    case "historical_landmark":
      return <FerrisWheel className={className} />;

    case "lodging":
    case "hotel":
      return <Bed className={className} />;

    default:
      return <MapPin className={className} />;
  }
}