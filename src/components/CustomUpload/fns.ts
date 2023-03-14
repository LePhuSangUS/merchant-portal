import { getLanguageKey, getToken } from "@/utils";

export function getBase64v2(img: Blob, callback: (data: any) => void) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    'Accept-Language': getLanguageKey()
});