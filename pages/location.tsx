import React, { useEffect, useRef, useState } from 'react'
import { newData } from '../helpers/data/yearNameData'
import { useLocationData } from '../helpers/data/useData'
import { useResizeObserver } from '../helpers/useResizeObserver'
import styles from '../styles/Location.module.scss'
import { PieBar } from '../components/PieBar'
import { fetchData } from '../helpers/graphQL'
import { MainLayout } from '../layouts/MainLayout'
import { useUser } from '@auth0/nextjs-auth0'

const Launches = () => {
  const { user, error, isLoading } = useUser()
  const [data, setData] = useState(newData)
  const [isFetching, setIsFetching] = useState(false)
  const [isFetchingAsyncData, setIsFetchingAsyncData] = useState(false)
  const { pieState, lastYear } = useLocationData(data)
  const wrapperRef = useRef()
  const { height, width } = useResizeObserver(wrapperRef)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('myData'))
    if (data) {
      setData(data)
      return
    }
    fetchData({ setData, toggleFetch: setIsFetchingAsyncData })
  }, [])

  useEffect(() => {
    if (pieState) {
      setIsFetching(true)
    } else {
      setIsFetching(false)
    }
  }, [pieState])

  return (
    <MainLayout>
      <div className={styles.container}>
        {!user ? (
          <h1>If you want to see graph, please log in</h1>
        ) : (
          <h1>All location of launchpad up to {lastYear}</h1>
        )}
        {isFetchingAsyncData && <div>Data is updating</div>}
        <div ref={wrapperRef} className={styles.svg}>
          {user && isFetching && (
            <PieBar width={width} height={height} data={pieState} />
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Launches
