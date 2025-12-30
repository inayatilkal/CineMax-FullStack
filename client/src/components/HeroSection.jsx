import React from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {

  const navigate = useNavigate()

  return (
    <div style={{ backgroundImage: `url(${assets.backgroundImage})` }} className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen'>

      <div className='mt-20'>
        <h1 className='text-5xl md:text-[70px] md:leading-tight font-semibold' style={{ color: '#18b5f3ff' }}>De De</h1>
        <div style={{ borderTop: '2px solid gray', width: '100%', marginTop: '5px', marginBottom: '15px' }} />
        <h1 className='text-5xl md:text-[70px] md:leading-tight font-semibold' style={{ color: '#18b5f3ff' }}><span style={{ fontFamily: 'sans-serif', color: '#dd36a0ff' }}>Pyar</span >De <span style={{ fontFamily: 'sans-serif', color: '#dd36a0ff' }}>2</span ></h1>
        <div style={{ borderTop: '2px solid gray', width: '100%', marginTop: '15px', marginBottom: '10px' }} />
      </div>


      <div className='flex items-center gap-4 text-gray-300'>
        <span className='text-red-500 font-semibold text-lg'>Comedy | Romance </span>
        <div className='flex items-center gap-1 text-red-500'>
          <CalendarIcon className='w-4.5 h-4.5' /> 2025
        </div>
        <div className='flex items-center gap-1 text-red-500'>
          <ClockIcon className='w-4.5 h-4.5' /> 2h 26m
        </div>
      </div>
      <p className='max-w-md text-gray-300'>Ashish confronts the ultimate challenge of his age-gap romance as he visits Ayesha's family home.</p>
      <button onClick={() => navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
        Explore Movies
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  )
}

export default HeroSection
