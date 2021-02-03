
export enum FeatureId {
    DocumentScanner,
    ImagePicker,
    ImageResults,
    LicenseInfo
}
export class Features {

    public static LIST = [
        { id: FeatureId.DocumentScanner, name: "Document Scanner", route: "document-scanner"},
        { id: FeatureId.ImagePicker,     name: "Pick Image"},
        { id: FeatureId.ImageResults,    name: "Image Results", route: "image-results"},
        { id: FeatureId.LicenseInfo,     name: "License Info"},
    ];
}
