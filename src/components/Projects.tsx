import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ExternalLink, Github } from "../components/icons";
import api from "../services/api";

type ProjectItem = {
    _id?: string;
    title: string;
    description: string;
    technologies: string[];
    frontendUrl?: string;
    backendUrl?: string;
    liveUrl?: string;
    image?: string;
};

const Projects = () => {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get("/portfolio");
                const items: ProjectItem[] = res?.data?.data?.projects?.items || [];
                setProjects(items);
            } catch (err) {
                console.error("Failed to load projects", err);
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <section id="projects" className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                            Featured Projects
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A showcase of my recent work and personal projects
                        </p>
                    </div>

                    {/* Projects grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading && (
                            <div className="col-span-full text-center text-muted-foreground">Loading projects...</div>
                        )}
                        {!isLoading && projects.length === 0 && (
                            <div className="col-span-full text-center text-muted-foreground">No projects available.</div>
                        )}
                        {projects.map((project, index) => (
                            <Card
                                key={index}
                                className="group hover:shadow-glow-secondary transition-all duration-300 hover:scale-105 bg-card border-border overflow-hidden"
                            >
                                {/* Project image */}
                                <div className="h-48 bg-gradient-secondary border-b border-border flex items-center justify-center overflow-hidden">
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-2 flex items-center justify-center">
                                                <ExternalLink className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-muted-foreground text-sm">Project Screenshot</p>
                                        </div>
                                    )}
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                                        {project.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.map((tech, techIndex) => (
                                            <Badge
                                                key={techIndex}
                                                variant="secondary"
                                                className="text-xs bg-secondary hover:bg-accent transition-colors duration-300"
                                            >
                                                {tech}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-2 pt-2">
                                        {project.liveUrl && (
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                                                asChild
                                            >
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Live Demo
                                                </a>
                                            </Button>
                                        )}
                                        {project.frontendUrl && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-border hover:bg-secondary transition-all duration-300"
                                                asChild
                                            >
                                                <a href={project.frontendUrl} target="_blank" rel="noopener noreferrer">
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                        {project.backendUrl && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-border hover:bg-secondary transition-all duration-300"
                                                asChild
                                            >
                                                <a href={project.backendUrl} target="_blank" rel="noopener noreferrer">
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* More projects CTA */}
                    <div className="text-center mt-12">
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-border hover:bg-secondary transition-all duration-300"
                            asChild
                        >
                            <a href="https://github.com/abdojat" target="_blank" rel="noopener noreferrer">
                                <Github className="w-5 h-5 mr-2" />
                                View More on GitHub
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Projects;