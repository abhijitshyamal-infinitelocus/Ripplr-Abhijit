import {
  ArrowRight, BadgeCheck, BarChart3, Box, Briefcase, Calendar, ChartLine, Clock, FileText, Gauge, GraduationCap,
  Heart, IndianRupee, Mail, MapPin, Phone, Plane, Route, Send, ShieldCheck, Sparkles, Store, Truck, Warehouse,
  type LucideProps,
} from "lucide-react";
import { LinkedInIcon } from "./LinkedInIcon";

const map: Record<string, React.ComponentType<LucideProps>> = {
  "arrow-right": ArrowRight,
  "badge-check": BadgeCheck,
  "bar-chart": BarChart3,
  box: Box,
  briefcase: Briefcase,
  calendar: Calendar,
  chart: ChartLine,
  clock: Clock,
  doc: FileText,
  gauge: Gauge,
  "graduation-cap": GraduationCap,
  heart: Heart,
  linkedin: LinkedInIcon as React.ComponentType<LucideProps>,
  mail: Mail,
  "map-pin": MapPin,
  phone: Phone,
  plane: Plane,
  road: Route,
  rupee: IndianRupee,
  send: Send,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  store: Store,
  truck: Truck,
  warehouse: Warehouse,
};

/** Maps content icon names to lucide icons. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = map[name] ?? Box;
  return <C {...props} />;
}
