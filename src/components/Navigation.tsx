import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Menu, X } from "../components/icons";
import { getPortfolioData } from "../services/api";

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [name, setName] = useState('Abdulmajid alawad');
    const [cvUrl, setCvUrl] = useState('');

    const navItems = [
        { name: 'Home', href: 'hero' },
        { name: 'About', href: 'about' },
        { name: 'Projects', href: 'projects' },
        { name: 'Contact', href: 'contact' }
    ];

    const handleDownloadCV = () => {
        if (!cvUrl) {
            alert('CV download URL not available');
            return;
        }
        
        // Create a link element to trigger download
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = 'Abdulmajid_Alawad_CV.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['hero', 'about', 'projects', 'contact'];
            const scrollPosition = window.scrollY + 100;
            
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const portfolioData = await getPortfolioData();
                console.log(portfolioData.hero.cvUrl);
                setCvUrl(portfolioData.hero.cvUrl || '');
            } catch (error) {
                console.error('Failed to fetch portfolio data:', error);
            }
        };

        fetchPortfolioData();
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => scrollToSection('hero')}
                        className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
                    >
                        {name}
                    </button>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.href}
                                onClick={() => scrollToSection(item.href)}
                                className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${activeSection === item.href ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                {item.name}
                            </button>
                        ))}
                        <Button
                            onClick={handleDownloadCV}
                            variant="outline"
                            size="sm"
                            className="text-sm font-medium"
                        >
                            Download CV
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Mobile navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => scrollToSection(item.href)}
                                    className={`text-left py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-secondary ${activeSection === item.href
                                            ? 'text-primary bg-secondary'
                                            : 'text-muted-foreground'
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                            <Button
                                onClick={handleDownloadCV}
                                variant="outline"
                                size="sm"
                                className="mx-4 text-sm font-medium"
                            >
                                Download CV
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;