import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Users, Settings, Shield, LogOut, Plus, Trash2, Edit, Mail, Code, Heart, Clock, Eye, Reply } from './icons';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  frontendUrl: string;
  backendUrl: string;
  liveUrl: string;
  image: string;
  featured: boolean;
  order: number;
}

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}

const SuperAdmin: React.FC = () => {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalProjects: 0,
    totalSkills: 0,
    recentActivity: 0
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  // Uploading states
  const [isUploadingProjectImage, setIsUploadingProjectImage] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isUploadingSkillIcon, setIsUploadingSkillIcon] = useState(false);

  // Form states
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    cvUrl: '',
    github: '',
    linkedin: '',
    email: ''
  });

  const [aboutForm, setAboutForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    paragraph1: '',
    paragraph2: '',
    paragraph3: '',
    skills: [],
    image: ''
  });

  const [contactForm, setContactForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    responseTime: '',
    contactInfo: []
  });

  // Contact info management states
  const [isAddContactInfoModalOpen, setIsAddContactInfoModalOpen] = useState(false);
  const [editingContactInfo, setEditingContactInfo] = useState<any>(null);
  const [contactInfoForm, setContactInfoForm] = useState({
    icon: '',
    title: '',
    value: '',
    href: ''
  });
  const [contactInfoErrors, setContactInfoErrors] = useState<{ [k: string]: string }>({});

  // Footer management states
  const [footerForm, setFooterForm] = useState({
    copyright: '',
    description: '',
    additionalLinks: []
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    frontendUrl: '',
    backendUrl: '',
    image: '',
    featured: false,
    order: 0,
  });
  const [projectErrors, setProjectErrors] = useState<{ [k: string]: string }>({});

  // Skills management states
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState({
    icon: '',
    title: '',
    description: ''
  });
  const [skillErrors, setSkillErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [messageFilter]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };


      // Fetch stats and data
      const [statsRes, portfolioRes, messagesRes, adminsRes] = await Promise.all([
        api.get('/admin/dashboard', { headers }),
        api.get('/portfolio', { headers }),
        api.get('/contact', { headers }),
        api.get('/admin/admins', { headers })
      ]);

      if (statsRes.data.success) {
        const dashboardData = statsRes.data.data;
        setStats({
          totalMessages: dashboardData.contactStats.total || 0,
          totalProjects: dashboardData.portfolio.projectsCount || 0,
          totalSkills: dashboardData.portfolio.skillsCount || 0,
          recentActivity: dashboardData.contactStats.recent || 0
        });
      }

      if (portfolioRes.data.success) {
        const portfolio = portfolioRes.data.data;
        setHeroForm({
          title: portfolio.hero?.title || '',
          subtitle: portfolio.hero?.subtitle || '',
          description: portfolio.hero?.description || '',
          cvUrl: portfolio.hero?.cvUrl || '',
          github: portfolio.hero?.socialLinks?.github || '',
          linkedin: portfolio.hero?.socialLinks?.linkedin || '',
          email: portfolio.hero?.socialLinks?.email || ''
        });

        setAboutForm({
          title: portfolio.about?.title || '',
          subtitle: portfolio.about?.subtitle || '',
          description: portfolio.about?.description || '',
          paragraph1: portfolio.about?.paragraph1 || '',
          paragraph2: portfolio.about?.paragraph2 || '',
          paragraph3: portfolio.about?.paragraph3 || '',
          skills: portfolio.about?.skills || [],
          image: portfolio.about?.profileImage || ''
        });

        setContactForm({
          title: portfolio.contact?.title || '',
          subtitle: portfolio.contact?.subtitle || '',
          description: portfolio.contact?.description || '',
          responseTime: portfolio.contact?.responseTime || '',
          contactInfo: portfolio.contact?.contactInfo || []
        });

        setProjects(portfolio.projects?.items || []);
        setSkills(portfolio.about?.skills || []);

        setFooterForm({
          copyright: portfolio.footer?.copyright || '',
          description: portfolio.footer?.description || '',
          additionalLinks: portfolio.footer?.additionalLinks || []
        });
      }

      if (messagesRes.data.success) {
        setMessages(messagesRes.data.data);
      }

      if (adminsRes.data.success) {
        setAdmins(adminsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const params = new URLSearchParams();
      if (messageFilter !== 'all') {
        params.append('status', messageFilter);
      }

      const response = await api.get(`/contact?${params.toString()}`, { headers });
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Form submission handlers
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await api.put('/admin/portfolio/hero', {
        title: heroForm.title,
        subtitle: heroForm.subtitle,
        description: heroForm.description,
        cvUrl: heroForm.cvUrl,
        socialLinks: {
          github: heroForm.github,
          linkedin: heroForm.linkedin,
          email: heroForm.email
        }
      }, { headers });

      alert('Hero section updated successfully!');
    } catch (error) {
      console.error('Error updating hero section:', error);
      alert('Failed to update hero section');
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await api.put('/admin/portfolio/about', {
        title: aboutForm.title,
        subtitle: aboutForm.subtitle,
        description: aboutForm.description,
        paragraph1: aboutForm.paragraph1,
        paragraph2: aboutForm.paragraph2,
        paragraph3: aboutForm.paragraph3,
        skills: aboutForm.skills,
        profileImage: aboutForm.image
      }, { headers });

      alert('About section updated successfully!');
    } catch (error) {
      console.error('Error updating about section:', error);
      alert('Failed to update about section');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await api.put('/admin/portfolio/contact', {
        title: contactForm.title,
        subtitle: contactForm.subtitle,
        description: contactForm.description,
        responseTime: contactForm.responseTime
      }, { headers });

      alert('Contact section updated successfully!');
    } catch (error) {
      console.error('Error updating contact section:', error);
      alert('Failed to update contact section');
    }
  };

  const openAddProjectModal = () => {
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      frontendUrl: '',
      backendUrl: '',
      image: '',
      featured: false,
      order: 0,
    });
    setProjectErrors({});
    setEditingProject(null);
    setIsAddModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setProjectForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      liveUrl: project.liveUrl || '',
      frontendUrl: project.frontendUrl || '',
      backendUrl: project.backendUrl || '',
      image: project.image || '',
      featured: project.featured,
      order: project.order,
    });
    setProjectErrors({});
    setEditingProject(project);
    setIsAddModalOpen(true);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/admin/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data?.success && response.data?.data?.url) {
      return response.data.data.url as string;
    }
    return response.data?.imageUrl || response.data?.url || '';
  };

  const submitAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    const errs: { [k: string]: string } = {};
    if (!projectForm.title.trim()) errs.title = 'Title is required';
    if (!projectForm.description.trim()) errs.description = 'Description is required';

    setProjectErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingProject) {
        // Update existing project
        await api.put(`/admin/portfolio/projects/${editingProject._id}`, {
          title: projectForm.title.trim(),
          description: projectForm.description.trim(),
          technologies: projectForm.technologies
            ? projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
            : [],
          liveUrl: projectForm.liveUrl || undefined,
          frontendUrl: projectForm.frontendUrl || undefined,
          backendUrl: projectForm.backendUrl || undefined,
          image: projectForm.image || undefined,
          featured: !!projectForm.featured,
          order: Number(projectForm.order) || 0,
        }, { headers });
        alert('Project updated successfully!');
      } else {
        // Add new project
        await api.post('/admin/portfolio/projects', {
          title: projectForm.title.trim(),
          description: projectForm.description.trim(),
          technologies: projectForm.technologies
            ? projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
            : [],
          liveUrl: projectForm.liveUrl || undefined,
          frontendUrl: projectForm.frontendUrl || undefined,
          backendUrl: projectForm.backendUrl || undefined,
          image: projectForm.image || undefined,
          featured: !!projectForm.featured,
          order: Number(projectForm.order) || 0,
        }, { headers });
        alert('Project added successfully!');
      }

      setIsAddModalOpen(false);
      fetchData(); // refresh list
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        await api.delete(`/admin/portfolio/projects/${projectId}`, { headers });

        alert('Project deleted successfully!');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        await api.delete(`/contact/${messageId}`, { headers });

        alert('Message deleted successfully!');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message');
      }
    }
  };

  const handleUpdateMessageStatus = async (messageId: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await api.put(`/contact/${messageId}`, { status }, { headers });

      // Update the message in the local state
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, status } : msg
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status');
    }
  };

  // Skills management functions
  const openAddSkillModal = () => {
    setSkillForm({
      icon: '',
      title: '',
      description: ''
    });
    setSkillErrors({});
    setEditingSkill(null);
    setIsAddSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: Skill) => {
    setSkillForm({
      icon: skill.icon,
      title: skill.title,
      description: skill.description
    });
    setSkillErrors({});
    setEditingSkill(skill);
    setIsAddSkillModalOpen(true);
  };

  const submitSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const errs: { [k: string]: string } = {};
    if (!skillForm.icon.trim()) errs.icon = 'Icon is required';
    if (!skillForm.title.trim()) errs.title = 'Title is required';
    if (!skillForm.description.trim()) errs.description = 'Description is required';

    setSkillErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingSkill) {
        // Update existing skill
        await api.put(`/admin/portfolio/skills/${editingSkill._id}`, {
          icon: skillForm.icon.trim(),
          title: skillForm.title.trim(),
          description: skillForm.description.trim()
        }, { headers });
        alert('Skill updated successfully!');
      } else {
        // Add new skill
        await api.post('/admin/portfolio/skills', {
          icon: skillForm.icon.trim(),
          title: skillForm.title.trim(),
          description: skillForm.description.trim()
        }, { headers });
        alert('Skill added successfully!');
      }

      setIsAddSkillModalOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill');
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        await api.delete(`/admin/portfolio/skills/${skillId}`, { headers });

        alert('Skill deleted successfully!');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill');
      }
    }
  };

  // Contact info management functions
  const openAddContactInfoModal = () => {
    setContactInfoForm({
      icon: '',
      title: '',
      value: '',
      href: ''
    });
    setContactInfoErrors({});
    setEditingContactInfo(null);
    setIsAddContactInfoModalOpen(true);
  };

  const openEditContactInfoModal = (contactInfo: any) => {
    setContactInfoForm({
      icon: contactInfo.icon,
      title: contactInfo.title,
      value: contactInfo.value,
      href: contactInfo.href
    });
    setContactInfoErrors({});
    setEditingContactInfo(contactInfo);
    setIsAddContactInfoModalOpen(true);
  };

  const submitContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const errs: { [k: string]: string } = {};
    if (!contactInfoForm.icon.trim()) errs.icon = 'Icon is required';
    if (!contactInfoForm.title.trim()) errs.title = 'Title is required';
    if (!contactInfoForm.value.trim()) errs.value = 'Value is required';

    setContactInfoErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingContactInfo) {
        // Update existing contact info - find the index
        const index = contactForm.contactInfo.findIndex((info: any) => info === editingContactInfo);
        await api.put(`/admin/portfolio/contact-info/${index}`, {
          icon: contactInfoForm.icon.trim(),
          title: contactInfoForm.title.trim(),
          value: contactInfoForm.value.trim(),
          href: contactInfoForm.href.trim()
        }, { headers });
        alert('Contact info updated successfully!');
      } else {
        // Add new contact info
        await api.post('/admin/portfolio/contact-info', {
          icon: contactInfoForm.icon.trim(),
          title: contactInfoForm.title.trim(),
          value: contactInfoForm.value.trim(),
          href: contactInfoForm.href.trim()
        }, { headers });
        alert('Contact info added successfully!');
      }

      setIsAddContactInfoModalOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to save contact info');
    }
  };

  const handleDeleteContactInfo = async (contactInfo: any, index: number) => {
    if (window.confirm('Are you sure you want to delete this contact info?')) {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        await api.delete(`/admin/portfolio/contact-info/${index}`, { headers });

        alert('Contact info deleted successfully!');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting contact info:', error);
        alert('Failed to delete contact info');
      }
    }
  };

  // Footer management functions
  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await api.put('/admin/portfolio/footer', {
        copyright: footerForm.copyright,
        description: footerForm.description,
        additionalLinks: footerForm.additionalLinks
      }, { headers });

      alert('Footer updated successfully!');
    } catch (error) {
      console.error('Error updating footer:', error);
      alert('Failed to update footer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-800">Portfolio Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{admin?.name}</span>
              <Button onClick={handleLogout} variant="outline" className="text-slate-600 hover:text-slate-700 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50">
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: 'tachometer-alt' },
              { id: 'hero', name: 'Hero Section', icon: 'star' },
              { id: 'about', name: 'About Section', icon: 'user' },
              { id: 'projects', name: 'Projects', icon: 'code' },
              { id: 'contact', name: 'Contact', icon: 'envelope' },
              { id: 'footer', name: 'Footer', icon: 'footer' },
              { id: 'messages', name: 'Messages', icon: 'inbox' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-blue-400 text-blue-600' : ''
                  }`}
              >
                <i className={`fas fa-${tab.icon} mr-2`}></i>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Mail className="text-2xl text-sky-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-slate-500 truncate">Total Messages</dt>
                        <dd className="text-lg font-medium text-slate-800">{stats.totalMessages}</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Code className="text-2xl text-emerald-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-slate-500 truncate">Projects</dt>
                        <dd className="text-lg font-medium text-slate-800">{stats.totalProjects}</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Heart className="text-2xl text-rose-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-slate-500 truncate">Skills</dt>
                        <dd className="text-lg font-medium text-slate-800">{stats.totalSkills}</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="text-2xl text-amber-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-slate-500 truncate">Recent Activity</dt>
                        <dd className="text-lg font-medium text-slate-800">{stats.recentActivity}</dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hero Tab */}
          {activeTab === 'hero' && (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-800">Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleHeroSubmit} className="space-y-4">
                  <div>
                    <Label className="text-slate-700">Title</Label>
                    <Input
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                      className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Subtitle</Label>
                    <Input
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Description</Label>
                    <Textarea
                      value={heroForm.description}
                      onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                      rows={3}
                      className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">CV Download URL</Label>
                    <Input
                      type="url"
                      value={heroForm.cvUrl}
                      onChange={(e) => setHeroForm({ ...heroForm, cvUrl: e.target.value })}
                      placeholder="https://example.com/cv.pdf"
                      className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-700">GitHub URL</Label>
                      <Input
                        type="url"
                        value={heroForm.github}
                        onChange={(e) => setHeroForm({ ...heroForm, github: e.target.value })}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">LinkedIn URL</Label>
                      <Input
                        type="url"
                        value={heroForm.linkedin}
                        onChange={(e) => setHeroForm({ ...heroForm, linkedin: e.target.value })}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Email</Label>
                      <Input
                        type="email"
                        value={heroForm.email}
                        onChange={(e) => setHeroForm({ ...heroForm, email: e.target.value })}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* About Section Form */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-800">About Section</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleAboutSubmit} className="space-y-4">
                    <div>
                      <Label className="text-slate-700">Title</Label>
                      <Input
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Subtitle</Label>
                      <Input
                        value={aboutForm.subtitle}
                        onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Description</Label>
                      <Textarea
                        value={aboutForm.description}
                        onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                        rows={4}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Paragraph 1</Label>
                      <Textarea
                        value={aboutForm.paragraph1}
                        onChange={(e) => setAboutForm({ ...aboutForm, paragraph1: e.target.value })}
                        rows={3}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                        placeholder="My journey in web development started with a curiosity..."
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Paragraph 2</Label>
                      <Textarea
                        value={aboutForm.paragraph2}
                        onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })}
                        rows={3}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                        placeholder="When I'm not coding, you can find me exploring..."
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Paragraph 3</Label>
                      <Textarea
                        value={aboutForm.paragraph3}
                        onChange={(e) => setAboutForm({ ...aboutForm, paragraph3: e.target.value })}
                        rows={3}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                        placeholder="Additional paragraph content..."
                      />
                    </div>
                    <div>
                    <Label className="text-slate-700">Profile Image</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            setIsUploadingProfileImage(true);
                            const url = await uploadImage(file);
                            setAboutForm({ ...aboutForm, image: url });
                          } catch {
                            alert('Failed to upload image');
                          } finally {
                            setIsUploadingProfileImage(false);
                          }
                        }}
                        className="border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                      <Input
                        type="url"
                        value={aboutForm.image}
                        onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.value })}
                        placeholder="or paste an image URL"
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    {isUploadingProfileImage && (
                      <p className="text-xs text-slate-500 mt-1">Uploading image...</p>
                    )}
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Skills Management */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-slate-800">Skills Management</CardTitle>
                    <Button onClick={openAddSkillModal} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((skill) => (
                      <div key={skill._id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {skill.icon && (
                              <img 
                                src={skill.icon} 
                                alt={skill.title} 
                                className="w-6 h-6 object-contain filter brightness-0 invert"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-slate-300 text-slate-600 hover:bg-slate-100 p-1"
                              onClick={() => openEditSkillModal(skill)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-200 text-rose-500 hover:bg-rose-50 p-1"
                              onClick={() => handleDeleteSkill(skill._id!)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-medium text-slate-800 mb-1">{skill.title}</h3>
                        <p className="text-sm text-slate-600">{skill.description}</p>
                      </div>
                    ))}
                  </div>
                  {skills.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No skills added yet. Click "Add Skill" to get started.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-slate-800">Projects</CardTitle>
                  <Button onClick={openAddProjectModal} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div>
                        <h3 className="font-medium text-slate-800">{project.title}</h3>
                        <p className="text-sm text-slate-600">{project.description}</p>
                        <p className="text-xs text-slate-500">Technologies: {project.technologies.join(', ')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-300 text-slate-600 hover:bg-slate-100"
                          onClick={() => openEditProjectModal(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-rose-200 text-rose-500 hover:bg-rose-50"
                          onClick={() => handleDeleteProject(project._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Contact Section Form */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-800">Contact Section</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Label className="text-slate-700">Title</Label>
                      <Input
                        value={contactForm.title}
                        onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Subtitle</Label>
                      <Input
                        value={contactForm.subtitle}
                        onChange={(e) => setContactForm({ ...contactForm, subtitle: e.target.value })}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Description</Label>
                      <Textarea
                        value={contactForm.description}
                        onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                        rows={3}
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Response Time</Label>
                      <Input
                        value={contactForm.responseTime}
                        onChange={(e) => setContactForm({ ...contactForm, responseTime: e.target.value })}
                        placeholder="e.g., Typically responds within 24 hours"
                        className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info Management */}
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-slate-800">Contact Information</CardTitle>
                    <Button onClick={openAddContactInfoModal} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Contact Info
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contactForm.contactInfo?.map((info: any, index: number) => (
                      <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{info.icon}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-slate-300 text-slate-600 hover:bg-slate-100 p-1"
                              onClick={() => openEditContactInfoModal(info)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-200 text-rose-500 hover:bg-rose-50 p-1"
                              onClick={() => handleDeleteContactInfo(info, index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-medium text-slate-800 mb-1">{info.title}</h3>
                        <p className="text-sm text-slate-600">{info.value}</p>
                        {info.href && info.href !== '#' && (
                          <a 
                            href={info.href} 
                            className="text-xs text-blue-600 hover:underline mt-1 block"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {info.href}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  {(!contactForm.contactInfo || contactForm.contactInfo.length === 0) && (
                    <div className="text-center py-8 text-slate-500">
                      No contact information added yet. Click "Add Contact Info" to get started.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === 'footer' && (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-800">Footer Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleFooterSubmit} className="space-y-4">
                  <div>
                    <Label className="text-slate-700">Copyright Text</Label>
                    <Input
                      value={footerForm.copyright}
                      onChange={(e) => setFooterForm({ ...footerForm, copyright: e.target.value })}
                      placeholder="e.g., © 2024 Your Name. All rights reserved."
                      className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Description</Label>
                    <Textarea
                      value={footerForm.description}
                      onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
                      rows={3}
                      placeholder="e.g., Building digital experiences with passion and precision."
                      className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <CardTitle className="text-slate-800">Contact Messages</CardTitle>
                  <div className="flex space-x-2">
                    <select
                      value={messageFilter}
                      onChange={(e) => setMessageFilter(e.target.value as 'all' | 'unread' | 'read' | 'replied')}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 hover:border-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors cursor-pointer min-w-[140px] w-full sm:w-auto"
                    >
                      <option value="all">All Messages</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {messages
                    .filter(message => messageFilter === 'all' || message.status === messageFilter)
                    .map((message) => (
                    <div key={message._id} className={`p-4 border rounded-lg transition-colors ${
                      message.status === 'unread' 
                        ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' 
                        : message.status === 'replied'
                        ? 'border-green-200 bg-green-50 hover:bg-green-100'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-slate-800">{message.name}</h3>
                            <Badge 
                              variant={message.status === 'unread' ? 'default' : message.status === 'replied' ? 'secondary' : 'outline'}
                              className={`text-xs ${
                                message.status === 'unread' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : message.status === 'replied'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {message.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            <a href={`mailto:${message.email}`} className="hover:text-blue-600">
                              {message.email}
                            </a>
                          </p>
                          <p className="text-sm text-slate-700 mb-3">{message.message}</p>
                          <div className="text-xs text-slate-500">
                            Received: {formatDate(message.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end space-y-2 sm:ml-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className={`border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:outline-none transition-all duration-200 px-3 py-2 ${
                                message.status === 'read' ? 'bg-slate-100 border-slate-400' : ''
                              }`}
                              onClick={() => handleUpdateMessageStatus(message._id, 'read')}
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`border-green-300 text-green-600 hover:bg-green-100 hover:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all duration-200 px-3 py-2 ${
                                message.status === 'replied' ? 'bg-green-100 border-green-400' : ''
                              }`}
                              onClick={() => handleUpdateMessageStatus(message._id, 'replied')}
                              title="Mark as replied"
                            >
                              <Reply className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-300 text-rose-600 hover:bg-rose-100 hover:border-rose-400 focus:ring-2 focus:ring-rose-100 focus:outline-none transition-all duration-200 px-3 py-2"
                              onClick={() => handleDeleteMessage(message._id)}
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {messages.filter(message => messageFilter === 'all' || message.status === messageFilter).length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No messages found for the selected filter.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsAddModalOpen(false)}
            aria-hidden="true"
          />
          {/* Modal */}
          <div className="relative z-[1001] w-full max-w-2xl rounded-xl bg-white shadow-xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitAddProject} className="p-6 space-y-4">
              <div>
                <Label className="text-slate-700">Title *</Label>
                <Input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className={`border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${projectErrors.title ? 'border-rose-300' : ''}`}
                  placeholder="e.g., Real Estate Finder"
                />
                {projectErrors.title && <p className="text-rose-500 text-xs mt-1">{projectErrors.title}</p>}
              </div>

              <div>
                <Label className="text-slate-700">Description *</Label>
                <Textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className={`border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${projectErrors.description ? 'border-rose-300' : ''}`}
                  placeholder="Short summary of the project..."
                />
                {projectErrors.description && <p className="text-rose-500 text-xs mt-1">{projectErrors.description}</p>}
              </div>

              <div>
                <Label className="text-slate-700">Technologies (comma-separated)</Label>
                <Input
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                  placeholder="React, Tailwind, Node.js"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700">Live URL</Label>
                  <Input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    className="border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label className="text-slate-700">Frontend URL</Label>
                  <Input
                    type="url"
                    value={projectForm.frontendUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, frontendUrl: e.target.value })}
                    className="border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    placeholder="https://github.com/you/frontend"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">Backend URL</Label>
                  <Input
                    type="url"
                    value={projectForm.backendUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, backendUrl: e.target.value })}
                    className="border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    placeholder="https://github.com/you/backend"
                  />
                </div>
                <div>
                  <Label className="text-slate-700">Project Image</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setIsUploadingProjectImage(true);
                          const url = await uploadImage(file);
                          setProjectForm({ ...projectForm, image: url });
                        } catch {
                          alert('Failed to upload image');
                        } finally {
                          setIsUploadingProjectImage(false);
                        }
                      }}
                      className="border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    />
                    <Input
                      type="url"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      placeholder="or paste an image URL"
                      className="border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    />
                  </div>
                  {isUploadingProjectImage && (
                    <p className="text-xs text-slate-500 mt-1">Uploading image...</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-slate-700">Featured</span>
                </label>

                <div>
                  <Label className="text-slate-700">Order</Label>
                  <Input
                    type="number"
                    value={projectForm.order}
                    onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                    className="border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Optional image preview */}
              {projectForm.image ? (
                <div className="pt-2">
                  <img
                    alt="Preview"
                    src={projectForm.image}
                    className="max-h-40 rounded-md border border-slate-200"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                </div>
              ) : null}

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {editingProject ? 'Update Project' : 'Save Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skills Modal */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsAddSkillModalOpen(false)}
            aria-hidden="true"
          />
          {/* Modal */}
          <div className="relative z-[1001] w-full max-w-lg rounded-xl bg-white shadow-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingSkill ? 'Edit Skill' : 'Add Skill'}
              </h3>
              <button
                onClick={() => setIsAddSkillModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitSkill} className="p-6 space-y-4">
              <div>
                <Label className="text-slate-700">Icon *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setIsUploadingSkillIcon(true);
                        const url = await uploadImage(file);
                        setSkillForm({ ...skillForm, icon: url });
                      } catch {
                        alert('Failed to upload icon');
                      } finally {
                        setIsUploadingSkillIcon(false);
                      }
                    }}
                    className={`border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${skillErrors.icon ? 'border-rose-300' : ''}`}
                  />
                  <Input
                    type="url"
                    value={skillForm.icon}
                    onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                    placeholder="or paste an icon URL"
                    className={`border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${skillErrors.icon ? 'border-rose-300' : ''}`}
                  />
                </div>
                {isUploadingSkillIcon && (
                  <p className="text-xs text-slate-500 mt-1">Uploading icon...</p>
                )}
                {skillErrors.icon && <p className="text-rose-500 text-xs mt-1">{skillErrors.icon}</p>}
              </div>

              <div>
                <Label className="text-slate-700">Title *</Label>
                <Input
                  value={skillForm.title}
                  onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                  className={`border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${skillErrors.title ? 'border-rose-300' : ''}`}
                  placeholder="e.g., Frontend Development"
                />
                {skillErrors.title && <p className="text-rose-500 text-xs mt-1">{skillErrors.title}</p>}
              </div>

              <div>
                <Label className="text-slate-700">Description *</Label>
                <Textarea
                  rows={3}
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  className={`border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${skillErrors.description ? 'border-rose-300' : ''}`}
                  placeholder="e.g., React, TypeScript, Tailwind CSS, Next.js"
                />
                {skillErrors.description && <p className="text-rose-500 text-xs mt-1">{skillErrors.description}</p>}
              </div>

              {/* Optional icon preview */}
              {skillForm.icon && (
                <div className="pt-2">
                  <Label className="text-slate-700 text-sm">Preview:</Label>
                  <div className="mt-2 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <img
                      alt="Preview"
                      src={skillForm.icon}
                      className="w-8 h-8 object-contain filter brightness-0 invert"
                      onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsAddSkillModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {editingSkill ? 'Update Skill' : 'Add Skill'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Info Modal */}
      {isAddContactInfoModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsAddContactInfoModalOpen(false)}
            aria-hidden="true"
          />
          {/* Modal */}
          <div className="relative z-[1001] w-full max-w-lg rounded-xl bg-white shadow-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingContactInfo ? 'Edit Contact Info' : 'Add Contact Info'}
              </h3>
              <button
                onClick={() => setIsAddContactInfoModalOpen(false)}
                className="text-slate-500 hover:text-slate-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitContactInfo} className="p-6 space-y-4">
              <div>
                <Label className="text-slate-700">Icon *</Label>
                <Input
                  value={contactInfoForm.icon}
                  onChange={(e) => setContactInfoForm({ ...contactInfoForm, icon: e.target.value })}
                  className={`border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${contactInfoErrors.icon ? 'border-rose-300' : ''}`}
                  placeholder="e.g., Mail, Phone, MapPin"
                />
                {contactInfoErrors.icon && <p className="text-rose-500 text-xs mt-1">{contactInfoErrors.icon}</p>}
              </div>

              <div>
                <Label className="text-slate-700">Title *</Label>
                <Input
                  value={contactInfoForm.title}
                  onChange={(e) => setContactInfoForm({ ...contactInfoForm, title: e.target.value })}
                  className={`border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${contactInfoErrors.title ? 'border-rose-300' : ''}`}
                  placeholder="e.g., Email, Phone, Location"
                />
                {contactInfoErrors.title && <p className="text-rose-500 text-xs mt-1">{contactInfoErrors.title}</p>}
              </div>

              <div>
                <Label className="text-slate-700">Value *</Label>
                <Input
                  value={contactInfoForm.value}
                  onChange={(e) => setContactInfoForm({ ...contactInfoForm, value: e.target.value })}
                  className={`border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1 ${contactInfoErrors.value ? 'border-rose-300' : ''}`}
                  placeholder="e.g., your.email@example.com, +1234567890, City, Country"
                />
                {contactInfoErrors.value && <p className="text-rose-500 text-xs mt-1">{contactInfoErrors.value}</p>}
              </div>

              <div>
                <Label className="text-slate-700">Link (optional)</Label>
                <Input
                  value={contactInfoForm.href}
                  onChange={(e) => setContactInfoForm({ ...contactInfoForm, href: e.target.value })}
                  className="border-slate-200 bg-white text-slate-800 focus:border-blue-400 focus:ring-blue-400 focus:ring-1"
                  placeholder="e.g., mailto:your.email@example.com, tel:+1234567890, #"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use "mailto:" for email links, "tel:" for phone links, or "#" for no link
                </p>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsAddContactInfoModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {editingContactInfo ? 'Update Contact Info' : 'Add Contact Info'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
