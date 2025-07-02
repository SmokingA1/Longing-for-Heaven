// import type { Crop } from "react-image-crop";

// function getCroppedBlob(image: HTMLImageElement, crop: Crop): Promise<Blob> {
//     const canvas = document.createElement("canvas")
//     canvas.width = 268;
//     canvas.height = 268;

//     const scaleX = image.naturalWidth / image.width
//     const scaleY = image.naturalHeight / image.height

//     const ctx = canvas.getContext("2d")!;
//     ctx.drawImage(
//         image,
//         crop.x * scaleX,
//         crop.y * scaleY,
//         crop.width  * scaleX,
//         crop.height * scaleY,
//         0,
//         0,
//         268,
//         268
//     );
//     return new Promise(res => canvas.toBlob(b => res(b!), "image/jpeg", 0.9));
// }