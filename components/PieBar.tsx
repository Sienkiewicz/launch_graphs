import { min } from 'd3-array'
import { scaleOrdinal } from 'd3-scale'
import { select, selectAll } from 'd3-selection'
import { arc, pie, PieArcDatum } from 'd3-shape'
import { FC, useEffect, useRef } from 'react'
import 'd3-transition'
import { schemeDark2 } from 'd3-scale-chromatic'
import { DataLocationChainType } from '../helpers/types'
import { comparison } from '../helpers/utils'

type Props = {
  data: DataLocationChainType[]
  height: number
  width: number
  margin?: number
}
export const PieBar: FC<Props> = ({ data, width, height, margin = 50 }) => {
  const graph = useRef()

  const color = scaleOrdinal<string>()
    .domain(data.map(item => item.data))
    .range(schemeDark2)

  const pieForm = pie<DataLocationChainType>()
    .sort(null)
    .value(d => d.value)

  const radius = min([width, height]) / 2 - margin
  const baseArc = arc<PieArcDatum<DataLocationChainType>>()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8)
    .padAngle(comparison(0, 0.02, width))
    .cornerRadius(comparison(0, 4, width))

  const outerArc = arc<PieArcDatum<DataLocationChainType>>()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  const hoverHandler = (index: number, classEl: string, color: string) => {
    selectAll(classEl)
      .filter((d, i) => i === index)
      .attr('stroke', color)
  }
  useEffect(() => {
    const data_ready = pieForm(data)
    const svg = select(graph.current)
      .selectAll('.diagram')
      .data([1])
      .join('g')
      .attr('class', 'diagram')
      .attr('transform', `translate(${width / 2} ${radius})`)

    const targetIndex = (event: MouseEvent) =>
      svg
        .selectAll('.path')
        .nodes()
        .indexOf(event.target as Element)
    svg
      .selectAll('.shape')
      .data([data_ready])
      .join('g')
      .attr('class', 'shape')
      .selectAll('.path')
      .attr('class', '.path')
      .data(data_ready)
      .join('path')
      .attr('d', baseArc)
      .attr('class', 'path')
      .on('mouseenter', event => {
        const index = targetIndex(event)
        hoverHandler(index, '.polyline', 'white')
        hoverHandler(index, 'text', 'white')
        event.currentTarget.style.opacity = 1
      })
      .on('mouseleave', event => {
        const index = targetIndex(event)
        hoverHandler(index, '.polyline', 'gray')
        hoverHandler(index, 'text', 'gray')
        event.currentTarget.style.opacity = 0.7
      })
      .transition()
      .attr('fill', d => color(d.data.data))
      .style('opacity', 0.7)

    svg
      .selectAll('g.poly')
      .data([data_ready])
      .join('g')
      .attr('class', 'poly')
      .selectAll('.polyline')
      .data(data_ready)
      .join('polyline')
      .attr('class', 'polyline')
      .transition()
      .attr('stroke', 'gray')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', d => {
        const posA = baseArc.centroid(d) // line insertion in the slice
        const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        const posC = outerArc.centroid(d) // Label position = almost the same as posB
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1) // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC].toString()
      })

    svg
      .selectAll('g.tooltipText')
      .data([data_ready])
      .join('g')
      .attr('class', 'tooltipText')
      .selectAll('.textTooltip')
      .data(data_ready)
      .join('text')
      .attr('class', 'textTooltip')
      .transition()
      .attr('stroke', 'gray')
      .text(d => d.data.value)
      .attr('transform', d => {
        var pos = outerArc.centroid(d)
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1)
        return 'translate(' + pos + ')'
      })
      .style('text-anchor', d => {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return midangle < Math.PI ? 'start' : 'end'
      })

    const coef = comparison(12, 20, width)
    const legendBlock = svg
      .selectAll('g.legends')
      .data([data])
      .join('g')
      .attr('class', 'legends')
      .attr('transform', `translate(${-width / 4}, 0)`)
    legendBlock
      .selectAll('.legendCircle')
      .data(l => l)
      .join('circle')
      .attr('class', 'legendCircle')
      .attr('fill', l => color(l.data))
      .attr('r', 5)
      .attr('cy', (_, i) => radius + i * coef)

    legendBlock
      .selectAll('.legendText')
      .data(l => l)
      .join('text')
      .attr('class', 'legendText')
      .text(l => l.data)
      .attr('fill', 'white')
      .attr('y', (_, i) => radius + i * coef)
      .attr('x', 10)
      .attr('dy', 5)
      .style('font-size', () => comparison('10px', '12px', width))
  }, [width, height, margin, data])

  return (
    <>
      <svg
        ref={graph}
        width={'100%'}
        style={{
          overflow: 'visible',
        }}
      ></svg>
    </>
  )
}
