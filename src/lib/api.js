import { supabase } from './supabase';

// ---------- قراءة المحتوى (الجداول العامة) ----------
async function readTable(table) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchLocations() {
  return (await readTable('locations')).map((r) => ({
    id: r.id, type: r.type,
    name: r.name, nameAr: r.name_ar,
    city: r.city, cityAr: r.city_ar,
    address: r.address, addressAr: r.address_ar,
    phone: r.phone, email: r.email,
    hours: r.hours, hoursAr: r.hours_ar,
    img: r.img, mapEmbed: r.map_embed ?? '',
  }));
}

export async function fetchProducts() {
  return (await readTable('products')).map((r) => ({
    id: r.id, category: r.category,
    badge: r.badge, badgeAr: r.badge_ar,
    name: r.name, nameAr: r.name_ar,
    desc: r.description, descAr: r.description_ar,
    specs: r.specs ?? [], specsAr: r.specs_ar ?? [],
    datasheet: r.datasheet_url,
  }));
}

export async function fetchAccreditations() {
  return (await readTable('accreditations')).map((r) => ({
    id: r.id, name: r.name,
    titleEn: r.title_en, titleAr: r.title_ar,
    descEn: r.desc_en, descAr: r.desc_ar,
    file: r.file_url,
  }));
}

export async function fetchCertificates() {
  return (await readTable('certificates')).map((r) => ({
    id: r.id, type: r.kind,
    title: r.title, titleAr: r.title_ar,
    img: r.image_url,
  }));
}

export async function fetchJobs() {
  return (await readTable('jobs')).map((r) => ({
    id: r.id,
    titleEn: r.title, titleAr: r.title_ar,
    dept: r.dept,
  }));
}

export async function fetchProjects() {
  return (await readTable('projects')).map((r) => ({
    id: r.id,
    name: r.name, nameAr: r.name_ar,
    location: r.location, locationAr: r.location_ar,
    year: r.year, img: r.image_url,
  }));
}

// ---------- إرسال الفورمات ----------
export async function submitContactMessage({ name, email, phone, locationId, message, lang }) {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED');
  const { error } = await supabase.from('contact_messages').insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    location_id: locationId && locationId !== 'any' ? locationId : null,
    message: message.trim(),
    lang,
  });
  if (error) throw error;
}

export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export async function submitJobApplication({ name, email, phone, jobId, file, lang }) {
  if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED');

  let cvPath = null;
  if (file) {
    const safe = file.name.replace(/[^\w.-]+/g, '_');
    cvPath = `${crypto.randomUUID()}/${safe}`;
    const { error: upErr } = await supabase.storage.from('cvs').upload(cvPath, file, {
      contentType: file.type,
      upsert: false,
    });
    if (upErr) throw upErr;
  }

  const { error } = await supabase.from('job_applications').insert({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    job_id: jobId || null,
    cv_path: cvPath,
    lang,
  });
  if (error) throw error;
}
