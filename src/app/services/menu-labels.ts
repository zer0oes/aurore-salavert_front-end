export interface MenuItem {
  title: string;
  slug: string;
}

export interface MenuSection extends MenuItem {
  labelField: string;
}

export function applyMenuLabels(sections: MenuSection[], response: any, locale: string): MenuItem[] {
  const labels = response?.data?.attributes || response?.data || {};
  const label = (field: string, fallback: string): string =>
    typeof labels[field] === 'string' && labels[field].trim() ? labels[field] : fallback;

  return [
    { title: label('HomeLabel', locale === 'fr' ? 'Accueil' : 'Home'), slug: 'home' },
    ...sections.map(({ title, slug, labelField }) => ({ title: label(labelField, title), slug }))
  ];
}
