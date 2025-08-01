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
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <img 
              src="/lovable-uploads/a072be70-e958-41a6-a84a-852d10c0e8d3.png" 
              alt="Rasper" 
              className="h-8 w-auto"
            />
          </Link>
          
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
          
          <div className="flex-shrink-0 w-8"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;