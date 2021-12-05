const threshold = [0.01];

let initiated = false;

export let io: IntersectionObserver;

if (!initiated) {
  initiated = true;
  io = new IntersectionObserver(
    entries => {
      entries.forEach(item => {
        if (item.intersectionRatio <= 0) return;
        const target = item.target as HTMLImageElement;
        target.style.visibility = 'visible';
        target.src = target.dataset.src!;
        io.unobserve(target);
      });
    },
    { threshold }
  );
}
