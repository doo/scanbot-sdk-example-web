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
          resolve({original: new Uint8Array(reader.result)});
        };
      };
    });
  }

  static saveBytes(data: any, name: string) {
    const extension = name.split(".")[1];
    const a = document.createElement("a");
    document.body.appendChild(a);
    // @ts-ignore
    a.style = "display: none";
    const blob = new Blob([data], {type: `application/${extension}`});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
