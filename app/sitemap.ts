import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://crazywick.com',
      lastModified: new Date(),
    },
    {
      url: 'https://crazywick.com/articles',
      lastModified: new Date(),
    },
    {
      url: 'https://crazywick.com/predictions',
      lastModified: new Date(),
    },
    {
      url: 'https://crazywick.com/geopolitics',
      lastModified: new Date(),
    },
  ]
}