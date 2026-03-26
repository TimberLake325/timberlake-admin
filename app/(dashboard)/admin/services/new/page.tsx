"use client";

import { getServiceCategories } from '@/services/serviceService';
import { useEffect, useState } from 'react';
import ServiceForm from '../ServiceForm';

export default function CreateServicePage() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getServiceCategories();
            if (res.success) {
                setCategories(res.data);
            }
        };
        fetchCategories();
    }, []);

    return (
        <ServiceForm
            type="service"
            categories={categories}
        />
    );
}
