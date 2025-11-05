'use client'

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface PageHeaderProps {
    title: string;
    description: string;
    action?: {
        label: string;
        icon?: React.ReactNode;
        href?: string;
        onClick?: () => void;
    };
    hasBack?: boolean;
    isLoading?: boolean;
    variant?: "destructive" | "link" | "default" | "outline" | "secondary" | "ghost" | null | undefined
}

const PageHeader = React.memo(function PageHeader({ title, description, action, hasBack, isLoading, variant }: PageHeaderProps) {
    const renderAction = () => {
        if (!action) return null

        const content = (
            <>
                {action.icon}
                {action.label}
            </>
        )

        if (action.href) {
            return (
                <Button className="text-xs sm:text-sm" asChild>
                    <Link href={action.href}>{content}</Link>
                </Button>
            )
        }

        return (
            <Button className="text-xs sm:text-sm" onClick={action.onClick} variant={variant ? variant : 'default'}>
                {content}
            </Button>
        )
    }
    const renderBackButton = () => {
        if (!hasBack) return null
        return (
            <Button size="icon" variant="outline" className="mr-2 mt-1.5 cursor-pointer" onClick={() => router.back()}>
                <ArrowLeft/>
            </Button>
        )
    }
    const router = useRouter()

    return (
        <div className="flex flex-col gap-y-3 sm:flex-row sm:justify-between sm:gap-0">
            <div className="flex items-start">
                {renderBackButton()}
                <div>
                    {
                        isLoading ? (
                            <>
                                <Skeleton className="h-5 w-32 my-2"/>
                                <Skeleton className="h-5 w-56"/>
                            </>
                        ) : (
                            <>
                                <h1 className="sm:text-2xl font-bold tracking-tight">{title}</h1>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    {description}
                                </p>
                            </>
                        )
                    }
                </div>
            </div>
            {renderAction()}
        </div>
    )
})
export default PageHeader