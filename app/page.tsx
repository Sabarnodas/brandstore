"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/dummy-data"
import { categories as dummyCategories } from "@/lib/dummy-data" // Renamed to avoid conflict
import { useStore } from "@/contexts/store-context"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCarousel } from "@/components/product-carousel"

export default function HomePage() {
  const { products, categories } = useStore()
  const featuredProducts = products.filter((p) => p.stock > 0).slice(0, 4) // Show 4 products for better grid
  const bestSellers = products.filter((p) => p.stock > 0).slice(4, 9)

  return (
    <div className="min-h-screen">

      {/* Hero Section with Carousel */}
      <section className="pt-8 pb-12 px-4 md:px-6">
        <HeroCarousel />
      </section>

      {/* Curated Collections / Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary">Curated Collections</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
              Explore our diverse range of premium products designed for the corporate environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              // Professional Gradients
              const gradients = [
                "from-slate-50 to-white border-slate-200",
                "from-gray-50 to-white border-gray-200",
                "from-zinc-50 to-white border-zinc-200",
                "from-stone-50 to-white border-stone-200",
                "from-neutral-50 to-white border-neutral-200",
                "from-slate-50 to-gray-50 border-slate-200"
              ]
              const currentStyle = gradients[index % gradients.length]

              return (
                <Link key={category.id} href={`/categories?category=${category.name}`} className="group cursor-pointer">
                  <div className={`relative h-80 overflow-hidden rounded-xl mb-4 border shadow-sm hover:shadow-xl transition-all duration-500 bg-gradient-to-br ${currentStyle}`}>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/0 group-hover:bg-white/50 transition-colors duration-500">
                      <div className="p-5 bg-white rounded-full shadow-lg mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 ring-1 ring-black/5">
                        <ShoppingBag className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 group-hover:text-primary transition-colors tracking-tight">{category.name}</h3>
                      <p className="text-sm text-slate-500 mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 font-medium tracking-wide uppercase">
                        Browse Collection <ArrowRight className="inline-block w-4 h-4 ml-1" />
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
            {categories.length === 0 && (
              <div className="col-span-3 text-center text-muted-foreground py-12">Loading collections...</div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products - Now using Swiper/Carousel */}
      <section className="bg-slate-50/50">
        <ProductCarousel products={featuredProducts} title="Featured Arrivals" />
      </section>

      {/* Best Sellers Section - Another Carousel */}
      <section>
        <ProductCarousel products={featuredProducts.slice().reverse()} title="Best Sellers" />
      </section>

      {/* Trust/Business Features Banner - Full Width */}
      <section className="w-full bg-primary text-primary-foreground py-24 relative overflow-hidden mt-12">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-6 group hover:translate-y-[-5px] transition-transform duration-300">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner ring-1 ring-white/20 group-hover:bg-white/20 transition-colors">
                <ShieldCheckIcon className="w-10 h-10 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Premium Quality</h3>
                <p className="text-primary-foreground/70 mt-3 text-lg font-light leading-relaxed">Certified authentic materials and superior craftsmanship guaranteed.</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start space-y-6 group hover:translate-y-[-5px] transition-transform duration-300">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner ring-1 ring-white/20 group-hover:bg-white/20 transition-colors">
                <TruckIcon className="w-10 h-10 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Fast Delivery</h3>
                <p className="text-primary-foreground/70 mt-3 text-lg font-light leading-relaxed">Priority shipping logistics for all corporate and bulk orders.</p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start space-y-6 group hover:translate-y-[-5px] transition-transform duration-300">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner ring-1 ring-white/20 group-hover:bg-white/20 transition-colors">
                <HeadphonesIcon className="w-10 h-10 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Dedicated Support</h3>
                <p className="text-primary-foreground/70 mt-3 text-lg font-light leading-relaxed">24/7 concierge service for your custom branding needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  )
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function TruckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function HeadphonesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
      <path d="M15 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2Z" />
      <path d="M4 14v-3a8 8 0 1 1 16 0v3" />
    </svg>
  )
}
