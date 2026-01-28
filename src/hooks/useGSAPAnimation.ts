import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export const useGSAPAnimation = () => {
  // Fade in animation
  const fadeIn = (element: HTMLElement, delay: number = 0) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay,
        ease: "power2.out"
      }
    )
  }

  // Slide in from left
  const slideInLeft = (element: HTMLElement, delay: number = 0) => {
    gsap.fromTo(element,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay,
        ease: "power2.out"
      }
    )
  }

  // Slide in from right
  const slideInRight = (element: HTMLElement, delay: number = 0) => {
    gsap.fromTo(element,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay,
        ease: "power2.out"
      }
    )
  }

  // Scale animation
  const scaleIn = (element: HTMLElement, delay: number = 0) => {
    gsap.fromTo(element,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay,
        ease: "power2.out"
      }
    )
  }

  // Stagger animation for multiple elements
  const staggerAnimation = (elements: NodeListOf<HTMLElement> | HTMLElement[], delay: number = 0.1) => {
    gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: delay,
        ease: "power2.out"
      }
    )
  }

  // Scroll triggered animations
  const scrollTriggerAnimation = (element: HTMLElement, animation: object) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      {
        ...animation,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    )
  }

  // Hover animations
  const hoverScale = (element: HTMLElement, scale: number = 1.05) => {
    const tl = gsap.timeline({ paused: true })
    tl.to(element, { scale, duration: 0.3, ease: "power2.out" })
    
    element.addEventListener('mouseenter', () => tl.play())
    element.addEventListener('mouseleave', () => tl.reverse())
    
    return tl
  }

  // Counter animation
  const animateCounter = (element: HTMLElement, endValue: number, duration: number = 2) => {
    const obj = { value: 0 }
    gsap.to(obj, {
      value: endValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        element.innerHTML = Math.floor(obj.value).toString()
      }
    })
  }

  return {
    fadeIn,
    slideInLeft,
    slideInRight,
    scaleIn,
    staggerAnimation,
    scrollTriggerAnimation,
    hoverScale,
    animateCounter
  }
}

// Hook for fade in on mount
export const useFadeInOnMount = (delay: number = 0) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          delay,
          ease: "power2.out"
        }
      )
    }
  }, [delay])

  return ref
}

// Hook for scroll triggered animations
export const useScrollAnimation = (animationType: 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale' = 'fadeIn') => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    
    const animations = {
      fadeIn: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      slideLeft: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      slideRight: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      scale: { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    }

    const fromValues = {
      fadeIn: { opacity: 0, y: 50 },
      slideLeft: { opacity: 0, x: -50 },
      slideRight: { opacity: 0, x: 50 },
      scale: { opacity: 0, scale: 0.8 }
    }

    const animation = gsap.fromTo(element, 
      fromValues[animationType],
      {
        ...animations[animationType],
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    )

    return () => {
      if (animation) animation.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) st.kill()
      })
    }
  }, [animationType])

  return ref
}

// Hook for stagger animations
export const useStaggerAnimation = (delay: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const element = ref.current
    const children = element.children
    if (children.length === 0) return

    const animation = gsap.fromTo(children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    )

    return () => {
      if (animation) animation.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === element) st.kill()
      })
    }
  }, [delay])

  return ref
}

// Hook for counter animations
export const useCounterAnimation = (endValue: number, duration: number = 2) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const obj = { value: 0 }
    const element = ref.current

    const animation = gsap.to(obj, {
      value: endValue,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      onUpdate: () => {
        if (element) {
          element.innerHTML = Math.floor(obj.value).toString()
        }
      }
    })

    return () => {
      animation.kill()
    }
  }, [endValue, duration])

  return ref
}

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: "easeOut" }
}

// Utility function to refresh ScrollTrigger (useful after dynamic content changes)
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh()
}

// Hook to cleanup ScrollTrigger on unmount
export const useScrollTriggerCleanup = () => {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])
}

export default useGSAPAnimation