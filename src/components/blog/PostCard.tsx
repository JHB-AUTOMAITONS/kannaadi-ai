import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { formatDate, postPath, readingMinutes, type BlogPost } from '@/content/blog'
import { cn } from '@/lib/utils'

/** Article card for the /blog listing. `featured` is the wide, image-led variant used for the newest article. */
export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article
      data-reveal=""
      className={cn(
        'group relative flex overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-foreground/40',
        featured ? 'flex-col md:grid md:grid-cols-[1.1fr_1fr]' : 'flex-col',
      )}
    >
      <img
        src={featured ? post.image.src : post.image.card.src}
        width={featured ? post.image.width : post.image.card.width}
        height={featured ? post.image.height : Math.round((post.image.card.width * post.image.height) / post.image.width)}
        alt={post.image.alt}
        loading={featured ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('w-full object-cover', featured ? 'aspect-[1200/630] md:h-full md:aspect-auto' : 'aspect-[1200/630]')}
      />
      <div className={cn('flex flex-1 flex-col gap-3 p-6', featured && 'md:justify-center md:p-10')}>
        <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{post.category}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes(post)} min read</span>
        </p>
        <h2 className={featured ? 't-2' : 't-3'}>
          <Link to={postPath(post.slug)} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4">
            {post.h1}
          </Link>
        </h2>
        <p className="max-w-[60ch] text-[1rem] leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.95rem] font-medium">
          Read the article <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  )
}
