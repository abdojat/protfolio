import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Mail, MapPin, Phone, Send } from "../components/icons";
import { useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import { submitContact, getPortfolioData } from "../services/api";

interface ContactInfo {
    icon: string;
    title: string;
    value: string;
    href: string;
}

interface ContactData {
    title: string;
    subtitle: string;
    description: string;
    contactInfo: ContactInfo[];
    responseTime: string;
}

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [contactData, setContactData] = useState<ContactData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const portfolioData = await getPortfolioData();
                setContactData(portfolioData.contact);
            } catch (error) {
                console.error('Error fetching contact data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContactData();
    }, []);

    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'Mail':
                return Mail;
            case 'Phone':
                return Phone;
            case 'MapPin':
                return MapPin;
            default:
                return Mail;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            await submitContact(formData);
            toast({
                title: "Message sent!",
                description: "Thank you for your message. I'll get back to you soon.",
                type: "success",
            });
            setFormData({ name: '', email: '', message: '' });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 4000);
        } catch (error: any) {
            console.error('Error submitting contact form:', error);
            
            // Handle validation errors from backend
            if (error.response?.data?.errors) {
                const firstError = error.response.data.errors[0];
                toast({
                    title: "Validation Error",
                    description: firstError.msg,
                    type: "error",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to send message. Please try again.",
                    type: "error",
                });
            }
        }
    };


    if (isLoading) {
        return (
            <section id="contact" className="py-20 bg-secondary/50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-20 bg-secondary/50">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                            {contactData?.title}
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {contactData?.subtitle}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact form */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-2xl text-foreground">Send a Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-foreground">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Your name"
                                            className="bg-background border-border focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-foreground">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your.email@example.com"
                                            className="bg-background border-border focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-foreground">Message</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Tell me about your project..."
                                            rows={6}
                                            className="bg-background border-border focus:ring-primary resize-none"
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                                        size="lg"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </Button>
                                    {showSuccess && (
                                        <p className="text-green-600 text-center text-sm pt-2">
                                            Your message has been sent successfully.
                                        </p>
                                    )}
                                </form>
                            </CardContent>
                        </Card>

                        {/* Contact info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-semibold mb-4 text-foreground">Let's Connect</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {contactData?.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {contactData?.contactInfo?.map((info, index) => {
                                    const IconComponent = getIconComponent(info.icon);
                                    return (
                                        <Card key={index} className="bg-card border-border hover:shadow-glow-secondary transition-all duration-300">
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                                                        <IconComponent className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{info.title}</p>
                                                        {info.href === "#" ? (
                                                            <p className="text-muted-foreground">{info.value}</p>
                                                        ) : (
                                                            <a
                                                                href={info.href}
                                                                className="text-primary hover:text-primary/80 transition-colors duration-300"
                                                            >
                                                                {info.value}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            <div className="pt-4">
                                <p className="text-muted-foreground text-sm">
                                    {contactData?.responseTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;