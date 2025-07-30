const Navigation = () => {
  const navItems = [
    { name: "Träningsapp", href: "#trainingsapp" },
    { name: "Vinkällare", href: "#vinkallare" },
    { name: "Anmälan", href: "#anmalan" },
    { name: "Knapp N", href: "#knapp-n" },
  ];

  return (
    <nav className="w-full bg-nav-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <ul className="flex justify-center space-x-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className="text-nav-text hover:text-nav-active hover:bg-nav-hover px-4 py-2 rounded-md transition-all duration-200 font-medium"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;