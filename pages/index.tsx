import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import 'd3-transition'
import Link from 'next/link'
import { MainLayout } from '../layouts/MainLayout'
import { useUser } from '@auth0/nextjs-auth0'

export default function Home() {
  const { user, error, isLoading } = useUser()
  console.log(user)
  return (
    <MainLayout>
      <div className={styles.container}>
        {!user ? (
          <h1>If you want to see graph, please log in</h1>
        ) : (
          <div className={styles.grid}>
            <Link href='/launches'>
              <a className={styles.card}>
                <h3>Launch History</h3>
              </a>
            </Link>
            <Link href='/location'>
              <a className={styles.card}>
                <h3>All location of launchpad</h3>
              </a>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
