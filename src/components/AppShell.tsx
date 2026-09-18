import {
  ArrowUpRight,
  Crosshair,
  House,
  Info,
  LinkSimple,
  List,
  MagnifyingGlass,
  ShareNetwork,
  Stack,
  TreeStructure,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { caseById, searchAll, seed } from "../data/model";
import { storyByCase } from "../data/trail";

const navItems: Array<{ to: string; label: string; icon: typeof House; end?: boolean }> = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/incidents", label: "Cases", icon: Crosshair },
  { to: "/patterns", label: "Patterns", icon: Stack },
  { to: "/techniques", label: "Techniques", icon: TreeStructure },
  { to: "/network", label: "Network", icon: ShareNetwork },
  { to: "/sources", label: "Sources", icon: LinkSimple },
  { to: "/about", label: "About", icon: Info },
];

const crumbNames: Record<string, string> = {
  incidents: "Cases",
  patterns: "Patterns",
  techniques: "Techniques",
  network: "Network",
  sources: "Sources",
  about: "About",
};

function LogoMark() {
  return (
    <Link to="/" className="brand" aria-label="AI Threat Field Guide home">
      <Crosshair size={16} className="brand__mark" aria-hidden="true" />
      <span className="brand__name">FIELD<br />GUIDE</span>
    </Link>
  );
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = searchAll(query);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const choose = (href: string) => {
    navigate(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={`global-search ${open ? "global-search--open" : ""}`}>
      <MagnifyingGlass size={18} aria-hidden="true" />
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        type="search"
        placeholder="LAMEHUG or Hugging Face"
        aria-label="Search cases, editorial patterns, techniques, and sources"
        aria-expanded={open && Boolean(query)}
      />
      <kbd>⌘ K</kbd>
      {open && query && (
        <div className="search-results" role="region" aria-label="Search results">
          {results.length ? results.map((result) => (
            <button key={`${result.kind}-${result.id}`} type="button" onClick={() => choose(result.href)}>
              <span>{result.kind}</span>
              <strong>{result.title}</strong>
              <small>{result.meta}</small>
            </button>
          )) : <p>No records match “{query}”. Try a case name, technique ID, or source domain.</p>}
        </div>
      )}
    </div>
  );
}

function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {parts.map((part, index) => {
        const href = `/${parts.slice(0, index + 1).join("/")}`;
        const decoded = decodeURIComponent(part);
        const story = parts[index - 1] === "incidents" ? storyByCase.get(decoded) : undefined;
        const record = parts[index - 1] === "incidents" ? caseById.get(decoded) : undefined;
        const label = crumbNames[part] ?? story?.mechanism ?? (record ? record.id : decoded.replaceAll("-", " "));
        return <span key={href}>/ <Link to={href}>{label}</Link></span>;
      })}
    </nav>
  );
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className={`side-rail ${menuOpen ? "side-rail--open" : ""}`}>
        <LogoMark />
        <nav className="side-nav" aria-label="Primary navigation">
          {navItems.slice(0, 2).map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={22} weight="regular" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
          <details className="reference-nav" open={navItems.slice(2).some(item => location.pathname.startsWith(item.to)) || undefined}>
            <summary><List size={22} aria-hidden="true" /><span>Reference</span></summary>
            {navItems.slice(2).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={18} aria-hidden="true" /><span>{label}</span></NavLink>)}
          </details>
        </nav>
        <a className="atlas-link" href={seed.atlas_snapshot.source} target="_blank" rel="noreferrer" aria-label={`Open MITRE ATLAS ${seed.atlas_snapshot.version} snapshot`}>
          <span>MITRE ATLAS</span>
          <strong>{seed.atlas_snapshot.version}</strong>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </aside>

      <header className="utility-bar">
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <List size={22} />}
        </button>
        <Breadcrumbs />
        <GlobalSearch />

      </header>

      <main id="main-content" className="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <strong>AI Threat Field Guide</strong>
          <p>Written by Aaron. MITRE ATLAS {seed.atlas_snapshot.version} supplies canonical case metadata and official technique mappings; Field Guide summaries and patterns are labeled editorial. This project is not a MITRE product, and it is not affiliated with the vendors or governments named in the records.</p>
        </div>
        <div className="site-footer__meta">
          <span>MITRE ATLAS snapshot {seed.atlas_snapshot.version}</span>
          <span>Research demonstrations stay labeled, separate from incidents.</span>
        </div>
      </footer>
    </div>
  );
}
