"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiTrash2, FiPlus, FiX, FiCheck, FiAlertTriangle, FiList } from 'react-icons/fi';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import InputField from '@/components/global/InputField';
import ImageField from '@/components/global/ImageField';

const pointSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().optional(),
    image: z.string().optional(),
});

const whyChooseUsSchema = z.object({
    title: z.string().min(1, 'Section title is required'),
    subtitle: z.string().min(1, 'Section subtitle is required'),
    description: z.string().min(1, 'Description is required'),
    image: z.string().optional(),
    points: z.array(pointSchema),
    cta: z.object({
        label: z.string().min(1, 'CTA label is required'),
        link: z.string().min(1, 'CTA link is required'),
    })
});

type WhyChooseUsFormValues = z.infer<typeof whyChooseUsSchema>;

interface EditSectionProps {
    data: any;
    onChange: (data: any) => void;
}

const EditSection = ({ data, onChange }: EditSectionProps) => {
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const methods = useForm<WhyChooseUsFormValues>({
        resolver: zodResolver(whyChooseUsSchema),
        defaultValues: data,
        mode: 'onChange'
    });

    const { control, register, handleSubmit, watch, formState: { errors } } = methods;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "points"
    });

    React.useEffect(() => {
        const subscription = watch((value) => {
            onChange(value);
        });
        return () => subscription.unsubscribe();
    }, [watch, onChange]);

    const handleDeletePoint = () => {
        if (deleteIndex !== null) {
            remove(deleteIndex);
            setDeleteIndex(null);
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="space-y-8 animate-in fade-in duration-500">
                <ConfirmationModal
                    isOpen={deleteIndex !== null}
                    title="Delete Value Point"
                    message="Are you sure you want to remove this value point? This action will take effect only after you save the home page."
                    onConfirm={handleDeletePoint}
                    onCancel={() => setDeleteIndex(null)}
                    confirmLabel="Yes, Delete Point"
                />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <InputField
                            label="Section Title"
                            {...register("title")}
                            placeholder="Why Choose Us"
                            error={errors.title?.message}
                        />
                    </div>
                    <InputField
                        label="Subtitle"
                        {...register("subtitle")}
                        placeholder="Discover our unique value"
                        error={errors.subtitle?.message}
                    />
                    <div className="md:col-span-1">
                        <Controller
                            control={control}
                            name="image"
                            render={({ field }) => (
                                <ImageField
                                    label="Section Illustration"
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <InputField
                                    label="Description"
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Enter section description"
                                    isRichText
                                    error={errors.description?.message}
                                />
                            )}
                        />
                    </div>
                </div>


                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/50">Value Points ({fields.length})</p>
                        <button
                            type="button"
                            onClick={() => append({ id: Date.now().toString(), title: '', description: '', icon: '', image: '' })}
                            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7C3AED] transition-all shadow-lg shadow-[#2563eb]/20"
                        >
                            <FiPlus size={14} /> Add Point
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="relative group p-6 bg-white/30 backdrop-blur-xl border border-white/40 rounded-[2rem] hover:border-[#2563eb]/30 transition-all duration-500 shadow-sm"
                            >

                                <button
                                    type="button"
                                    onClick={() => setDeleteIndex(index)}
                                    className="absolute -top-3 -right-3 w-10 h-10 bg-white/90 backdrop-blur-md border border-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-xl z-20"
                                >
                                    <FiTrash2 size={16} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <InputField
                                            label="Point Title"
                                            {...register(`points.${index}.title` as const)}
                                            placeholder="Expertise"
                                            error={errors.points?.[index]?.title?.message}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField
                                                label="Icon (Lucide)"
                                                {...register(`points.${index}.icon` as const)}
                                                placeholder="Icon name"
                                                error={errors.points?.[index]?.icon?.message}
                                            />
                                            <Controller
                                                control={control}
                                                name={`points.${index}.image` as const}
                                                render={({ field }) => (
                                                    <ImageField
                                                        label="Or Image"
                                                        value={field.value || ''}
                                                        onChange={field.onChange}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Controller
                                            control={control}
                                            name={`points.${index}.description` as const}
                                            render={({ field }) => (
                                                <InputField
                                                    label="Description"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Explain why this value matters"
                                                    isRichText
                                                    error={errors.points?.[index]?.description?.message}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {fields.length === 0 && (
                        <div className="py-20 border-2 border-dashed border-black/[0.03] rounded-[3rem] flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-black/[0.02] rounded-full flex items-center justify-center mb-4">
                                <FiList className="text-black/10" size={32} />
                            </div>
                            <p className="text-xs font-bold text-black/20 uppercase tracking-widest">No value points added yet</p>
                        </div>
                    )}
                </div>


                <div className="mt-8 p-8 bg-black/[0.01] border border-black/[0.04] rounded-[2.5rem]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-6 flex items-center gap-2">
                        <FiCheck size={14} /> Section Call to Action
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Button Label"
                            {...register("cta.label")}
                            placeholder="Get Started"
                            error={errors.cta?.label?.message}
                        />
                        <InputField
                            label="Target Link"
                            {...register("cta.link")}
                            placeholder="/services"
                            error={errors.cta?.link?.message}
                        />
                    </div>
                </div>
            </div>
        </FormProvider>
    );
};

export default EditSection;
