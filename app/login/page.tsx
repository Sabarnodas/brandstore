"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState("user")
  const [error, setError] = useState("")
  const { login, user } = useStore()
  const router = useRouter()
  const [googleLoading, setGoogleLoading] = useState(false)

  // Handle Google OAuth Callback
  useEffect(() => {
    // Check for token in URL
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (token) {
      setGoogleLoading(true)
      const fetchGoogleUser = async () => {
        try {
          // We need to fetch the user profile to construct the AuthToken object expected by the store
          // We can't use the 'api' instance directly easily if it relies on localStorage token which isn't set yet,
          // but typical axios instances might intercept. Let's assume we need to pass the header manually or set it first.
          // Actually, let's try setting it in localStorage temporarily to let api instance pick it up?
          // Or just use fetch/axios directly.

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (!response.ok) throw new Error("Failed to fetch user profile")

          const userData = await response.json()

          const newUser = {
            id: userData._id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            addresses: userData.addresses || []
          }

          const authData = {
            token: token,
            user: newUser,
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
          }

          localStorage.setItem("auth_token", JSON.stringify(authData))

          // Force reload to ensure StoreProvider picks up the new token
          window.location.href = "/"
        } catch (err) {
          console.error("Google login error:", err)
          setError("Google login failed. Please try again.")
          setGoogleLoading(false)
        }
      }
      fetchGoogleUser()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const isSuccess = await login(email, password)

      // Need to get the user from the store or response to verify role
      // Since login returns boolean and updates store async, we might need a better way.
      // However, the `login` function in store-context calls setUser. 
      // We can check local storage or modify login to return user.
      // For now, let's assume if login works, we check the role.
      // NOTE: useStore's user might not be updated immediately in this closure. 
      // But verify logic:

      const storedAuth = localStorage.getItem("auth_token")
      if (storedAuth) {
        const authData = JSON.parse(storedAuth)
        if (authData.user.role !== accountType) {
          // Role mismatch is arguably a login failure in this context
          // Log them out ? Or just warn?
          // Prompt implies enforcing the selection.
          // Let's show error and not redirect.
          setError(`You are not logged in as ${accountType === 'admin' ? 'an Admin' : 'a User'}.`)
          return
        }
      }

      router.push("/")
    } catch (err: any) {
      if (err.response?.data?.notVerified) {
        setError("Your email is not verified. Please register again or contact support.")
        // Optionally redirect to a verification page if we had one.
        // For now, let's just show the error message.
      } else {
        setError(err.response?.data?.message || "Invalid credentials.")
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {googleLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Logging in with Google...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <RadioGroup
                    defaultValue="user"
                    value={accountType}
                    onValueChange={setAccountType}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user" className="font-normal cursor-pointer">User</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin" className="font-normal cursor-pointer">Admin</Label>
                    </div>
                  </RadioGroup>
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
                  Login
                </Button>
              </form>
            )}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline hover:text-primary">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  )
}
