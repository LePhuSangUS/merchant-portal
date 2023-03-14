import { Button, Space } from '@/components';
import { translate, message } from '@/utils';
import { HttpService } from '@/utils/http.service';
import { b64toBlob } from '@/utils/parse';
import React from 'react'
import Webcam from 'react-webcam'
import style from './WebcamCapture.less'
import { env } from "@/env";

interface WebcamCaptureProps {
    config: any;
    onAfterCapture?: (...args: any[]) => void;
    onCaptureError?: (...args: any[]) => void;
}

const WebcamCapture = ({ onAfterCapture, onCaptureError }: WebcamCaptureProps) => {
    const webcamRef = React.useRef<any>(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const contentType = 'image/jpeg';

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef?.current.getScreenshot();
        // setImgSrc(imageSrc);

        const blob = b64toBlob(imageSrc?.split(',')?.[1], contentType)
        if (!blob) {
            message.error(translate('register.message.capture.error'))
            return
        }

        // handle file
        let file;
        file = new File([blob], 'capture-image-' + Date.now() + '.jpg', {
            type: contentType,
            lastModified: Date.now(),
        });

        const upload = async (file: any, onSuccess?: (...args: any[]) => void, onError?: (...args: any[]) => void) => {
            // request api
            try {
                const resp = await HttpService.uploadKycFile(file);
                if (resp?.message) {
                    const imgUrl = `${env.FILE_API_URL}/img/${resp.object.fileName}.${resp.object.fileType}`;
                    onSuccess?.(imgUrl, resp.object.hash, resp.object)
                    message.success(translate('register.message.capture.success'))
                } else {
                    message.error(translate('register.message.capture.error'))
                    onError?.()
                }
            } catch (error) {
                message.error(translate('register.message.capture.error'))
                onError?.()
            }
        }

        upload(file, onAfterCapture, onCaptureError)
    }, [webcamRef, setImgSrc]);

    return (
        <div className={style['webcam-capture']}>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
            />
            <Space size={10}>
                <Button className='capture-btn' onClick={capture}>{translate('user.register.button.capture')}</Button>
                <Button onClick={onCaptureError}>{translate('form.button.cancel')}</Button>
            </Space>
            {imgSrc && (
                <img
                    src={imgSrc}
                />
            )}
        </div>
    );
};

export default WebcamCapture