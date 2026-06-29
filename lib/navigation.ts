import {
  BookOpen,
  FileClock,
  Home,
  KeyRound,
  LifeBuoy,
  Rocket,
  ScrollText,
} from "lucide-react";

export const navItems = [
  { title: "Overview", href: "/", icon: Home },
  { title: "Getting Started", href: "/docs/getting-started", icon: Rocket },
  { title: "Authentication", href: "/docs/authentication", icon: KeyRound },
  { title: "API Reference", href: "/reference", icon: ScrollText },
  { title: "Changelog", href: "/changelog", icon: FileClock },
];

export const resourceItems = [
  { title: "Guides", href: "/docs/getting-started", icon: BookOpen },
  { title: "Support", href: "mailto:developers@example.com", icon: LifeBuoy },
];
