import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './news-1'

export const news3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'rendezvous-bergen-2025',
    _status: 'published',
    authors: [author],
    isEvent: true,
    eventDate: new Date('2025-10-15T10:00:00Z'),
    rsvp: {
      link: {
        type: 'custom',
        newTab: true,
        url: 'https://hi.events',
        label: 'RSVP',
      },
    },
    eventLocation: null,
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
                text: 'Rendezvous: Bergen 2025',
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
                text: 'Join us in Bergen, Norway for the 2025 Rendezvous, where we will explore the theme of digital inclusion and its impact on global communities.',
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
              blockName: 'Program Highlights',
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
                text: 'Our Digital Inclusion Program provides technology, internet access, and training to underserved communities. By equipping individuals with digital skills, we empower them to participate fully in today’s connected world.',
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
        'The Digital Inclusion Program equips underserved communities with technology and skills for a connected world.',
      image: heroImage.id,
      title: 'Rendezvous: Bergen 2025',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Rendezvous: Bergen 2025',
  }
}
