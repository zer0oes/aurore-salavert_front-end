export interface Project {
  id: number;
	slug: string;
	title: string;
	description: string;
	createdAt: string;
  thumbnail: string;
  categories: Array<Category>;
}

export interface Category {
  title: string;
  slug: string;
}
