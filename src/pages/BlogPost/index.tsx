import { useLocation } from 'react-router'
import { Inline } from '@/components/blog/Inline'
import { PostCard } from '@/components/blog/PostCard'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { formatDate, postByPath, POSTS, readingMinutes, type Block } from '@/content/blog'
import { normalizePath } from '@/data/pages'
import NotFound from '@/pages/NotFound'

const prose = 'max-w-[68ch] text-[1.06rem] leading-[1.75] text-foreground/85'

function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((b, i) => {
    switch (b.type) {
      case 'p':
        return (
          <p key={i} className={prose}>
            <Inline text={b.text} />
          </p>
        )
      case 'h2':
        return (
          <h2 key={i} id={b.id} className="t-2 mt-8 scroll-mt-28 max-w-[28ch] md:mt-12">
            {b.text}
          </h2>
        )
      case 'h3':
        return (
          <h3 key={i} className="t-3 mt-4 max-w-[40ch]">
            {b.text}
          </h3>
        )
      case 'ul':
      case 'ol': {
        const List = b.type
        return (
          <List key={i} className={`${prose} flex flex-col gap-2.5 pl-6 ${b.type === 'ul' ? 'list-disc' : 'list-decimal'} marker:text-foreground/50`}>
            {b.items.map((it) => (
              <li key={it} className="pl-1">
                <Inline text={it} />
              </li>
            ))}
          </List>
        )
      }
      case 'callout':
        return (
          <aside key={i} className="theme-sand max-w-[68ch] rounded-3xl border border-border bg-background p-6 md:p-7">
            <p className="t-3">{b.title}</p>
            <p className="mt-2 text-[1.02rem] leading-relaxed text-muted-foreground">
              <Inline text={b.text} />
            </p>
          </aside>
        )
    }
  })
}

/** /blog/{slug} — one article. Rendering is plain HTML (prerendered), so the whole article is crawlable without JavaScript. */
export default function BlogPost() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)
  const post = postByPath(path)
  if (!post) return <NotFound />

  const toc = post.blocks.flatMap((b) => (b.type === 'h2' ? [b] : []))
  const related = (post.related ?? []).flatMap((s) => POSTS.filter((p) => p.slug === s && p.status === 'published'))

  return (
    <>
      <article>
        <header data-hero="light" className="bg-background">
          <div className="container-x flex flex-col gap-5 pt-6 pb-8 md:pt-8 md:pb-10">
            <Breadcrumbs path={path} />
            <Eyebrow>{post.category}</Eyebrow>
            <h1 className="t-1 max-w-[24ch] text-[clamp(2rem,1.2rem+3.2vw,3.7rem)]">{post.h1}</h1>
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>By {post.author.name}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {post.modifiedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated <time dateTime={post.modifiedAt}>{formatDate(post.modifiedAt)}</time>
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{readingMinutes(post)} min read</span>
            </p>
          </div>
          <div className="container-x">
            <img
              src={post.image.src}
              width={post.image.width}
              height={post.image.height}
              alt={post.image.alt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[1200/630] w-full rounded-3xl border border-border object-cover"
            />
          </div>
        </header>

        <div className="container-x grid gap-10 py-10 md:py-14 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <nav aria-label="In this article" className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-3">
              <p className="eyebrow">In this article</p>
              <ol className="flex flex-col gap-2 border-l border-border pl-4 text-[0.92rem] leading-snug text-muted-foreground">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="transition-colors hover:text-foreground">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="flex flex-col gap-5">
            <Blocks blocks={post.blocks} />
            {post.sources && (
              <section aria-labelledby="sources-title" className="mt-8 max-w-[68ch] border-t border-border pt-6">
                <h2 id="sources-title" className="t-3">
                  Sources
                </h2>
                <ol className="mt-3 flex list-decimal flex-col gap-2 pl-6 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {post.sources.map((src) => (
                    <li key={src.url}>
                      <a href={src.url} rel="noopener" className="underline underline-offset-[0.2em] hover:text-foreground">
                        {src.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-sm border-t border-border" aria-labelledby="related-title">
          <div className="container-x flex flex-col gap-6">
            <h2 id="related-title" className="t-2">
              Related articles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ConversionCard
        title={
          <>
            See virtual try on with <span className="accent-serif">your</span> garments.
          </>
        }
        body="Book a demo and we will walk through the experience with pieces like yours: online, in store or at an event."
        secondary={{ to: '/blog', label: 'More articles' }}
      />
    </>
  )
}
