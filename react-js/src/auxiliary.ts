import React from 'react';
import { ScanbotSdkService } from './service/scanbot-sdk-service';
import Pages from './model/pages';

import { ImageUtils } from './utils/image-utils';
import { MiscUtils } from './utils/misc-utils';

import Swal from 'sweetalert2';
import { ImageFilter } from 'scanbot-web-sdk/@types';
import { withRouter } from 'react-router-dom';
import { useHistory } from "react-router-dom";


export async function savePDF() {
    const bytes = await ScanbotSdkService.instance.generatePDF(Pages.instance.get());
    ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".pdf");
}

export async function saveTIFF() {
    const bytes = await ScanbotSdkService.instance.generateTIFF(Pages.instance.get());
    ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".tiff");
}

// // export function openCroppingUI() {
// //     RoutingService.instance.route(RoutePath.CroppingView, {index: Pages.instance.getActiveIndex()});
// // }

export async function applyFilter(image: any) {
    const page = Pages.instance.getActiveItem();
    const result = await Swal.fire({
        title: 'Select filter',
        input: 'select',
        inputOptions: ScanbotSdkService.instance.availableFilters(),
        inputPlaceholder: page.filter ?? "none"
    });

    const filter = ScanbotSdkService.instance.filterByIndex(result.value);

    // "None" is not an actual filter, only used in this example app
    if (filter === "none") {
        page.filter = undefined;
        page.filtered = undefined;
    } else {
        page.filter = filter;
        page.filtered = await ScanbotSdkService.instance.applyFilter(
            page.cropped ?? page.original,
            filter as ImageFilter);
    }

    const index = Pages.instance.getActiveIndex();
    image = await ScanbotSdkService.instance.documentImageAsBase64(index);
}

// export const DeletePage: React.FC = () => {
//     console.log('deletiiiing')
//     let history = useHistory();
//     Pages.instance.removeActiveItem();
//     // RoutingService.instance.route(RoutePath.ImageResults);
//     history.push('./view-doc')
//     return null
// }

class Aux extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            
        }
    }

    deletePage() {
        console.log('deletiiiing')
        Pages.instance.removeActiveItem();
        // RoutingService.instance.route(RoutePath.ImageResults);
        this.props.history.push('./view-doc')
    }
}

export default withRouter(Aux)