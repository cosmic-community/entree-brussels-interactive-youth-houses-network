'use client'

export default function AnimatedShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large floating shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary opacity-5 rounded-full animate-float animation-delay-100"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-secondary opacity-10 rounded-full animate-bounce-gentle animation-delay-300"></div>
      <div className="absolute bottom-32 left-1/4 w-32 h-32 bg-accent opacity-8 rounded-full animate-pulse-slow animation-delay-200"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary opacity-6 rounded-full animate-float animation-delay-500"></div>
      
      {/* Medium shapes */}
      <div className="absolute top-1/2 left-8 w-24 h-24 bg-secondary opacity-15 rounded-full animate-bounce-gentle animation-delay-400"></div>
      <div className="absolute top-1/3 right-16 w-20 h-20 bg-accent opacity-12 rounded-full animate-float animation-delay-100"></div>
      <div className="absolute bottom-1/3 left-1/2 w-28 h-28 bg-primary opacity-8 rounded-full animate-pulse-slow animation-delay-300"></div>
      
      {/* Small accent shapes */}
      <div className="absolute top-60 left-1/2 w-16 h-16 bg-accent opacity-20 rounded-full animate-bounce-gentle animation-delay-200"></div>
      <div className="absolute top-80 right-1/4 w-12 h-12 bg-secondary opacity-25 rounded-full animate-float animation-delay-400"></div>
      <div className="absolute bottom-60 left-1/3 w-14 h-14 bg-primary opacity-18 rounded-full animate-pulse-slow animation-delay-100"></div>
      
      {/* Tiny floating particles */}
      <div className="absolute top-32 left-1/3 w-8 h-8 bg-accent opacity-30 rounded-full animate-bounce-gentle animation-delay-300"></div>
      <div className="absolute top-96 right-1/3 w-6 h-6 bg-secondary opacity-40 rounded-full animate-float animation-delay-500"></div>
      <div className="absolute bottom-40 left-2/3 w-10 h-10 bg-primary opacity-25 rounded-full animate-pulse-slow animation-delay-200"></div>
    </div>
  )
}