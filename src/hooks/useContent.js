import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import * as api from '../lib/api';
import { locations as localLocations } from '../data/locations';
import { products as localProducts } from '../data/products';
import { accreditations as localAccreditations } from '../data/accreditations';
import { accreditations as localCertificates } from "../data/accreditations";
import { jobs as localJobs } from '../data/jobs';
import { projects as localProjects } from '../data/projects';

// كاش بسيط: الداتا بتتجاب مرة واحدة وبعدها بتتشارك بين الصفحات
const cache = new Map();

/**
 * بيرجّع البيانات المحلية فوراً، ولو Supabase متظبط وفيه صفوف منشورة
 * بيبدّلها بالبيانات الحقيقية. لو فيه خطأ أو الجدول فاضي: الموقع يفضل شغال بالمحلي.
 */
function useRemote(key, fetcher, fallback) {
    const [data, setData] = useState(() => (cache.get(key) !== undefined ? cache.get(key) : fallback));
    useEffect(() => {
        if (!supabase || cache.has(key)) return;
        let alive = true;
        fetcher()
            .then((rows) => {
                if (!rows.length) return;
                cache.set(key, rows);
                if (alive) setData(rows);
            })
            .catch((err) => console.warn(`[supabase] ${key}:`, err.message));
        return () => {
            alive = false;
        };
    }, [key, fetcher]);

    return data;
}

export const useLocations = () => useRemote('locations', api.fetchLocations, localLocations);
export const useProducts = () => useRemote('products', api.fetchProducts, localProducts);
export const useAccreditations = () => useRemote('accreditations', api.fetchAccreditations, localAccreditations);
export const useCertificates = () => useRemote('certificates', api.fetchCertificates, localCertificates);
export const useJobs = () => useRemote('jobs', api.fetchJobs, localJobs);
export const useProjects = () => useRemote('projects', api.fetchProjects, localProjects);