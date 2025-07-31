'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { NewsPost } from '@/payload-types'

import { Media } from '@/components/Media'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export type NewsCardPostData = Pick<
  NewsPost,
  'slug' | 'categories' | 'meta' | 'title' | 'eventDate' | 'eventLocation'
>

export const NewsCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: NewsCardPostData
  relationTo?: string
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <Card
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <CardHeader className="relative w-full">
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </CardHeader>
      <CardContent className="p-4">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            <div>
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category
                  const categoryTitle = titleFromCategory || 'Untitled category'
                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }
                return null
              })}
            </div>
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
            {(doc?.eventDate || doc?.eventLocation) && (
              <div className="text-xs text-muted-foreground mt-1">
                {doc?.eventDate && <span>{new Date(doc.eventDate).toLocaleDateString()}</span>}
                {doc?.eventDate && doc?.eventLocation && <span> &middot; </span>}
                {doc?.eventLocation && <span>{doc.eventLocation}</span>}
              </div>
            )}
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </CardContent>
    </Card>
  )
}
