import { SafeHtml } from "@angular/platform-browser";

export interface Project {
  id: number;
	slug: string;
	title: string;
	description: string;
	createdAt: string;
  thumbnail: string;
  categories: Array<Category>;
  layout: Array<Layout>;
  gallery: Array<Gallery>;
}

export interface Category {
  title: string;
  slug: string;
}

export interface Gallery {
  id: number;
  img: string;
  alt: string;
}

export interface Competence {
  slug: string;
	title: string;
}

export interface Skill {
  id: number;
	title: string;
	text: string;
	createdAt: string;
  icon: string;
}

export interface Layout {
  slug: string;
  title: string;
}

export interface SliderItems {
  imgSrc: string;
  imgAlt: string;
}

export interface CreativeShowcase {
  slug: string;
  title: string;
  descritpion: string;
}

export interface CustomService {
  slug: string;
  title: string;
  text: string;
  gallery: Array<Gallery>;
}

export interface Contact {
  slug: string;
  title: string;
  email: string;
}

export interface Service {
  title: string;
  text: string | SafeHtml;
}