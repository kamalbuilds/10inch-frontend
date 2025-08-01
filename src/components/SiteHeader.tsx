"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Image from "next/image";

const SiteHeader = () => {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { id: "home", label: "Home" },
        { id: "app", label: "Swap" },
    ];

    return (
        <nav
            className="
            fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl
            bg-white/80 border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-700/50
            backdrop-blur-xl border rounded-2xl shadow-lg transition-all duration-300
          "
        >
            <div className="flex items-center justify-between px-6 py-1">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Image
                        src="/1inch_logo.png"
                        alt="Fusion+"
                        height={25}
                        width={25}
                        className="m-0"
                    />
                    <span className="text-xl font-bold tracking-tight text-blue-500 font-awesome">
                        Fusion+
                    </span>
                </div>

                {/* Navigation Items */}
                <div className="hidden md:flex items-center space-x-1">
                    {navItems.map((item) => {
                        const isActive =
                            (item.id === "home" && pathname === "/") ||
                            (item.id !== "home" && pathname.startsWith(`/${item.id}`));
                        return (
                            <button
                                key={item.id}
                                onClick={() =>
                                    router.push(`/${item.id === "home" ? "" : item.id}`)
                                }
                                className={`
                      px-4 cursor-pointer py-1 rounded-xl font-medium transition-all duration-200
                      ${isActive
                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                                    }
                    `}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
                {/* Right Side Actions */}
                <Button
                    onClick={() => router.push("/app")}
                    className="cursor-pointer"
                >
                    Get Started
                </Button>
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        className="
                  p-2 rounded-xl
                  text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800
                "
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-gray-200/50 px-6 py-4">
                <div className="flex flex-col space-y-2">
                    {navItems.map((item) => {
                        const isActive =
                            (item.id === "home" && pathname === "/") ||
                            (item.id !== "home" && pathname.startsWith(`/${item.id}`));
                        return (
                            <button
                                key={item.id}
                                onClick={() =>
                                    router.push(`/${item.id === "home" ? "" : item.id}`)
                                }
                                className={`
                                    px-4 cursor-pointer py-2 rounded-xl font-medium text-left transition-all duration-200
                                    ${isActive
                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                                    }
                    `}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}


export default SiteHeader;