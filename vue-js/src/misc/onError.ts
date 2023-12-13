export function onError(e: any): void {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
}