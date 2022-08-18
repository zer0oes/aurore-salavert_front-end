export interface Project {
  id: number;
	slug: string;
	title: string;
	description: string;
	createdAt: string;
  thumbnail: string;
  categories: Array<Category>;
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
