import {
    Home,
    Info,
    BookOpen,
    Mail,
    HelpCircle,
    Shield,
    ShieldAlert,
    Briefcase,
    FileText,
    Minus,
    Settings,
    Map,
    Rows,
    Users,
    Palette,
    Layers,
    Target
} from 'lucide-react';
import { Image, Rocket } from 'lucide-react';
import { FiSearch } from 'react-icons/fi';
import { GrDashboard } from 'react-icons/gr';

export interface Route {
    path: string;
    label: string;
    icon: any;
    subItems?: {
        path: string;
        label: string;
    }[];
}

export const routes: Route[] = [
    {
        path: '/admin/dashboard',
        label: 'Dashboard',
        icon: GrDashboard
    },
    {
        path: '/admin/home',
        label: 'Home',
        icon: Home
    },
    {
        path: '/admin/about',
        label: 'About',
        icon: Info
    },
    {
        path: '/admin/states',
        label: 'States',
        icon: Map
    },
    // {
    //     path: '/admin/case-studies',
    //     label: 'Case Studies',
    //     icon: Target
    // },
    {
        path: '/admin/contact',
        label: 'Contact',
        icon: Mail
    },
    {
        path: '/admin/faq',
        label: 'FAQ',
        icon: HelpCircle
    },
    {
        path: '/admin/footer',
        label: 'Footer',
        icon: Rows
    },
    {
        path: '/admin/sitemap',
        label: 'Sitemap',
        icon: Map
    },

    {
        path: '/admin/media',
        label: 'Media Library',
        icon: Image
    },
    {
        path: '/admin/user',
        label: 'User Management',
        icon: Users
    },
    {
        path: '#',
        label: 'Policies',
        icon: Shield,
        subItems: [
            {
                path: '/admin/privacy',
                label: 'Privacy Policy',
            },
            {
                path: '/admin/terms-of-condition',
                label: 'Terms of Condition',
            },
            {
                path: '/admin/hipaa-compliance',
                label: 'HIPAA Compliance',
            },
            {
                path: '/admin/security-policy',
                label: 'Security Policy',
            },
        ]
    }, {
        path: '#',
        label: 'Services',
        icon: Briefcase,
        subItems: [
            {
                path: '/admin/services',
                label: 'Services',
            },
            {
                path: '/admin/services/categories',
                label: 'Service Categories',
            },
        ]
    },
    {
        path: '#',
        label: 'Blog',
        icon: BookOpen,
        subItems: [
            {
                path: '/admin/blog/posts',
                label: 'Blog Posts',
            },
            {
                path: '/admin/blog/categories',
                label: 'Blog Categories',
            },
            {
                path: '/admin/blog/seo',
                label: 'Blog Index SEO',
            },
        ]
    },
    {
        path: '#',
        label: 'Settings',
        icon: Settings,
        subItems: [
            {
                path: '/admin/smtp-config',
                label: 'Mail Config',
            },
            {
                path: '/admin/settings/theme',
                label: 'Theme',
            },
            {
                path: '/admin/settings',
                label: 'Admin Settings',
            },
        ]
    },
];
