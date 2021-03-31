import React, { useEffect, useRef, useState } from 'react'
import { newData } from '../helpers/data/yearNameData'
import { useLaunchData } from '../helpers/data/useData'
import { useResizeObserver } from '../helpers/useResizeObserver'
import styles from '../styles/Launch.module.scss'
import { BartChart } from '../components/BartChart'
import { fetchData } from '../helpers/graphQL'
import { MainLayout } from '../layouts/MainLayout'
import { useUser } from '@auth0/nextjs-auth0'

const Launches = () => {
  const { user, error, isLoading } = useUser()
  const [data, setData] = useState(newData)
  const [isFetching, setIsFetching] = useState(false)
  const [isFetchingAsyncData, setIsFetchingAsyncData] = useState(false)
  const { years, keys, pourData, lastYear } = useLaunchData(data)
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
    if (keys && pourData && years) {
      setIsFetching(true)
    } else {
      setIsFetching(false)
    }
  }, [years, pourData, keys])

  return (
    <MainLayout>
      <div className={styles.container}>
        {!user ? (
          <h1>If you want to see graph, please log in</h1>
        ) : (
          <h1>Launch History up to {lastYear} (per year)</h1>
        )}
        {isFetchingAsyncData && <div>Data is updating</div>}
        <div ref={wrapperRef} className={styles.svg}>
          {user && isFetching && (
            <BartChart
              width={width}
              height={height}
              years={years}
              data={pourData}
              keys={keys}
            />
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Launches
