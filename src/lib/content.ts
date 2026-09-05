import site from "../../content/site.json";
import home from "../../content/home.json";
import about from "../../content/about.json";
import distribution from "../../content/distribution.json";
import logistics from "../../content/logistics.json";
import culture from "../../content/culture.json";
import careers from "../../content/careers.json";
import esg from "../../content/esg.json";
import contact from "../../content/contact.json";

export { site, home, about, distribution, logistics, culture, careers, esg, contact };

export type Cta = { label: string; href: string };
export type Stat = { value: string; label: string };
export type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  displayWidth?: number;
  displayHeight?: number;
};
export type Art = {
  src: string;
  alt: string;
  video?: string;
  videoMp4?: string;
  width?: number;
  height?: number;
};
export type TextPart = { t: string; accent?: boolean; b?: boolean };
export type Region = { name: string; count: string; cities: string[] };
export type FormField = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  required?: boolean;
  half?: boolean;
  options?: string[];
  validate?: string;
};
