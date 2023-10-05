import type ScanbotSDK from 'scanbot-web-sdk';

export default class ScanbotSDKService {
    
    public static instance: ScanbotSDKService = new ScanbotSDKService();
    
    private sdk?: ScanbotSDK;

    public async initialize() {
        const sdk = (await import('scanbot-web-sdk')).default;
        this.sdk = await sdk.initialize({ licenseKey: '' });
    }
}