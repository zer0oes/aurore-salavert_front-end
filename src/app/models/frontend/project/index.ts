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
