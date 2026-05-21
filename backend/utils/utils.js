import QRCode from 'qrcode';

export const generatePatientId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    return `MED-${randomNum}`;
};

export const generateQRCode = async (text) => {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        console.error('QR Code generation failed', err);
        return null;
    }
};
