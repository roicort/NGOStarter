import type { Media } from '@/payload-types'

export const classroom: Omit<Media, 'createdAt' | 'id' | 'updatedAt'> = {
  alt: 'Library',
  caption: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Photo by ',
              version: 1,
            },
            {
              type: 'link',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'MChe Lee',
                  version: 1,
                },
              ],
              direction: 'ltr',
              fields: {
                linkType: 'custom',
                newTab: true,
                url: 'https://unsplash.com/@mclee',
              },
              format: '',
              indent: 0,
              version: 2,
            },
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' on Unsplash.',
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
}
