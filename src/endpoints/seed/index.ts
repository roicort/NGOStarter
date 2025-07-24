import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { locker } from './img/lockers-img'
import { classroom } from './img/classroom-img'
import { library } from './img/library-img'
import { school } from './img/school-img'
import { auditory } from './img/auditory-img'
import { post1 } from './posts/post-1'
import { post2 } from './posts/post-2'
import { post3 } from './posts/post-3'
import { about } from './about'
import { projects } from './projects'
import { news1 } from './news/news-1'
import { news2 } from './news/news-2'
import { news3 } from './news/news-3'
import { project1 } from './projects/project-1'
import { project2 } from './projects/project-2'
import { project3 } from './projects/project-3'

import fs from 'fs'
import path from 'path'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'news',
  'projects',
  'forms',
  'form-submissions',
  'search',
]
const globals: GlobalSlug[] = ['header', 'footer']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'admin@ngo.org',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  async function fetchFileFromDirectory(filePath: string): Promise<File> {
    const absolutePath = path.resolve(process.cwd(), filePath)
    const fileBuffer = fs.readFileSync(absolutePath)
    const fileStats = fs.statSync(absolutePath)

    return {
      name: path.basename(filePath),
      data: fileBuffer,
      mimetype: `image/${path.extname(filePath).slice(1)}`,
      size: fileStats.size,
    }
  }

  const [lockerBuffer, classroomBuffer, libraryBuffer, schoolBuffer, auditoryBuffer] =
    await Promise.all([
      fetchFileFromDirectory('./src/endpoints/seed/img/lockers.png'),
      fetchFileFromDirectory('./src/endpoints/seed/img/classroom.png'),
      fetchFileFromDirectory('./src/endpoints/seed/img/library.png'),
      fetchFileFromDirectory('./src/endpoints/seed/img/school.png'),
      fetchFileFromDirectory('./src/endpoints/seed/img/auditory.png'),
    ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, image4Doc, image5Doc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Admin NGO',
        email: 'admin@ngo.org',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: classroom,
      file: classroomBuffer,
    }),
    payload.create({
      collection: 'media',
      data: library,
      file: libraryBuffer,
    }),
    payload.create({
      collection: 'media',
      data: auditory,
      file: auditoryBuffer,
    }),
    payload.create({
      collection: 'media',
      data: school,
      file: schoolBuffer,
    }),
    payload.create({
      collection: 'media',
      data: locker,
      file: lockerBuffer,
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Technology',
        breadcrumbs: [
          {
            label: 'Technology',
            url: '/technology',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Finance',
        breadcrumbs: [
          {
            label: 'Finance',
            url: '/finance',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Design',
        breadcrumbs: [
          {
            label: 'Design',
            url: '/design',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Software',
        breadcrumbs: [
          {
            label: 'Software',
            url: '/software',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Engineering',
        breadcrumbs: [
          {
            label: 'Engineering',
            url: '/engineering',
          },
        ],
      },
    }),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding news...`)

  const news1Doc = await payload.create({
    collection: 'news',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: news1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const news2Doc = await payload.create({
    collection: 'news',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: news2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const news3Doc = await payload.create({
    collection: 'news',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: news3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  payload.logger.info(`— Seeding projects...`)

  const project1Doc = await payload.create({
    collection: 'projects',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: project1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const project2Doc = await payload.create({
    collection: 'projects',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: project2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const project3Doc = await payload.create({
    collection: 'projects',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: project3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage, aboutPage, projectsPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: image2Doc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: about({ heroImage: image4Doc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: projects({ heroImage: image4Doc, metaImage: image2Doc }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'reference',
              label: 'Who We Are',
              reference: {
                relationTo: 'pages',
                value: aboutPage.id,
              },
            },
          },
          {
            link: {
              type: 'custom',
              label: 'What We Do',
              url: '/projects',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'News',
              url: '/news',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Source Code',
              newTab: true,
              url: 'https://github.com/nonzero-sum/NGOStarter',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Payload',
              newTab: true,
              url: 'https://payloadcms.com/',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
