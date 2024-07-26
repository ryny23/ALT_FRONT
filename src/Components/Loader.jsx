import React from 'react';
import { dotWave } from 'ldrs'

dotWave.register()



const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <l-dot-wave
        size="200"
        speed="0.8" 
        color="green">
        </l-dot-wave>
    </div>
  );
};

export default Loader;