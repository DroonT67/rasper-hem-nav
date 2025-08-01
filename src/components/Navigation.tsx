import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Träningsapp", href: "/trainingsapp" },
    { name: "Vinkällare", href: "/vinkallare" },
    { name: "Anmälan", href: "/anmalan" },
    { name: "Knapp N", href: "/knapp-n" },
  ];

  return (
    <nav className="w-full bg-nav-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <ul className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "px-4 py-2 rounded-md transition-all duration-200 font-medium",
                  location.pathname === item.href
                    ? "text-nav-active bg-nav-hover"
                    : "text-nav-text hover:text-nav-active hover:bg-nav-hover"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;