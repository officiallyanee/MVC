import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

function Animation({ activePage }) {
  const isPageSelected = activePage && activePage !== '/home' && activePage !== '/' && activePage !== '/login';
  const isInitialLoad = useRef(true);
  useEffect(() => {
    isInitialLoad.current = false;
  }, []);
  return (
    <>
      <motion.div
        className="absolute left-[5%] top-[32.2%]"
        animate={{
          x: isPageSelected ? '-1.5%' : '0%',
          y: isPageSelected ? '-30vh' : '0%',
          scale: isPageSelected ? 0.25 : 1,
        }}
        transition={{
          duration:isInitialLoad.current ? 0 : 0.9,
          ease: "easeInOut",
          delay: isPageSelected ? 0 : 1.7
        }}
      >
        <div className="w-[49.5%] flex-col justify-start items-start inline-flex">
          <div className="self-stretch left-[5%] top-[32.2%] absolute text-yellow-300 font-normal font-['Notable'] tracking-[0.25vw] text-[clamp(4rem,12.5vw,11.25rem)] leading-tight">Amor</div>
          <div className="self-stretch left-[5%] top-[32.2%] absolute text-white font-normal font-['Fleur_De_Leah'] tracking-[0.4vw] [text-shadow:_0px_0.5vw_0.5vw_rgb(0_0_0_/_1.00)] text-[clamp(2.5rem,6.9vw,6.25rem)] leading-tight">Restro</div>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-0 top-[63.7%] h-[25%] w-full overflow-hidden bg-stone-900"
        animate={{
          y: isPageSelected ? '40vh' : '0vh',
          opacity: isPageSelected ? 0 : 1,
        }}
        transition={{
          duration: isInitialLoad.current ? 0 : 0.5,
          ease: "easeInOut",
          delay: isPageSelected ? 0.9 : 1.2
        }}
      >
        <div className="absolute left-[5%] top-[4%] w-[54%] font-['Pompiere'] text-[clamp(1rem,3.3vw,3rem)] font-normal leading-tight tracking-wide text-white">
          Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.
        </div>
      </motion.div>

      <motion.img
        src="/bowl.png"
        className="absolute h-full right-[-25%] top-0 object-contain"
        animate={{
          x: isPageSelected ? '-150vw' : '0vw',
          rotate: isPageSelected ? -360 : 0,
        }}
        transition={{
          duration: isInitialLoad.current ? 0 : 1.2,
          ease: "circOut",
          delay: isPageSelected ? 1.4 : 0
        }}
      />

   
    </>
  );
}

export default Animation;