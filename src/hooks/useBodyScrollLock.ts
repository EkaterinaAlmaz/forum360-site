import { useEffect } from "react";

let lockCount = 0;
let savedScrollX = 0;
let savedScrollY = 0;

const LOCK_CLASS = "is-scroll-locked";

function applyLock() {
  savedScrollX = window.scrollX;
  savedScrollY = window.scrollY;
  document.documentElement.classList.add(LOCK_CLASS);
  document.body.classList.add(LOCK_CLASS);
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

function releaseLock() {
  const html = document.documentElement;
  const prevScrollBehavior = html.style.scrollBehavior;

  document.documentElement.classList.remove(LOCK_CLASS);
  document.body.classList.remove(LOCK_CLASS);
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";

  html.style.scrollBehavior = "auto";
  window.scrollTo({
    left: savedScrollX,
    top: savedScrollY,
    behavior: "instant",
  });
  html.style.scrollBehavior = prevScrollBehavior;
}

export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      applyLock();
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        releaseLock();
      }
    };
  }, [locked]);
}
