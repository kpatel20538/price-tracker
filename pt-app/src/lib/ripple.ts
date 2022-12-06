export function ripple(node: HTMLElement, duration: number = 350) {
  let x: number = 0;
  let y: number = 0;

  let animationFrame: number = 0;
  let animationStart: number = 0;

  function animationStep(timestamp: number) {
    if (!animationStart) {
      animationStart = timestamp;
    }

    const frame = timestamp - animationStart;
    if (frame < duration) {
      const easing = (frame / duration) * (2 - (frame / duration));

      const circle = `circle at ${x}px ${y}px`;
      const color = `rgba(0, 0, 0, ${0.3 * (1 - easing)})`;
      const stop = `${90 * easing}%`;
      
      node.style.backgroundImage = `radial-gradient(${circle}, ${color} ${stop}, transparent ${stop})`;
      animationFrame = window.requestAnimationFrame(animationStep);
    } else {
      animationStart = 0;
      node.style.backgroundImage = "none";
      window.cancelAnimationFrame(animationFrame);
    }
  }

  function handleClick(event: MouseEvent) {
    x = event.pageX - node.offsetLeft;
    y = event.pageY - node.offsetTop;
    animationFrame = window.requestAnimationFrame(animationStep);
  }

  node.addEventListener("click", handleClick);

  return {
    update(newDuration: number) {
      duration = newDuration;
    },
    destroy() {
      node.removeEventListener('click', handleClick);
      window.cancelAnimationFrame(animationFrame);
    }
  };
}