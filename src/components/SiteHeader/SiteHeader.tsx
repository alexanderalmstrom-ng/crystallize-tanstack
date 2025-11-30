import { Link } from "@tanstack/react-router";
import { MenuIcon, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SiteHeaderLogo from "./SiteHeaderLogo";

export default function SiteHeader() {
  return (
    <header className="px-5 py-3.5 xl:px-10 xl:py-8 grid grid-cols-[1fr_auto_1fr] items-center gap-8">
      <button className="xl:hidden" type="button">
        <MenuIcon size={16} strokeWidth={1.25} />
      </button>
      <nav className="flex gap-8 items-center justify-start max-xl:hidden">
        <Link to="/">Products</Link>
        <Link to="/">News</Link>
        <Link to="/">Campaigns</Link>
        <Link to="/">Services</Link>
        <Link to="/">Journal</Link>
      </nav>
      <Link to="/">
        <SiteHeaderLogo className="xl:max-w-44 max-w-32" />
      </Link>
      <div className="ml-auto flex grow">
        <form className="max-xl:hidden flex flex-row">
          <Input
            className="focus:outline-none border-0 placeholder:text-sm rounded-full"
            type="search"
            name="search"
            placeholder="Search"
          />
          <Button variant="ghost" type="submit">
            <SearchIcon size={16} strokeWidth={1.25} />
          </Button>
        </form>
        <Button variant="ghost" className="xl:hidden" type="button">
          <SearchIcon size={16} strokeWidth={1.25} />
        </Button>
      </div>
    </header>
  );
}
