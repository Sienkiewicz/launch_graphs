import { useEffect, useState } from "react"

export const useResizeObserver = ref => {
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  }>({ width: 500, height: 500 })
  useEffect(() => {
    const observeTarget = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entire => {
        const path = entire.contentRect
        setDimensions({ width: path.width, height: path.height })
      })
    })
    resizeObserver.observe(observeTarget)
    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [ref])
  return dimensions
}
