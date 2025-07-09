import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  language: string
}

export function HeroSection({ language }: HeroSectionProps) {
  return (
    <section className="relative h-[340px] sm:h-[420px] md:h-[480px] lg:h-[520px] flex items-center justify-center overflow-hidden">
      <Image
        src="/covers/cover-home.jpg"
        alt="Homepage Cover"
        fill
        priority
        className="object-cover w-full h-full z-0"
        style={{ objectPosition: 'center 80%' }}
        sizes="100vw"
      />
      {/* Reliable grey overlay for readability */}
      <div className="absolute inset-0 z-10" style={{ background: 'rgba(17, 24, 39, 0.7)' }} />
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 drop-shadow-lg text-white">
          Problem Creator
        </h1>
        <p className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed drop-shadow text-white">
          {language === 'vi'
            ? 'Một kẻ học cách giải quyết vấn đề, bằng cách dám nhìn vào những gì mình đã tạo ra.'
            : 'A person learning to solve problems by daring to look at what they have created.'}
        </p>
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow"
          >
            {language === 'vi' ? 'Khám phá bài viết' : 'Explore Articles'}
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
} 