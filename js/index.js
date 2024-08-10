import { preloadImages } from "./utils.js";

const init = () => {
  const debug = false;
  if (debug) {
    document.querySelector("[data-debug]").classList.add("debug");
  }

  const breakPoint = "53em";
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint})`,
      isMobile: `(max-width: ${breakPoint})`,
    },
    (context) => {
      let { isDesktop } = context.conditions;

      const image = document.querySelector(".card__img");
      const cardList = gsap.utils.toArray(".card");
      const count = cardList.length;
      const sliceAngle = (2 * Math.PI) / count;

      // Distance from the image center to the screen center.
      const radius1 = 50 + image.clientHeight / 2;
      const radius2 = isDesktop ? 250 - radius1 : 180 - radius1;

      // Inside the GSAP timeline where the cards rotate
gsap.timeline()
.from(cardList, {
  y: window.innerHeight / 2 + image.clientHeight * 1.5,
  rotateX: -180,
  stagger: 0.1,
  duration: 0.5,
  opacity: 0.8,
  scale: 3,
})
.set(cardList, {
  transformOrigin: `center ${radius1 + image.clientHeight / 2}px`,
})
.set(".group", {
  transformStyle: "preserve-3d",
})
.to(cardList, {
  y: -radius1,
  duration: 0.5,
  ease: "power1.out",
})
.to(
  cardList,
  {
    rotation: (index) => {
      return (index * 360) / count;
    },
    rotateY: 15,
    duration: 1,
    ease: "power1.out",
  },
  "<"
)
.to(cardList, {
  // Expand the radius
  x: (index) => {
    return Math.round(
      radius2 * Math.cos(sliceAngle * index - Math.PI / 4)
    );
  },
  y: (index) => {
    return (
      Math.round(radius2 * Math.sin(sliceAngle * index - Math.PI / 4)) -
      radius1
    );
  },
  rotation: (index) => {
    return (index + 1) * (360 / count);
  },
})
.to(
  cardList,
  {
    rotateY: 180,
    opacity: 0.8,
    duration: 1,
    onStart: (el) => {
      // Swap the image on rotation start
      const imgElement = el.querySelector(".card__img");
      imgElement.src = "9.jpg";
    },
  },
  "<"
)
.from(
  ".headings",
  {
    opacity: 0,
    filter: "blur(60px)",
    duration: 1,
  },
  "<"
)
.to(cardList, {
  repeat: -1,
  duration: 2,
  onRepeat: () => {
    const randomIndex = Math.floor(Math.random() * count);
    const randomCard = cardList[randomIndex];
    gsap.to(randomCard, {
      rotateY: "+=180",
      onStart: () => {
        // Swap the image back to original or another image when rotating again
        const imgElement = randomCard.querySelector(".card__img");
        imgElement.src = "original.jpg"; // Change this to the original image or another one
      },
      onReverseComplete: () => {
        // Swap to the back image again if needed
        const imgElement = randomCard.querySelector(".card__img");
        imgElement.src = "9.jpg";
      }
    });
  },
})
.to(
  ".group",
  {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "none",
  },
  "<-=2"
);
