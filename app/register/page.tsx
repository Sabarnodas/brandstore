"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)


    const { register } = useStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.")
            return
        }

        try {
            const response: any = await register(name, email, password)
            setSuccess(true)
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.")
        }
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{success ? "Registration Successful" : "Create an Account"}</CardTitle>
                        <CardDescription>
                            {success
                                ? `We've sent a verification link to ${email}. Please check your inbox.`
                                : "Enter your details to create a new account"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {!success ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">
                                    Register
                                </Button>

                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/login" className="underline hover:text-primary">
                                        Login here
                                    </Link>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6 text-center">
                                <div className="flex justify-center">
                                    <div className="bg-primary/10 p-3 rounded-full">
                                        <AlertCircle className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Verification link sent!</p>
                                    <p className="text-sm text-muted-foreground">
                                        Please check your email and click the link to activate your account.
                                    </p>
                                </div>



                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/login">Back to Login</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
