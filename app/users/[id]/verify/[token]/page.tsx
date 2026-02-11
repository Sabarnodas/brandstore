"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EmailVerifyPage() {
    const [validUrl, setValidUrl] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const param = useParams()
    const router = useRouter()

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const url = `${apiUrl}/auth/${param.id}/verify/${param.token}`
                const { data } = await axios.get(url)
                console.log(data)
                setValidUrl(true)
            } catch (error) {
                console.log(error)
                setValidUrl(false)
            } finally {
                setIsLoading(false)
            }
        }
        verifyEmailUrl()
    }, [param])

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {isLoading ? (
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        ) : validUrl ? (
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        ) : (
                            <XCircle className="h-12 w-12 text-destructive" />
                        )}
                    </div>
                    <CardTitle>
                        {isLoading ? "Verifying..." : validUrl ? "Email Verified" : "Verification Failed"}
                    </CardTitle>
                    <CardDescription>
                        {isLoading
                            ? "Please wait while we verify your email address."
                            : validUrl
                                ? "Your email has been successfully verified! You can now log in to your account."
                                : "The verification link is invalid or has expired."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isLoading && (
                        <Button asChild className="w-full">
                            <Link href="/login">
                                {validUrl ? "Go to Login" : "Back to Login"}
                            </Link>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
