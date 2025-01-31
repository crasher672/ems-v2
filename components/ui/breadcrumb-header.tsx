'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

// Define the Route type
interface Route {
    path: string;
    label: string;
    subRoutes?: Route[];
}

// Import the routes
import { routes } from '@/lib/constants/routes'
import useUser from '@/hooks/use-user';

// Define the findRoute function with types
function findRoute(pathSegments: string[], routes: Route[]): Route | null {
    for (const route of routes) {
        if (route.path === `/${pathSegments.join('/')}`) {
            return route
        }
        if (route.subRoutes) {
            const subRoute = findRoute(pathSegments, route.subRoutes)
            if (subRoute) {
                return subRoute
            }
        }
    }
    return null
}

// Define the Breadcrumb component
export function Breadcrumb() {
    const pathname = usePathname()
    const pathSegments = pathname.split('/').filter(segment => segment !== '')

    // Check if we're on a user detail page
    const isUserDetailPage = pathname.match(/^\/superadministrator\/employeePanel\/user\/(.+)$/)
    const userId = isUserDetailPage ? isUserDetailPage[1] : null
    const { user } = userId ? useUser(userId) : { user: null }

    // If the current path is /homepage, return an empty breadcrumb list
    if (pathname === '/homepage') {
        return (
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/homepage" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        Home
                    </Link>
                </li>
            </ol>
        )
    }

    const breadcrumbs = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`
        const route = findRoute(pathSegments.slice(0, index + 1), routes)

        // For user detail pages, replace the last segment with user's name
        if (userId && index === pathSegments.length - 1) {
            return {
                path,
                label: user?.firstName + " " + user?.lastName || 'Loading...' // Show loading state while fetching
            }
        }

        return route ? { path, label: route.label } : { path, label: segment }
    })

    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link href="/homepage" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        Home
                    </Link>
                </li>
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.path} className="flex items-center">
                        <ChevronRight className="w-4 h-4 text-gray-500 mx-2 dark:text-gray-400" />
                        {index === breadcrumbs.length - 1 ? (
                            <span className="text-purple-900 font-medium dark:text-purple-500">{breadcrumb.label}</span>
                        ) : (
                            <Link href={breadcrumb.path} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                {breadcrumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}