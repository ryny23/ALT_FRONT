import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const InfiniteScroll = ({ items }) => {
  const scrollRef = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    if (!scrollRef.current) return;

    const scrollWidth = scrollRef.current.scrollWidth;
    const viewportWidth = scrollRef.current.offsetWidth;

    const animate = async () => {
      await controls.start({
        x: -scrollWidth / 2,
        transition: { duration: 30, ease: "linear" }
      });
      controls.set({ x: 0 });
      animate();
    };

    animate();

    return () => controls.stop();
  }, [controls, items]);

  return (
    <div className="overflow-hidden">
      <motion.div
        ref={scrollRef}
        className="flex whitespace-nowrap"
        animate={controls}
      >
        {items.concat(items).map((item, index) => (
          <div key={index} className="inline-block px-4">
            <span className="text-2xl font-bold text-blue-100 dark:text-blue-400">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfiniteScroll;