import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AutoDev Ops Agent',
    description: 'Autonomous Developer Platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.className, "bg-background text-foreground antialiased selection:bg-orange-500/30")}>
                <Header />
                <main className="min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
