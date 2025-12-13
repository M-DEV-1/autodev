"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSession, signOut, signIn } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
    const { data: session, status } = useSession();
    const [isGuest, setIsGuest] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const guest = localStorage.getItem('autodev_guest');
        if (guest === 'true') {
            setIsGuest(true);
        }
    }, []);

    const handleGuestLogin = () => {
        localStorage.setItem('autodev_guest', 'true');
        window.location.href = '/dashboard';
    };

    const handleSignOut = () => {
        if (isGuest) {
            localStorage.removeItem('autodev_guest');
            router.push('/');
        } else {
            signOut({ callbackUrl: '/' });
        }
    };

    const isLoading = status === 'loading';
    const isLoggedIn = status === 'authenticated' || isGuest;
    const user = session?.user;
    const isHomePage = pathname === "/";

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
            <div className="rounded-full border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl shadow-black/50 px-4 md:px-6 h-14 flex items-center justify-between supports-[backdrop-filter]:bg-black/20">

                <Link href={"/"} className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="AutoDev"
                        width={24}
                        height={24}
                        className="h-6 w-6"
                    />
                    <span className="text-base font-bold tracking-tight text-white hidden sm:block">AutoDev</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground/80">
                    <Link
                        href={isHomePage ? "#features" : "/#features"}
                        className="hover:text-white transition-colors"
                    >
                        Features
                    </Link>
                    <Link
                        href={isHomePage ? "#how-it-works" : "/#how-it-works"}
                        className="hover:text-white transition-colors"
                    >
                        How It Works
                    </Link>
                    {!isLoggedIn && <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>}
                    {isLoggedIn && <Link href="/dashboard" className="hover:text-white transition-colors text-blue-400">Dashboard</Link>}
                </nav>

                <div className="flex items-center gap-3">
                    {isLoading ? (
                        <div className="w-8 h-8 rounded-full bg-gray-700/50 animate-pulse" />
                    ) : isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
                                        <AvatarFallback>{user?.name?.[0] || (isGuest ? 'G' : 'U')}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-[#0A0A0B]/90 backdrop-blur-xl border-white/10 text-white" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{isGuest ? 'Guest User' : user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {isGuest ? 'Sandbox Mode' : user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={() => router.push('/dashboard')} className="focus:bg-white/10 focus:text-white cursor-pointer">
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem onClick={handleSignOut} className="focus:bg-white/10 focus:text-white cursor-pointer text-red-500">
                                    {isGuest ? 'Exit Guest Mode' : 'Log out'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" className="bg-orange-700 hover:bg-orange-600 text-white border-none rounded-full px-5 h-8 text-xs font-semibold shadow-lg shadow-orange-900/20">
                                    Get Started
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-[#0A0A0B]/90 backdrop-blur-3xl border-white/10 text-white shadow-2xl shadow-black/50 top-[20%] translate-y-0">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold tracking-tight">Welcome to AutoDev</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Choose how you want to get started building.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 py-4">
                                    <Button
                                        size="lg"
                                        onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                                        className="w-full bg-white text-black hover:bg-white/90 font-medium flex items-center gap-2"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" /></svg>
                                        Sign in with GitHub
                                    </Button>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/10" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-[#0A0A0B] px-2 text-slate-500">Or continue as</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleGuestLogin}
                                        className="w-full border-white/10 hover:bg-white/5 text-white hover:text-white"
                                    >
                                        Guest (Sandbox Mode)
                                    </Button>
                                    <p className="text-[10px] uppercase tracking-wider text-center text-slate-500 mt-2">
                                        Read-only access to most features
                                    </p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </header>
    );
}
