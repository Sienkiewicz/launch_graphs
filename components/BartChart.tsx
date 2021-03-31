import { max } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { select } from 'd3-selection'
import { stack } from 'd3-shape'
import React, { FC, useEffect, useRef } from 'react'
import { PureDataChainType } from '../helpers/types'
import 'd3-transition'
import { comparison } from '../helpers/utils'

type Props = {
  width: number
  height: number
  years: number[]
  data: PureDataChainType[]
  keys: string[]
}

export const BartChart: FC<Props> = ({ width, height, years, data, keys }) => {
  const ref = useRef()
  const svg = select(ref.current)
  const xScale = scaleBand<string | number>()
    .domain(years)
    .range([0, width])
    .padding(0.1)

  const yScale = scaleLinear()
    .domain([0, max(data.map(d => d.total))])
    .range([height, 0])
    .nice()
  const middleHeight = (value: PureDataChainType) =>
    height - (yScale(value[0]) - yScale(value[1])) / 2

  var colorScale = scaleOrdinal<string>(schemeCategory10).domain(keys)

  const stackGen = stack().keys(keys)
  const stackedSeries = stackGen(data)

  const xAxis = axisBottom(xScale)
  const yAxis = axisLeft(yScale)
  useEffect(() => {
    svg
      .select('.x-axis')
      .style('transform', `translateY(${height}px)`)
      .attr('color', '#bfbfbf')
      .call(xAxis)
      .style('font-size', comparison('10px', '8px', width))
      .selectAll('text')
      .attr('y', comparison(0, 15, width))
      .attr('x', comparison(-35, 0, width))
      .attr('dy', '.35em')
      .attr('dx', comparison('0', '-1em', width))
      .attr('transform', `rotate(${comparison(270, 0, width)})`)
      .style('text-anchor', 'start')

    svg
      .select('.y-axis')
      .call(yAxis.tickSize(-width))
      .attr('color', '#bfbfbf')
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick:not(:first-of-type) line')
          .attr('stroke-opacity', 0.5)
          .attr('stroke-dasharray', '2,2')
      )
      .call(g => g.selectAll('.tick text'))

    const tooltip = value => {
      const index = value['index']
      svg
        .selectAll('.tooltip')
        .data([value])
        .join(enter =>
          enter
            .append('text')
            .attr('y', middleHeight(value) - 10)
            .style('fill', 'white')

            .attr('opacity', 0.3)
        )
        .attr('class', 'tooltip')
        .text(keys[index])
        .attr('x', xScale(value.data.year) + xScale.bandwidth())
        .attr('text-anchor', 'middle')
        .transition()
        .attr('y', middleHeight(value) - 15)
        .attr('opacity', 1)
    }
    const group = svg
      .selectAll('.layer')
      .data(stackedSeries)
      .join('g')
      .attr('class', 'layer')
      .attr('fill', layer => colorScale(layer.key))

    group
      .selectAll('rect')
      .data((layer, i) => {
        layer.map(l => (l['index'] = i))
        return layer
      })
      .join('rect')
      .attr('x', sequence => xScale(sequence.data.year))
      .attr('width', xScale.bandwidth())
      .attr('transform', 'scale(1, -1)')
      .attr('y', -height)
      .on('mouseenter', (event, value) => tooltip(value))
      .on('mouseleave', () => svg.select('.tooltip').remove())
      .transition()
      .attr('height', sequence => yScale(sequence[0]) - yScale(sequence[1]))
  }, [width, height, years, data, keys])

  return (
    <div>
      <svg
        ref={ref}
        height={comparison(width, (width * 1) / 3, width)}
        width={'100%'}
        style={{
          overflow: 'visible',
        }}
      >
        <g className='x-axis'></g>
        <g className='y-axis'></g>
      </svg>
    </div>
  )
}
