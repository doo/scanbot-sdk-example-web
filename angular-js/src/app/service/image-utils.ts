import {NavigationUtils} from "./navigation-utils";

export class ImageUtils {

  public static pick(): Promise<any> {
    return new Promise<any>(resolve => {
      const picker = NavigationUtils.getElementByClassName("file-picker");
      picker.click();

      picker.onchange = (e) => {
        console.log("change");
        e.preventDefault();
        let reader = new FileReader();
        // @ts-ignore
        let file = e.target.files[0];
        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
          // @ts-ignore
          resolve({original: new Int8Array(reader.result)});
        };
      };
    });
  }
}
