
export enum FeatureId {
    DocumentScanner = "document-scanner",
    ImagePicker = "image-picker",
    ImageResults = "image-results",
    ImageDetails = "image-details",
    LicenseInfo = "license-info",
    CroppingView = "cropping-view"
}
export class Features {

    public static LIST = [
        { id: FeatureId.DocumentScanner, name: "Document Scanner", route: FeatureId.DocumentScanner},
        { id: FeatureId.ImagePicker,     name: "Pick Image"},
        { id: FeatureId.ImageResults,    name: "Image Results", route: FeatureId.ImageResults},
        { id: FeatureId.LicenseInfo,     name: "License Info"},
    ];
}
