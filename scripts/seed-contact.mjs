import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

// Internal Schema Definitions
const seoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String] },
    image: { type: String }
}, { _id: false });

const contactDetailSchema = new mongoose.Schema({
    id: { type: String },
    label: { type: String },
    value: { type: String },
    subtext: { type: String },
    icon: { type: String },
    color: { type: String }
}, { _id: false });

const contactPageSchema = new mongoose.Schema({
    page: { type: String, required: true, default: 'Contact Us' },
    metadata: { type: seoSchema },
    pageData: {
        pageTitle: { type: String },
        pageSubTitle: { type: String },
        content: { type: String },
        heroKicker: { type: String },
        heroTitleMain: { type: String },
        heroTitleHighlight: { type: String },
        heroTitleStyle: { type: String },
        contactDetails: [contactDetailSchema],
        form: {
            title: { type: String },
            security: {
                text: { type: String },
                icon: { type: String },
                color: { type: String }
            },
            responseTime: {
                text: { type: String },
                value: { type: String }
            },
            trustBar: {
                text: { type: String }
            }
        }
    }
}, { timestamps: true });

const ContactPage = mongoose.models.ContactPage || mongoose.model('ContactPage', contactPageSchema);

const CONTACT_DATA = {
    metaData: {
        title: "Contact Our Billing Experts",
        description: "Connect with Timberlake's certified billing specialists. Schedule a strategy session for your practice's revenue cycle management.",
        image: "/og-contact-image.jpg",
        keywords: ["contact medical billing", "billing consultation", "RCM strategy", "practice audit"],
    },
    header: {
        title: "Contact Our Experts",
        description: "Ready to transform your practice? Connect with Timberlake's certified billing specialists for a strategy session."
    },
    hero: {
        kicker: {
            text: "Direct Line",
            icon: "LucideMessageSquare",
            color: "primary"
        },
        title: {
            mainText: "Let's Discuss Your",
            highlightedText: "Revenue Strategy",
            highlightStyle: "italic"
        },
        description: "Whether you have a specific question about compliance or want to schedule a comprehensive revenue cycle audit, our executive team is ready to assist."
    },
    contactDetails: [
        {
            id: "contact-1",
            label: "Call Us",
            value: "+1 (555) 123-4567",
            subtext: "Direct Support",
            icon: "LucidePhone",
            color: "primary"
        },
        {
            id: "contact-2",
            label: "Email Us",
            value: "info@timberlake.com",
            subtext: "General Inquiries",
            icon: "LucideMail",
            color: "primary"
        },
        {
            id: "contact-3",
            label: "Visit Our Office",
            value: "123 Medical Drive, Suite 500, New York, NY 10001",
            subtext: "Headquarters",
            icon: "LucideMapPin",
            color: "primary"
        },
        {
            id: "contact-4",
            label: "Business Hours",
            value: "Mon - Fri: 9am - 6pm EST",
            subtext: "Response time: < 2hrs",
            icon: "LucideClock",
            color: "primary"
        }
    ],
    form: {
        title: "Secure Message",
        security: {
            text: "HIPAA Compliant Gateway",
            icon: "LucideShieldCheck",
            color: "emerald"
        },
        responseTime: {
            text: "Average response time:",
            value: "90 minutes or less"
        },
        trustBar: {
            text: "Timberlake Global Revenue Cycle Management • Trusted by 500+ Practices Nationwide"
        }
    }
};

async function seedContact() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.');

        await ContactPage.deleteMany({ page: 'Contact Us' });
        console.log('Cleared existing Contact page data.');

        const contactSeedData = {
            page: 'Contact Us',
            metadata: CONTACT_DATA.metaData,
            pageData: {
                pageTitle: CONTACT_DATA.header.title,
                pageSubTitle: CONTACT_DATA.header.description,
                content: CONTACT_DATA.hero.description,
                heroKicker: CONTACT_DATA.hero.kicker.text,
                heroTitleMain: CONTACT_DATA.hero.title.mainText,
                heroTitleHighlight: CONTACT_DATA.hero.title.highlightedText,
                heroTitleStyle: CONTACT_DATA.hero.title.highlightStyle,
                contactDetails: CONTACT_DATA.contactDetails,
                form: CONTACT_DATA.form
            }
        };

        await ContactPage.create(contactSeedData);
        console.log('Contact page seeded successfully!');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedContact();
