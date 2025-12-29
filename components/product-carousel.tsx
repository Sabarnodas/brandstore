"use client"

import * as React from "react"
import Link from "next/link"
import { Product } from "@/lib/dummy-data"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ShoppingBag, Star, Eye } from "lucide-react"

interface ProductCarouselProps {
    products: Product[]
    title: string
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
    return (
        <div className="w-full py-16 bg-muted/20">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">{title}</h2>
                        <p className="text-muted-foreground mt-2 text-lg font-light">Curated selection for the discerning professional.</p>
                    </div>
                    <div className="hidden md:flex space-x-2">
                        {/* Navigation controlled by Carousel */}
                    </div>
                </div>

                <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                    <CarouselContent className="-ml-6 pb-4">
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="pl-6 md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                                <Link href={`/products/${product.id}`} className="group h-full block">
                                    <Card className="h-full overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 rounded-lg">
                                        {/* Image Container */}
                                        <div className="relative aspect-[3/4] overflow-hidden bg-white p-6 group-hover:bg-gray-50 transition-colors">
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 mixed-blend-multiply"
                                            />

                                            {/* Minimal Badges */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold rounded-sm">
                                                    New
                                                </Badge>
                                                {product.stock < 10 && (
                                                    <Badge variant="destructive" className="shadow-sm text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold rounded-sm">
                                                        Low Stock
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Hover Actions */}
                                            <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                <Button size="icon" className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <CardContent className="p-5 flex-grow">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    {product.category}
                                                </span>
                                                <div className="flex items-center text-accent text-xs font-medium">
                                                    <Star className="w-3 h-3 fill-current mr-1" />
                                                    4.8
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>

                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2 mb-4 font-light leading-relaxed">
                                                {product.description}
                                            </p>
                                        </CardContent>

                                        {/* Footer */}
                                        <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-border/40 bg-zinc-50/50">
                                            <div className="flex flex-col pt-3">
                                                <span className="text-xs text-muted-foreground line-through opacity-60">₹{product.price * 1.2}</span>
                                                <span className="text-xl font-bold text-primary">₹{product.price}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary hover:text-primary-foreground hover:bg-primary font-medium transition-colors"
                                            >
                                                Add <ShoppingBag className="w-4 h-4 ml-1" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="w-full flex justify-end gap-3 mt-8 pr-4">
                        <CarouselPrevious className="static translate-y-0 translate-x-0 bg-white border-border hover:bg-primary hover:text-white transition-colors shadow-sm h-10 w-10" />
                        <CarouselNext className="static translate-y-0 translate-x-0 bg-white border-border hover:bg-primary hover:text-white transition-colors shadow-sm h-10 w-10" />
                    </div>
                </Carousel>
            </div>
        </div>
    )
}
