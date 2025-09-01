"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, Settings, Music } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "変換", icon: Home },
    { href: "/history", label: "履歴", icon: History },
    { href: "/settings", label: "設定", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-secondary border-r border-border">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <Music className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">MP3 to MP4</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;