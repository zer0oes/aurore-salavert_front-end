const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const axios = require('axios');

const BASE_URL = 'https://www.aurore-salavert.fr';
const API_URL = 'https://strapi.aurore-salavert.fr/api/projects?populate=*';

async function generateSitemap() {
  try {
    const response = await axios.get(API_URL);
    const projects = response.data.data;

    const writeStream = createWriteStream('./dist/aurore-salavert_front-end/sitemap.xml');
    const sitemap = new SitemapStream({ hostname: BASE_URL });

    sitemap.pipe(writeStream);

    sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    sitemap.write({ url: '/privacy-policy', changefreq: 'monthly', priority: 0.8 });

    projects.forEach((project) => {
      sitemap.write({
        url: `/project/${project.attributes.slug}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: project.attributes.updatedAt
      });
    });

    sitemap.end();

    await streamToPromise(sitemap);
    console.log('Sitemap généré avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap', error);
  }
}

generateSitemap();
