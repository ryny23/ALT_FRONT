import React from 'react'
import axios from 'axios'


const ExpertsLoader = async () => {
    const res = await axios.get('https://alt.back.qilinsa.com/wp-json/wp/v2/users')

    return res.data
    
  return (
    <div className=''>
        
    </div>
  )
}

export default ExpertsLoader