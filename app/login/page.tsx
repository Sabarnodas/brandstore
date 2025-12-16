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
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountType, setAccountType] = useState("user")
  const [error, setError] = useState("")
  const { login, user } = useStore()
  const router = useRouter()

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
      setError(err.response?.data?.message || "Invalid credentials.")
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
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline hover:text-primary">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
