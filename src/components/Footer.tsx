const Footer = () => (
  <footer className="bg-foreground text-background py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        {[
          { title: "Discover", links: ["Concerts", "Sports", "Arts & Theater", "Family", "VIP Experiences"] },
          { title: "Help", links: ["Customer Service", "My Account", "FAQs", "Accessibility"] },
          { title: "Company", links: ["About Us", "Careers", "Press", "Partners"] },
          { title: "Legal", links: ["Terms of Use", "Privacy Policy", "Cookie Settings", "Ad Choices"] },
        ].map((section) => (
          <div key={section.title}>
            <h4 className="font-bold text-sm mb-4 text-background/60 uppercase tracking-wider">{section.title}</h4>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-background/40 hover:text-background transition-colors font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xs">TM</span>
          </div>
          <span className="font-bold text-sm text-background/60">© 2026 Ticketmaster. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          {["United States", "English"].map((item) => (
            <span key={item} className="text-sm text-background/40 font-medium">{item}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
