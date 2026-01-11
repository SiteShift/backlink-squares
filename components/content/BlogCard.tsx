import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { ContentMeta } from '@/lib/content'
import { formatDate } from '@/lib/utils'

interface BlogCardProps {
  post: ContentMeta
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-white border-3 border-dark hover:-translate-y-1 transition-all"
        style={{ boxShadow: '6px 6px 0px 0px #0A0A0A' }}
      >
        <div className="p-8 lg:p-10">
          {/* Keywords */}
          {post.keywords && post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.keywords.slice(0, 2).map((keyword) => (
                <span
                  key={keyword}
                  className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-bauhaus-red/10 text-bauhaus-red"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}

          <h2 className="font-display font-black text-xl lg:text-2xl text-dark mb-3 group-hover:text-bauhaus-red transition-colors leading-tight">
            {post.title}
          </h2>

          <p className="text-dark/60 mb-6 line-clamp-2">
            {post.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-dark/50">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-bauhaus-red group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-white border-3 border-dark p-5 hover:shadow-bauhaus hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center gap-3 text-xs text-dark/50 mb-3">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(post.date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {post.readingTime}
        </span>
      </div>

      <h3 className="font-display font-bold text-base text-dark mb-2 group-hover:text-bauhaus-red transition-colors line-clamp-2 leading-snug">
        {post.title}
      </h3>

      <p className="text-sm text-dark/60 line-clamp-2">{post.description}</p>
    </Link>
  )
}
