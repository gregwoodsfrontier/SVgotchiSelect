export const playSound = (sound) => {
  const s = new Audio(sound);
  const volume = window.localStorage.getItem("seVolume") ?? "5";
  s.volume = Number(volume) / 10;
  s.play();
}
