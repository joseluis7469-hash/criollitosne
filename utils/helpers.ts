
// Utilidad para asegurar que los objetos sean planos y serializables (necesario para Firestore)
export const sanitizeData = (obj: any): any => {
    if (!obj) return obj;
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        console.error("Error detectado en estructura de datos:", e);
        if (Array.isArray(obj)) return [];
        if (typeof obj === 'object') {
            const safeObj: any = {};
            Object.keys(obj).forEach(key => {
                const val = obj[key];
                if (typeof val !== 'function' && typeof val !== 'object') {
                    safeObj[key] = val;
                } else if (val === null) {
                    safeObj[key] = null;
                }
            });
            return safeObj;
        }
        return String(obj);
    }
};

// Utilidad para asegurar que la aplicación permanezca en pantalla completa
export const attemptFullScreen = () => {
    if (typeof document === 'undefined') return;

    const doc = document.documentElement;
    if (!document.fullscreenElement) {
        const requestMethod = doc.requestFullscreen ||
            (doc as any).webkitRequestFullscreen ||
            (doc as any).mozRequestFullScreen ||
            (doc as any).msRequestFullscreen;

        if (requestMethod) {
            requestMethod.call(doc).catch(() => {
                // Silencioso
            });
        }
    }
};

// Utilidad para comprimir imágenes antes de guardarlas en Firestore
export const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(base64Str);
    });
};

// Formateo de Cédula (V/E - XX.XXX.XXX)
export const handleDNIFormat = (val: string) => {
    let raw = val.toUpperCase().replace(/[^VE0-9]/g, '');
    if (raw.length === 0) return '';
    let prefix = raw.charAt(0);
    if (!['V', 'E'].includes(prefix)) {
        prefix = 'V';
        raw = prefix + raw.replace(/[^0-9]/g, '');
    }
    let numbers = raw.slice(1).replace(/[^0-9]/g, '').slice(0, 9);
    let formatted = prefix;
    if (numbers.length > 0) {
        formatted += ' - ' + numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return formatted;
};

// Formateo de Teléfono (XXXX-XXX.XX.XX)
export const handlePhoneFormat = (val: string) => {
    let raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length === 0) return '';
    let formatted = '';
    if (raw.length <= 4) formatted = raw;
    else if (raw.length <= 7) formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
    else if (raw.length <= 9) formatted = `${raw.slice(0, 4)}-${raw.slice(4, 7)}.${raw.slice(7)}`;
    else formatted = `${raw.slice(0, 4)}-${raw.slice(4, 7)}.${raw.slice(7, 9)}.${raw.slice(9)}`;
    return formatted;
};
