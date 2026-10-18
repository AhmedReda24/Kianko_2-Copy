module.exports = {
    purge: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'], // تأكد من تغطية مسارات ملفات مشروعك
    darkMode: 'class', // <--- التعديل الأهم: تفعيل وضع الكلاسات للتحكم اليدوي بالثيم
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}