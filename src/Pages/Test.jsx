import React from 'react'
import Set2 from '../Components/Set2'
import TextReveal from '../Components/TextReveal'
import TextGenerateEffect from '../Components/TextGenerateEffect'


  const text = `Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths. 
                Suddenly you become euphoric, docile. You accept your fate. It's all right here. 
                Emergency water landing, six hundred miles an hour. Blank faces, calm as Hindu cows.`;

const Test = () => {
  return (
    <div>
        <Set2/>
        <TextReveal/>
        <TextGenerateEffect words={text} />
    </div>
  )
}

export default Test