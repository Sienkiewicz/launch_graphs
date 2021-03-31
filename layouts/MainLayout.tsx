import { useUser } from '@auth0/nextjs-auth0'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import styles from '../styles/MainLayout.module.scss'

export const MainLayout = ({ children }) => {
  const { user, error, isLoading } = useUser()
  return (
    <div className={styles.container}>
      <Head>
        <title>Web app about Launch of XSpace</title>
        <meta name='description' content='There are some graphs about launch' />
        <meta name='keywords' content='launch, launchpad' />
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <nav className={styles.nav}>
        <Link href='/'>
          <a className={styles.card}>
            <h3>Home button</h3>
          </a>
        </Link>
        {user ? (
          <a href='/api/auth/logout' className={styles.card}>
            <h3>{isLoading ? 'Loading' : 'Logout'}</h3>
          </a>
        ) : (
          <a href='/api/auth/login' className={styles.card}>
            <h3>{isLoading ? 'Loading' : 'Login'}</h3>
          </a>
        )}
      </nav>
      <main className={styles.main}>{children}</main>
      <footer></footer>
    </div>
  )
}
