import React from 'react'
import { Star } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useGSAPAnimation'

interface TestimonialProps {
  testimonial: {
    name: string
    role: string
    company: string
    content: string
    rating: number
    image: string
  }
}

export const TestimonialCard: React.FC<TestimonialProps> = ({ testimonial }) => {
  const ref = useScrollAnimation('fadeIn')

  return (
    <div ref={ref} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
      <div className="text-center">
        <div className="flex justify-center space-x-1 mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        
        <blockquote className="text-xl md:text-2xl font-light text-gray-900 mb-8 leading-relaxed">
          "{testimonial.content}"
        </blockquote>
        
        <div className="flex items-center justify-center space-x-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="text-left">
            <div className="font-semibold text-gray-900">
              {testimonial.name}
            </div>
            <div className="text-gray-600 font-light">
              {testimonial.role}
            </div>
            {testimonial.company && (
              <div className="text-gray-500 text-sm">
                {testimonial.company}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TestimonialSliderProps {
  testimonials: Array<{
    name: string
    role: string
    company: string
    content: string
    rating: number
    image: string
  }>
  currentIndex: number
  onIndexChange: (index: number) => void
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
  currentIndex,
  onIndexChange
}) => {
  const ref = useScrollAnimation('fadeIn')

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      <TestimonialCard testimonial={testimonials[currentIndex]} />

      {/* Testimonial indicators */}
      <div className="flex justify-center space-x-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-indigo-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default TestimonialCard