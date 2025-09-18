import { Button } from "../components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "../components/icons";
import { useEffect, useState } from "react";
import { getPortfolioData } from "../services/api";

const Hero = () => {
    const [hero, setHero] = useState({
        title: '',
        subtitle: '',
        description: '',
        github: '',
        linkedin: '',
        email: ''
    });
    const scrollToSection = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        const fetchData = async () => {
            const portfolio = await getPortfolioData();
            setHero({
                title: portfolio.hero?.title || '',
                subtitle: portfolio.hero?.subtitle || '',
                description: portfolio.hero?.description || '',
                github: portfolio.hero?.socialLinks?.github || '',
                linkedin: portfolio.hero?.socialLinks?.linkedin || '',
                email: portfolio.hero?.socialLinks?.email || ''
            });
        }
        fetchData();
    }, []);

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-hero opacity-50" />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Main heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-in slide-in-from-bottom-10 duration-1000">
                        {hero.title}
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-in slide-in-from-bottom-10 duration-1000 delay-200">
                        {hero.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-in slide-in-from-bottom-10 duration-1000 delay-400">
                        {hero.description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in slide-in-from-bottom-10 duration-1000 delay-600">
                        <Button
                            size="lg"
                            className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                            onClick={() => scrollToSection('projects')}
                        >
                            View My Work
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-border hover:bg-secondary transition-all duration-300"
                            onClick={() => scrollToSection('contact')}
                        >
                            Get In Touch
                        </Button>
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center gap-6 mb-12 animate-in slide-in-from-bottom-10 duration-1000 delay-800">
                        <a
                            href={hero.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-secondary hover:bg-accent transition-all duration-300 hover:shadow-glow-secondary group"
                        >
                            <Github className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                        </a>
                        <a
                            href={hero.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full bg-secondary hover:bg-accent transition-all duration-300 hover:shadow-glow-secondary group"
                        >
                            <Linkedin className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                        </a>
                        <a
                            href={"mailto:"+hero.email}
                            className="p-3 rounded-full bg-secondary hover:bg-accent transition-all duration-300 hover:shadow-glow-secondary group"
                        >
                            <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                        </a>
                    </div>

                    {/* Scroll indicator */}
                    <Button
                        onClick={() => scrollToSection('about')}
                        className="animate-bounce hover:scale-110 transition-transform duration-300"
                    >
                        <ArrowDown className="w-8 h-8 text-muted-foreground" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;