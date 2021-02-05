import {RoutePath} from "../service/RoutingService";

export class Features {

    public static LIST = [
        { id: RoutePath.DocumentScanner, name: "Document Scanner", route: RoutePath.DocumentScanner},
        { id: RoutePath.ImagePicker,     name: "Pick Image"},
        { id: RoutePath.ImageResults,    name: "Image Results", route: RoutePath.ImageResults},
        { id: RoutePath.LicenseInfo,     name: "License Info"},
    ];
}
