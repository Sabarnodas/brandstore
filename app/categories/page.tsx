"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/dummy-data"
import { useStore } from "@/contexts/store-context"
import { ShoppingCart } from "lucide-react"

export default function CategoriesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryFromUrl = searchParams.get("category")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl)
  const { products, addToCart, user } = useStore()
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

  const availableProducts = products.filter((p) => p.stock > 0)
  const filteredProducts = selectedCategory
    ? availableProducts.filter((p) => p.category === selectedCategory)
    : availableProducts

  const handleAddToCart = (product: (typeof products)[0]) => {
    // Only allow direct add to cart for products without sizes
    if (product.sizes && product.sizes.length > 0) {
      // Redirect to product page for size selection
      router.push(`/products/${product.id}`)
      return
    }
    addToCart(product)
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Browse Products</h1>
      <p className="mb-6 text-muted-foreground">Discover our wide selection of quality products</p>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => setSelectedCategory(null)}>
          All Products
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 rounded-lg group">
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-[3/4] overflow-hidden bg-white p-6 group-hover:bg-gray-50 transition-colors">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                />

                {/* Overlay on hover for quick click */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            <CardContent className="p-5">
              <div className="mb-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{product.category}</div>
              <Link href={`/products/${product.id}`}>
                <h3 className="mb-2 cursor-pointer font-bold text-lg hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
              </Link>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2 font-light leading-relaxed">{product.description}</p>

              <div className="flex items-center justify-between mb-4 pt-2 border-t border-dashed border-border">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground line-through opacity-60">₹{(product.price * 1.2).toFixed(2)}</span>
                  <span className="text-xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
                </div>
                {user?.role === "admin" && (
                  <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </span>
                )}
              </div>

              <Button
                className={`w-full font-semibold shadow-md ${addedToCart === product.id ? 'bg-green-600 hover:bg-green-700' : ''}`}
                onClick={() => handleAddToCart(product)}
                disabled={addedToCart === product.id || product.stock === 0}
              >
                {addedToCart === product.id ? (
                  <>Added to Cart</>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock === 0 ? "Out of Stock" : product.sizes && product.sizes.length > 0 ? "Select Size" : "Add to Cart"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
