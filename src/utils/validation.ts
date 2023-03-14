export const validationFileSize = (fileSize: number, maxSize = 1) => { //1MB
    try {
        return fileSize < maxSize * 1024 * 1024;
    } catch (error) {
        console.error(error)
        return false;
    }
}

const addImageProcess = (file: any): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = () => {
            const width = img.naturalWidth,
                height = img.naturalHeight;
            window.URL.revokeObjectURL(img.src)
            resolve({ width, height });
        }
        img.onerror = reject
    })
}

export const validationImageDimension = async ({ file, maxHeight, maxWidth }: { file: any, maxHeight: number, maxWidth: number }) => {
    try {
        if (window) {
            const dimension = await addImageProcess(file);
            if (dimension.width <= maxWidth && dimension.height <= maxHeight) {
                return true;
            }
            return false;
        } else {
            throw new Error("Invalid window")
        }
    } catch (error) {
        console.error(error)
        return false;
    }
}