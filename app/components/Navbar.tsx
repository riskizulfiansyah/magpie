"use client";

import Link from "next/link";

const navItems = [
    { name: "Dashboard", href: "/", active: true },
    { name: "Orders", href: "/orders", active: false },
    { name: "Products", href: "/products", active: false },
    { name: "Customers", href: "/customers", active: false },
    { name: "Settings", href: "/settings", active: false },
];

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-navy-dark border-b border-border">
            <div className="flex items-center gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                    </div>
                    <span className="text-lg font-semibold text-white">
                        Magpie Analytics
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${item.active
                                ? "bg-navy text-white"
                                : "text-gray-light/70 hover:text-white hover:bg-navy/50"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* User Avatar */}
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-amber-light flex items-center justify-center">
                    <span className="text-sm font-semibold text-black">U</span>
                </div>
            </div>
        </nav>
    );
}
