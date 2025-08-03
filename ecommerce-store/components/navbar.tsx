"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { Category } from "@/types";
import getCategories from "@/actions/get-categories";
import { useStore } from "@/contexts/store-context";

import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import StoreSelector from "@/components/store-selector";

import logo from "../public/logo-beige.svg";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { selectedStore, stores } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedStore) {
        setCategories([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getCategories(selectedStore.id);
        setCategories(result);
      } catch (error) {
        console.error("Error in navbar fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [selectedStore]);

  return (
    <nav className="sticky top-0 z-10 py-4 bg-background border-b-2 shadow-md border-accent/10 shadow-accent/5">
      <Container>
        <section className="relative flex items-center h-24 px-4 sm:px-6">
          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu />
          </button>
          <ul className="w-full px-3 py-2 text-xl font-bold md:w-1/3 lg:w-1/5">
            <Link
              href="/"
              className="flex ml-r lg:ml-0 gap-x-2"
            >
              <Image
                src={logo}
                alt="Nour Abaya Logo"
                height={110}
                width={110}
                priority
              />
            </Link>
          </ul>

          {/* Store Selector - only show when multiple stores exist */}
          {stores.length > 1 && (
            <div className="hidden md:block mr-4">
              <StoreSelector />
            </div>
          )}

          {/* Normal navbar on md screens and up */}
          <div className="w-full">
            <MainNav data={categories || []} />
          </div>

          {/* Mobile navbar on sm screens */}
          <div className="md:hidden">
            <MainNav
              data={categories || []}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </div>

          <NavbarActions />
        </section>
      </Container>
    </nav>
  );
};

export default Navbar;
