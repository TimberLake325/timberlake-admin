import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

// Minimal Schema Definitions for Seeding
const seoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String] },
    image: { type: String },
    canonicalUrl: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    ogUrl: { type: String },
    ogType: { type: String, default: "website" },
}, { _id: false });

const homePageSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    metadata: { type: seoSchema, required: true },
    sections: [
        {
            type: { type: String, required: true },
            order: { type: Number, required: true, min: 1 },
            content: { type: mongoose.Schema.Types.Mixed, required: true }
        }
    ]
}, { timestamps: true });

const HomePage = mongoose.models.HomePage || mongoose.model('HomePage', homePageSchema);

const HOME_DATA = {
    metaData: {
        title: "Medical Billing & RCM Services",
        description: "Elite RCM solutions for high-complexity practices. HIPAA-compliant workflows and AAPC certified experts for medical billing and credentialing.",
        keywords: ["medical billing", "RCM services", "credentialing", "HIPAA compliant", "AAPC certified"],
        image: "/og-image.jpg"
    },
    sections: [
        {
            type: 'HERO',
            order: 1,
            content: {
                headline: "Medical Billing & Credentialing <span class='text-primary'>Services</span>.",
                subheading: "Elite RCM solutions for high-complexity practices. We bridge the gap between <strong>clinical excellence</strong> and <strong>financial performance</strong> with certified HIPAA-compliant workflows.",
                primaryCta: { label: "Start Your Audit", link: "/contact" },
                secondaryCta: { label: "Explore Specialties", link: "/services" }
            }
        },
        {
            type: 'CERTIFICATIONS',
            order: 2,
            content: {
                title: "Enterprise Standards",
                subtitle: "Compliance Framework",
                items: [
                    { name: "HIPAA Compliant", description: "PHI Data Privacy Standards", iconName: "LucideShieldCheck", tag: "Certified", tagVariant: "primary" },
                    { name: "AAPC Certified", description: "CPC/COC Professional Coding", iconName: "LucideAward", tag: "Verified", tagVariant: "success" },
                    { name: "SOC 2 Type II", description: "Security & Confidentiality", iconName: "LucideLock", tag: "Active", tagVariant: "info" },
                    { name: "ISO 27001", description: "Information Security Management", iconName: "LucideShieldCheck", tag: "Certified", tagVariant: "primary" }
                ]
            }
        },
        {
            type: 'COMPANY_STATS',
            order: 3,
            content: {
                stats: [
                    { label: "Clean Claims Rate", value: "99.2%", description: "Industry-leading accuracy" },
                    { label: "Revenue Recovered", value: "$2.4M+", description: "For our clients annually" },
                    { label: "Medical Specialties", value: "40+", description: "Supported expertise" },
                    { label: "Avg. Claim Resolution", value: "<24h", description: "Faster than industry standard" }
                ]
            }
        },
        {
            type: 'WHAT_WE_DO',
            order: 4,
            content: {
                title: "Revenue Cycle Solutions",
                description: "We bridge the gap between clinical documentation and financial reimbursement with end-to-end management built for high-performance practices.",
                serviceIds: [], // Will be empty initially, can be populated in admin
                cta: { label: "View Full Capability Statement", link: "/services" },
                logos: [
                    { name: "Medical Coding & Auditing", title: "Medical Coding & Auditing", description: "Specialized coding solutions for complex specialties ensuring maximum reimbursements with accuracy.", icon: "LucideFileText", icon_bg: "#ebf5ff" },
                    { name: "Revenue Cycle Management", title: "Revenue Cycle Management", description: "End-to-end RCM services from patient registration to final payment posting and reporting.", icon: "LucideBarChart3", icon_bg: "#f0fdf4" },
                    { name: "Compliance & Risk Management", title: "Compliance & Risk Management", description: "HIPAA-compliant workflows and regular audits to ensure adherence to regulatory standards.", icon: "LucideShieldCheck", icon_bg: "#fff7ed" },
                    { name: "Denials Management", title: "Denials Management", description: "Proactive denial prevention and recovery strategies to maximize revenue capture.", icon: "LucideZap", icon_bg: "#fef2f2" },
                    { name: "Provider Credentialing", title: "Provider Credentialing", description: "Streamlined credentialing and enrollment services for providers and facilities.", icon: "LucideShieldCheck", icon_bg: "#f5f3ff" },
                    { name: "Performance Analytics", title: "Performance Analytics", description: "Advanced reporting and analytics to track financial performance and identify opportunities.", icon: "LucideBarChart3", icon_bg: "#ecfdf5" }
                ]
            }
        },
        {
            type: 'WHY_CHOOSE_US',
            order: 5,
            content: {
                title: "Engineered for Revenue Excellence",
                subtitle: "The Timberlake Advantage",
                description: "While generic billing companies focus on data entry, we focus on Revenue Optimization. Our framework is designed to eliminate clinical leakage and maximize practice valuation.",
                points: [
                    { id: "1", title: "Specialty-Specific Expertise", description: "Deep knowledge of niche specialties ensures accurate coding and maximum reimbursement.", icon: "LucideAward" },
                    { id: "2", title: "Advanced Security Framework", description: "Enterprise-grade HIPAA compliance with SOC 2 Type II certification for data protection.", icon: "LucideShieldCheck" },
                    { id: "3", title: "Proactive Revenue Optimization", description: "Predictive analytics identify revenue leakage before it impacts your bottom line.", icon: "LucideTrendingUp" },
                    { id: "4", title: "Dedicated Practice Liaison", description: "Single point of contact who understands your practice's unique workflow and goals.", icon: "LucideUserCheck" },
                    { id: "5", title: "Transparent Reporting", description: "Real-time dashboards with actionable insights into your financial performance.", icon: "LucideTrendingUp" },
                    { id: "6", title: "Continuous Compliance", description: "Ongoing monitoring and updates to ensure adherence to changing regulations.", icon: "LucideShieldCheck" }
                ],
                cta: { label: "Learn More", link: "/about" }
            }
        },
        {
            type: 'INSURANCE_PAYERS',
            order: 6,
            content: {
                title: "Direct Payer Connectivity",
                subtitle: "Interoperability",
                description: "Our RCM engine is integrated with over 800 national and regional insurance carriers, facilitating real-time eligibility checks and accelerated electronic remittance.",
                statsValue: "800+",
                statsLabel: "EDI Connections Active",
                statsColor: "emerald",
                items: [
                    { name: "Aetna", status: "active", type: "commercial" },
                    { name: "United Healthcare", status: "active", type: "commercial" },
                    { name: "Cigna", status: "active", type: "commercial" },
                    { name: "Anthem Blue Cross", status: "active", type: "commercial" },
                    { name: "Humana", status: "active", type: "medicare" },
                    { name: "CMS", status: "active", type: "government" },
                    { name: "Kaiser Permanente", status: "active", type: "commercial" },
                    { name: "Molina Healthcare", status: "active", type: "medicaid" },
                    { name: "Health Net", status: "active", type: "commercial" },
                    { name: "Blue Shield of California", status: "active", type: "commercial" },
                    { name: "Medicaid", status: "active", type: "government" },
                    { name: "Tricare", status: "active", type: "military" }
                ],
                footerNoteText: "Powered by Enterprise Clearinghouse EDI",
                footerNoteIcon: "LucideZap",
                footerNoteColor: "primary"
            }
        },
        {
            type: 'APPOINTMENT_BOOKING',
            order: 7,
            content: {
                title: "Transform Your Revenue Cycle",
                subtitle: "Expert Consultation",
                description: "Schedule a specialized audit with our RCM experts. We'll identify leakage in your current billing workflow and provide a roadmap for recovery.",
                valueProps: [
                    { title: "Free Performance Audit", description: "A deep dive into your current clean-claim rate and denial patterns.", icon: "LucideMessageSquare", variant: "primary" },
                    { title: "Clinician-Friendly Scheduling", description: "Book early morning or after-clinic briefings that respect your rounds.", icon: "LucideCalendar", variant: "primary" },
                    { title: "24-Hour Response Protocol", description: "Our implementation team reviews every inquiry within one business day.", icon: "LucideClock", variant: "primary" }
                ],
                securityTitle: "Secure PHI Protocol",
                securityDescription: "Practice information is encrypted via 256-bit SSL and handled under strict HIPAA Title II privacy standards.",
                securityIcon: "LucideShieldCheck",
                securityColor: "primary",
                formSteps: [
                    { number: "1", label: "Step One", title: "Request Your Audit", status: "active" },
                    { number: "2", label: "Step Two", title: "Workflow Review", status: "pending" }
                ],
                formTitle: "Consultation Inquiry",
                securityIconForm: "LucideLock",
                securityColorForm: "emerald",
                responseNoteText: "Average response time:",
                responseNoteValue: "2.4 Hours",
                responseNoteValueColor: "primary"
            }
        },
        {
            type: 'CTA',
            order: 8,
            content: {
                heading: "Ready to reclaim your <span class='italic text-accent'>revenue potential?</span>",
                subtext: "Join 500+ specialized providers who have eliminated billing backlogs and increased their first-pass claim acceptance.",
                button: { label: "Schedule Free Audit", link: "/contact" }
            }
        }
    ]
};

async function seedHome() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.');

        await HomePage.deleteMany({ slug: 'home' });
        console.log('Cleared existing Home page data.');

        await HomePage.create({
            slug: 'home',
            metadata: HOME_DATA.metaData,
            sections: HOME_DATA.sections
        });
        console.log('Home page seeded successfully!');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedHome();
