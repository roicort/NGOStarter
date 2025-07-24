import type { Media, User } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
}

export const news1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'open-access-summit',
    _status: 'published',
    authors: [author],
    isEvent: true,
    eventDate: new Date('2025-05-15T10:00:00Z'),
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
                text: 'Open Access Summit 2025: Bridging Knowledge Gaps',
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
                text: 'The Open Access Summit 2025 brought together educators, policymakers, and innovators to discuss strategies for making knowledge universally accessible. Highlights included workshops on digital libraries, open-source tools, and collaborative learning initiatives.',
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
              blockName: 'Event Highlights',
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
                text: 'This event underscored the importance of removing barriers to education and fostering a culture of sharing and collaboration. Participants left inspired to implement open access solutions in their communities.',
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
        'The Open Access Summit 2025 highlighted strategies for universal knowledge access and collaboration.',
      image: heroImage.id,
      title: 'Open Access Summit 2025: Bridging Knowledge Gaps',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'Open Access Summit 2025: Bridging Knowledge Gaps',
  }
}
