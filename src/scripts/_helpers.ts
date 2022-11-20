export function onInit(fn) {
  window.addEventListener('load', fn);
}

export function addScript(url: string, onLoadFn?: (this: GlobalEventHandlers, ev: Event) => void) {
  onInit(() => {
    const script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('defer', '');
    script.onload = onLoadFn;
    document.body.appendChild(script);
  });
}
