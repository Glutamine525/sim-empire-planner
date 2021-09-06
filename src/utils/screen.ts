export function getScreenSize() {
  const { clientWidth, clientHeight } = document.documentElement;
  return [clientWidth, clientHeight];
}
