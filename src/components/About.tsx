import { Card, CardContent } from "../components/ui/card";
import { useEffect, useState } from "react";
import { getPortfolioData, type Skill } from "../services/api";

const About = () => {
  type AboutForm = {
    title: string;
    subtitle: string;
    description: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    skills: Skill[];
    image: string;
  };

  const [aboutForm, setAboutForm] = useState<AboutForm>({
    title: '',
    subtitle: '',
    description: '',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    skills:[],
    image: ''
  });
  useEffect(() => {
    const fetchData = async () => {
      const portfolio = await getPortfolioData();
      console.log(portfolio.about);
      setAboutForm({
        title: portfolio.about?.title || '',
        subtitle: portfolio.about?.subtitle || '',
        description: portfolio.about?.description || '',
        paragraph1: portfolio.about?.paragraph1 || '',
        paragraph2: portfolio.about?.paragraph2 || '',
        paragraph3: portfolio.about?.paragraph3 || '',
        skills: portfolio.about?.skills || [],
        image: portfolio.about?.profileImage || ''
      })
    }
    fetchData();
  }, []);
  console.log(aboutForm.skills);

  return (
    <section id="about" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {aboutForm.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {aboutForm.subtitle}
            </p>
          </div>

          {/* About content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                {aboutForm.description}
              </p>
              {aboutForm.paragraph1 && (
                <p className="text-lg text-foreground leading-relaxed">
                  {aboutForm.paragraph1}
                </p>
              )}
              {aboutForm.paragraph2 && (
                <p className="text-lg text-foreground leading-relaxed">
                  {aboutForm.paragraph2}
                </p>
              )}
              {aboutForm.paragraph3 && (
                <p className="text-lg text-foreground leading-relaxed">
                  {aboutForm.paragraph3}
                </p>
              )}
            </div>

            <div className="relative">
              <img src={aboutForm.image} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
            </div>
          </div>

          {/* Skills grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutForm.skills.map((skill, index) => (
              <Card
                key={index}
                className="group hover:shadow-glow-secondary transition-all duration-300 hover:scale-105 bg-card border-border"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {skill.icon ? (
                      <img src={skill.icon} alt={skill.title} className="w-8 h-8 object-contain" />
                    ) : null}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {skill.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;