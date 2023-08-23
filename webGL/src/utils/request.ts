export function requestCORSIfNotSameOrigin(img: HTMLImageElement, url: string) {
  if ((new URL(url, window.location.href)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}
