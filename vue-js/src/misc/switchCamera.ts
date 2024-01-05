import type {IScannerCommon} from "scanbot-web-sdk/@types/interfaces/i-scanner-common-handle";
import { swalAlert } from "@/misc/swalAlert";

export async function switchCamera(scanner: IScannerCommon) {
    const cameras = await scanner?.fetchAvailableCameras()
    if (cameras) {
        const currentCameraInfo = scanner?.getActiveCameraInfo();
        if (currentCameraInfo) {
            const cameraIndex = cameras.findIndex((cameraInfo) => {
                return cameraInfo.deviceId == currentCameraInfo.deviceId
            });
            const newCameraIndex = (cameraIndex + 1) % (cameras.length);
            await swalAlert(`Current camera: ${currentCameraInfo.label}.\nSwitching to: ${cameras[newCameraIndex].label}`);
            scanner?.switchCamera(cameras[newCameraIndex].deviceId, false);
        }
    }
}
