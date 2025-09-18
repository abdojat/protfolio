import React, { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Heart } from "../components/icons";
import { getPortfolioData } from "../services/api";

interface FooterData {
    copyright: string;
    description?: string;
    additionalLinks: Array<{ text: string; url: string }>;
}

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [links, setLinks] = useState<{ github?: string; linkedin?: string; email?: string }>({});
    const [footerData, setFooterData] = useState<FooterData | null>(null);

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const portfolio = await getPortfolioData();
                const social = portfolio.hero?.socialLinks || {};
                setLinks({
                    github: social.github || "",
                    linkedin: social.linkedin || "",
                    email: social.email || "",
                });
                setFooterData(portfolio.footer);
            } catch (e) {
                // leave defaults
            }
        };
        fetchFooterData();
    }, []);

    return (
        <footer className="bg-background border-t border-border py-12">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Main footer content */}
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* Brand section */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                                Portfolio
                            </h3>
                            <p className="text-muted-foreground">
                                {footerData?.description || "Building digital experiences with passion and precision."}
                            </p>
                        </div>

                        {/* Quick links */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                                >
                                    About
                                </button>
                                <button
                                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                                >
                                    Projects
                                </button>
                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                                >
                                    Contact
                                </button>
                            </div>
                        </div>

                        {/* Social links */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-foreground">Connect</h4>
                            <div className="flex space-x-4">
                                {links.github && (
                                    <a
                                        href={links.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-secondary hover:bg-accent transition-all duration-300 hover:shadow-glow-secondary group"
                                    >
                                        <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                    </a>
                                )}
                                {links.linkedin && (
                                    <a
                                        href={links.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg bg-secondary hover:bg-accent transition-all duration-300 hover:shadow-glow-secondary group"
                                    >
                                        <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                    </a>
                                )}
                                {links.email && (
                                    <a
                                        href={`mailto:${links.email}`}
                                        className="p-2 rounded-lg bg-secondary hover:bg-accent transition-all duration-300 hover:shadow-glow-secondary group"
                                    >
                                        <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div className="border-t border-border pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <p className="text-muted-foreground text-sm">
                                {footerData?.copyright || `© ${currentYear} Portfolio. All rights reserved.`}
                            </p>
                            <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                                <span>Made with</span>
                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                                <span>using React & Tailwind CSS</span>
                            </div>
                        </div>
                        {/* Additional links if available */}
                        {footerData?.additionalLinks && footerData.additionalLinks.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-4 mt-4">
                                {footerData.additionalLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                                    >
                                        {link.text}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;