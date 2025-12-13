import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';
import AuthProvider from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AutoDev',
    description: 'Coordinate planning, coding, and deployment with a single prompt.',
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.className, "bg-background text-foreground antialiased selection:bg-orange-500/30")}>
                <AuthProvider>
                    <Header />
                    <main className="min-h-screen">
                        {children}
                    </main>
                </AuthProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
