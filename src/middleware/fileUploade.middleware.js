import multer from "multer";

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${timestamp}-${file.originalname}`);
    }
});

export const uploads = multer({ storage: storageConfig });
