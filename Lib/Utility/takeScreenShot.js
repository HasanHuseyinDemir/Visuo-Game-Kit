export function takeScreenshot(a){
    let canvas=a
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'visuo-canvas-image.png';
    link.click();
}