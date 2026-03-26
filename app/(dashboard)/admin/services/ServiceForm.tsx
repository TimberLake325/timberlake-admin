"use client";

import ImageField from "@/components/global/ImageField";
import LexicalEditor from "@/components/global/LexicalEditor";
import SeoComponent from "@/components/global/Seo";
import { useToast } from "@/components/global/Toast";
import { createService, createServiceCategory, updateService, updateServiceCategory } from "@/services/serviceService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FiLayers, FiLink, FiTag, FiTrendingUp, FiType, FiEdit3, FiTrash2, FiX, FiPlus, FiList, FiUsers, FiFileText } from "react-icons/fi";

interface ServiceFormProps {
    type: 'service' | 'category';
    editingItem?: any;
    categories?: any[];
}

const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon, isTextArea = false, isRichText = false }: any) => (
    <div className="mb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
            {label}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-4 text-black/20" size={14} />}
            {isRichText ? (
                <LexicalEditor
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            ) : isTextArea ? (
                <textarea
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full p-4 bg-black/2 border border-black/6 rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20 font-medium"
                />
            ) : (
                <input
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-4 bg-black/2 border border-black/6 rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20 font-medium`}
                />
            )}
        </div>
    </div>
);

const ColorField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="mb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
            {label}
        </label>
        <div className="flex items-center gap-3 p-3 bg-black/2 border border-black/6 rounded-2xl focus-within:border-[#2563eb]/30 transition-all">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-black/6">
                <input
                    type="color"
                    value={value?.startsWith('#') ? value : '#2563eb'}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -translate-x-[15%] -translate-y-[15%] cursor-pointer border-none"
                />
            </div>
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#hex or tailwind class"
                className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-black/20 font-medium"
            />
        </div>
    </div>
);

const ServiceForm = ({ type, editingItem, categories = [] }: ServiceFormProps) => {
    const { showToast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<any>({
        status: 'Active',
        isActive: true,
        metadata: {
            title: '',
            description: '',
            keywords: [],
            image: '',
            ogImage: ''
        }
    });

    useEffect(() => {
        if (editingItem) {
            const normalizedData = { ...editingItem };
            if (normalizedData.category && typeof normalizedData.category === 'object') {
                normalizedData.category = normalizedData.category._id;
            }
            setFormData(normalizedData);

            if (type === 'service') {
                setFeaturesInput(normalizedData.keyFeatures?.join('\n') || '');
                setClientTypesInput(normalizedData.clientTypes?.join('\n') || '');
                setSpecialtiesInput(normalizedData.specialties?.join('\n') || '');
            }
        } else {
            setFormData(type === 'service' ? {
                title: '',
                slug: '',
                category: '',
                description: '',
                excerpt: '',
                content: '',
                icon: '',
                icon_bg: '',
                card_bg: '',
                image: '',
                displayOrder: 0,
                status: 'Active',
                keyFeatures: [],
                statistics: [],
                clientTypes: [],
                specialties: [],
                ctaText: '',
                ctaLink: '',
                isActive: true,
                metadata: { title: '', description: '', keywords: [], image: '', ogImage: '' }
            } : {
                name: '',
                slug: '',
                description: '',
                excerpt: '',
                icon: '',
                icon_bg: '',
                card_bg: '',
                image: '',
                displayOrder: 0,
                status: 'Active',
                isActive: true,
                metadata: { title: '', description: '', keywords: [], image: '', ogImage: '' }
            });
        }
    }, [editingItem, type]);

    const [featuresInput, setFeaturesInput] = useState('');
    const [clientTypesInput, setClientTypesInput] = useState('');
    const [specialtiesInput, setSpecialtiesInput] = useState('');

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleNameChange = (val: string) => {
        const nameField = type === 'service' ? 'title' : 'name';
        setFormData((prev: any) => ({
            ...prev,
            [nameField]: val,
            slug: !editingItem ? generateSlug(val) : prev.slug || generateSlug(val)
        }));
    };

    const handleSeoChange = (field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            metadata: {
                ...(prev.metadata || {}),
                [field]: value
            }
        }));
    };

    const handleBack = () => {
        router.push(type === 'service' ? '/admin/services' : '/admin/services/categories');
    };

    const handleArrayChange = (field: string, value: string) => {
        const arr = value.split('\n').filter(f => f.trim() !== '');
        setFormData((prev: any) => ({ ...prev, [field]: arr }));
    };

    const handleStatChange = (index: number, field: string, value: string) => {
        const newStats = [...(formData.statistics || [])];
        if (!newStats[index]) newStats[index] = { label: '', value: '', icon: '' };
        newStats[index][field] = value;
        setFormData({ ...formData, statistics: newStats });
    };

    const addStat = () => {
        setFormData({ ...formData, statistics: [...(formData.statistics || []), { label: '', value: '', icon: '' }] });
    };

    const removeStat = (index: number) => {
        const newStats = [...(formData.statistics || [])];
        newStats.splice(index, 1);
        setFormData({ ...formData, statistics: newStats });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;
            if (type === 'service') {
                if (editingItem?._id) res = await updateService(editingItem._id, formData);
                else res = await createService(formData);
            } else {
                if (editingItem?._id) res = await updateServiceCategory(editingItem._id, formData);
                else res = await createServiceCategory(formData);
            }

            if (res.success) {
                showToast(res.message, 'success');
                handleBack();
                router.refresh();
            } else {
                showToast(res.message, 'error');
            }
        } catch (error) {
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-3 lg:p-6 bg-[#fcfcfc] min-h-screen">
            <div className="w-full mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tighter">
                            {editingItem ? 'Edit' : 'Create New'} {type === 'service' ? 'Sub-Service' : 'Core Service'}
                        </h2>
                        <p className="text-[10px] text-black/40 font-black uppercase tracking-widest mt-1">
                            {type === 'service' ? 'Define a specific service offering' : 'Manage core service pillars'}
                        </p>
                    </div>
                    <button type="button" onClick={handleBack} className="p-3 bg-white border border-black/5 rounded-2xl hover:bg-black/8 transition-colors shadow-sm">
                        <FiX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="md:col-span-2">
                            <InputField
                                label={type === 'service' ? "Service Title" : "Category Name"}
                                value={type === 'service' ? formData.title : formData.name}
                                onChange={handleNameChange}
                                placeholder={type === 'service' ? "e.g. Denial Management" : "e.g. Revenue Cycle Management"}
                                icon={FiType}
                            />
                        </div>

                        <InputField
                            label="URL Slug"
                            value={formData.slug}
                            onChange={(v: string) => setFormData({ ...formData, slug: v })}
                            placeholder="url-slug"
                            icon={FiLink}
                        />

                        <div className="md:col-span-2">
                            <InputField
                                label="Short Excerpt"
                                value={formData.excerpt || ''}
                                onChange={(v: string) => setFormData({ ...formData, excerpt: v })}
                                placeholder="A brief summary for cards and lists..."
                                icon={FiFileText}
                                isTextArea
                            />
                        </div>

                        {type === 'service' && (
                            <div className="mb-4">
                                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">Parent Category</label>
                                <div className="relative">
                                    <FiLayers className="absolute left-4 top-4 text-black/20" size={14} />
                                    <select
                                        className="w-full pl-11 pr-4 py-4 bg-black/2 border border-black/6 rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium appearance-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-1">
                            <ImageField
                                label="Icon (Image/SVG)"
                                value={formData.icon || ''}
                                onChange={(url: string) => setFormData((prev: any) => ({ ...prev, icon: url }))}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <ImageField
                                label="Featured Image"
                                value={formData.image || ''}
                                onChange={(url: string) => setFormData((prev: any) => ({ ...prev, image: url }))}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <ColorField
                                label="Icon Background Color"
                                value={formData.icon_bg || ''}
                                onChange={(v: string) => setFormData({ ...formData, icon_bg: v })}
                            />
                        </div>
                        <div className="md:col-span-1">
                            <ColorField
                                label="Card Background Color"
                                value={formData.card_bg || ''}
                                onChange={(v: string) => setFormData({ ...formData, card_bg: v })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <InputField
                                label="Description (Rich Text)"
                                value={formData.description}
                                onChange={(v: string) => setFormData({ ...formData, description: v })}
                                placeholder="Core summary..."
                                isRichText
                            />
                        </div>

                        {type === 'service' && (
                            <>
                                <div className="md:col-span-2">
                                    <InputField
                                        label="Full Content (Rich Text)"
                                        value={formData.content}
                                        onChange={(v: string) => setFormData({ ...formData, content: v })}
                                        placeholder="Detailed content for sub-service page..."
                                        isRichText
                                    />
                                </div>

                                <div className="md:col-span-1 py-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                                        <FiList /> Key Features (One per line)
                                    </h4>
                                    <InputField
                                        value={featuresInput}
                                        onChange={(v: string) => { setFeaturesInput(v); handleArrayChange('keyFeatures', v); }}
                                        placeholder="Feature 1\nFeature 2"
                                        isTextArea
                                    />
                                </div>

                                <div className="md:col-span-1 py-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                                        <FiUsers /> Client Types (One per line)
                                    </h4>
                                    <InputField
                                        value={clientTypesInput}
                                        onChange={(v: string) => { setClientTypesInput(v); handleArrayChange('clientTypes', v); }}
                                        placeholder="Physicians\nHospitals"
                                        isTextArea
                                    />
                                </div>

                                <div className="md:col-span-1 py-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2">
                                        <FiTag /> Specialties (One per line)
                                    </h4>
                                    <InputField
                                        value={specialtiesInput}
                                        onChange={(v: string) => { setSpecialtiesInput(v); handleArrayChange('specialties', v); }}
                                        placeholder="Cardiology\nRadiology"
                                        isTextArea
                                    />
                                </div>

                                <div className="md:col-span-2 py-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40 flex items-center gap-2">
                                            <FiTrendingUp /> Statistics / Metrics
                                        </h4>
                                        <button type="button" onClick={addStat} className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:underline">+ Add Stat</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {(formData.statistics || []).map((stat: any, index: number) => (
                                            <div key={index} className="p-4 bg-black/2 border border-black/6 rounded-2xl relative group">
                                                <button onClick={() => removeStat(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <FiX size={12} />
                                                </button>
                                                <InputField label="Value" value={stat.value} onChange={(v: string) => handleStatChange(index, 'value', v)} placeholder="98%" />
                                                <InputField label="Label" value={stat.label} onChange={(v: string) => handleStatChange(index, 'label', v)} placeholder="Accuracy" />
                                                <InputField label="Icon" value={stat.icon} onChange={(v: string) => handleStatChange(index, 'icon', v)} placeholder="TrendingUp" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-1">
                                    <InputField label="CTA Button Text" value={formData.ctaText} onChange={(v: string) => setFormData({ ...formData, ctaText: v })} placeholder="Get Started" />
                                </div>
                                <div className="md:col-span-1">
                                    <InputField label="CTA Button Link" value={formData.ctaLink} onChange={(v: string) => setFormData({ ...formData, ctaLink: v })} placeholder="/contact" />
                                </div>
                            </>
                        )}

                        <div className="md:col-span-1 py-4">
                            <InputField label="Display Order" type="number" value={formData.displayOrder} onChange={(v: number) => setFormData({ ...formData, displayOrder: v })} />
                        </div>
                        <div className="md:col-span-1 py-4">
                            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">Status</label>
                            <select
                                className="w-full px-4 py-4 bg-black/2 border border-black/6 rounded-2xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all font-medium appearance-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Draft">Draft</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 mt-8">
                            <SeoComponent data={formData.metadata} onChange={handleSeoChange} />
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button type="button" onClick={handleBack} className="flex-1 py-4 bg-black/3 text-black/40 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black/8 transition-all">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-2 py-4 bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-black shadow-lg transition-all">{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;
