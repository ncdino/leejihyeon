"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useViewStore } from "@/app/_store/viewStore";
import { useSearchStore } from "@/app/_store/searchStore";
import { useLayoutStore } from "@/app/_store/viewStore";
import { useAuthStore } from "../_store/authStore";
import { useThemeStore } from "../_store/themeStore";

const NavItem = ({
  view,
  label,
  onLinkClick,
}: {
  view: "posts" | "profile";
  label: string;
  onLinkClick?: () => void;
}) => {
  const { currentView, setView } = useViewStore();

  const handleClick = () => {
    setView(view);
    if (onLinkClick) onLinkClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 w-full text-center md:w-auto md:text-left rounded transition-colors duration-300 ${
        currentView === view
          ? "font-bold text-blue-600 dark:text-blue-400"
          : "text-neutral-950 hover:text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-400"
      }`}
    >
      {label}
    </button>
  );
};

const Header = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore();
  const { setView } = useViewStore();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const [isOpenSearchInput, setIsOpenSearchInput] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const setHeaderHeight = useLayoutStore((state) => state.setHeaderHeight);
  const { isLogin, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [setHeaderHeight]);

  useEffect(() => {
    const isSystemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(isSystemDark ? "dark" : "light");
  }, [setTheme]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setView("posts");
  };

  const handleSearchOpen = () => setIsOpenSearchInput(!isOpenSearchInput);

  const handleMobileSearchOpen = () =>
    setIsMobileSearchOpen(!isMobileSearchOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("posts");
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("posts");
  };

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm transition-colors"
    >
      <div className="flex justify-between items-center mx-auto max-w-5xl px-5 py-4">
        <div className="flex items-center">
          <Link
            href={"/"}
            onClick={() => {
              setView("posts");
              setSearchTerm("");
              handleLinkClick();
            }}
          >
            <h1 className="font-bitcount tracking-tighter text-2xl md:text-3xl lg:text-4xl text-neutral-950 hover:text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-400 transition-colors duration-300">
              leejihyeon.dev
            </h1>
          </Link>
        </div>

        {/* lg apsb */}
        <nav className="hidden md:flex items-center gap-4 font-bitcount tracking-tighter">
          {isLogin && (
            <div className="flex flex-row gap-10">
              <button className="text-neutral-950 dark:text-neutral-50">
                <Link href="/new-post">write</Link>
              </button>
              <button
                className="text-neutral-950 dark:text-neutral-50"
                onClick={logout}
              >
                logout
              </button>
            </div>
          )}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
          >
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpenSearchInput ? "w-40 opacity-100" : "w-0 opacity-0"
              }`}
            >
              <input
                type="search"
                placeholder="search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-2 py-1 border-2 border-dotted rounded-lg dark:bg-gray-700 dark:border-gray-300 text-start dark:text-white"
              />
            </div>
          </form>
          <button
            type="button"
            onClick={handleSearchOpen}
            className="p-2 dark:text-white"
          >
            {isOpenSearchInput ? (
              <span className="flex justify-center items-center gap-1">
                <i className="bx bx-x text-base mb-1"></i>
                <span>close</span>
              </span>
            ) : (
              <span className="flex justify-center items-center gap-1">
                <i className="bx bx-search text-base mb-1"></i>
                <span>search</span>
              </span>
            )}
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>

          <NavItem view="posts" label="Posts" onLinkClick={handleLinkClick} />
          <NavItem
            view="profile"
            label="Profile"
            onLinkClick={handleLinkClick}
          />
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded text-neutral-950 hover:text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-400 transition-colors duration-300"
          >
            {theme === "dark" ? (
              <span className="flex justify-center items-center gap-1">
                <span>light</span>
                <i className="bx bx-sun text-base mb-1"></i>
              </span>
            ) : (
              <span className="flex justify-center items-center gap-1">
                <span>dark</span>
                <i className="bx bx-moon text-base mb-1"></i>
              </span>
            )}
          </button>
        </nav>

        {/* 모바일 메뉴 아이콘 */}
        <div className="md:hidden flex items-center gap-2 max-w-full overflow-hidden">
          <form
            onSubmit={handleMobileSearchSubmit}
            className="font-bitcount md:hidden relative flex items-center flex-grow"
          >
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isMobileSearchOpen ? "flex-grow opacity-100" : "w-0 opacity-0"
              }`}
            >
              <input
                type="search"
                placeholder="search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-2 py-1 border-2 border-dotted rounded-lg dark:bg-gray-700 dark:border-gray-300 text-start dark:text-white min-w-0"
              />
            </div>
          </form>
          <button
            onClick={handleMobileSearchOpen}
            className="dark:text-white text-2xl"
          >
            {isMobileSearchOpen ? (
              <i className="bx bx-x text-2xl"></i>
            ) : (
              <i className="bx bx-search text-2xl"></i>
            )}
          </button>
          <button
            onClick={() => {
              toggleTheme();
              handleLinkClick();
            }}
            className="p-2 rounded text-left text-neutral-950 hover:text-neutral-600 dark:text-neutral-50 dark:hover:text-neutral-400"
          >
            {theme === "dark" ? (
              <i className="bx bx-sun text-2xl"></i>
            ) : (
              <i className="bx bx-moon text-2xl"></i>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="dark:text-white text-2xl"
          >
            {isMobileMenuOpen ? (
              <i className="bx bx-x text-2xl"></i>
            ) : (
              <i className="bx bx-menu text-2xl"></i>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen border-t" : "max-h-0"
        } overflow-hidden dark:border-gray-700`}
      >
        <nav className="flex flex-col items-stretch gap-2 p-4 font-bitcount tracking-tighter">
          <NavItem view="posts" label="Posts" onLinkClick={handleLinkClick} />
          <NavItem
            view="profile"
            label="Profile"
            onLinkClick={handleLinkClick}
          />
          {isLogin && (
            <button
              className="text-neutral-950 dark:text-neutral-50"
              onClick={logout}
            >
              logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
