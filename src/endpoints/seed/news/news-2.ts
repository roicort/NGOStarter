import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './news-1'

export const news2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'annual-report',
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Annual Education Report (AER) 2025',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Our Annual Education Report (AER) 2025 highlights the transformative impact of free educational resources and open access on individuals and communities.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Success Stories',
              blockType: 'mediaBlock',
              media: blockImage.id,
            },
            format: '',
            version: 2,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'These stories inspire us to continue our mission of breaking barriers and ensuring that education is a right, not a privilege. Together, we can create a world where everyone has the tools to succeed.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description:
        'Our Annual Education Report (AER) 2025 highlights the transformative impact of free educational resources and open access on individuals and communities.',
      image: heroImage.id,
      title: 'Annual Education Report (AER) 2025',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Annual Education Report (AER) 2025',
  }
}
