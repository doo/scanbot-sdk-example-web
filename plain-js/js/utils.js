class Utils {
  static imageToDisplay(result) {
    if (result.filtered) {
      return result.filtered;
    }
    if (result.cropped) {
      return result.cropped;
    }

    return result.original;
  }

  static async renderDetectionResult(index) {
    const result = results[index];
    const image = await scanbotSDK.toDataUrl(Utils.imageToDisplay(result));
    return (
      "<img index='" +
      index +
      "' class='detection-result-image' src='" +
      image +
      "' alt='.'/>"
    );
  }

  static async renderDetectionResults() {
    let html = "";
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const image = await scanbotSDK.toDataUrl(Utils.imageToDisplay(result));
      html +=
        "<img index='" +
        i +
        "' class='detection-result-list-image' src='" +
        image +
        "' alt='.'/>";
    }
    return html;
  }

  static getElementByClassName(name) {
    return document.getElementsByClassName(name)[0];
  }

  static getElementById(id) {
    return document.getElementById(id);
  }

  static saveBytes(data, name) {
    const extension = name.split(".")[1];
    const a = document.createElement("a");
    document.body.appendChild(a);
    // @ts-ignore
    a.style = "display: none";
    const blob = new Blob([data], { type: `application/${extension}` });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    // Workaround for iOS 12, we were losing the cache and it was ending up WebKitBlobResource error
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  static generateName() {
    const length = 5;
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
