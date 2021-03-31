import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { Dispatch } from 'react'
import { DataType } from '../helpers/types'

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/',
  cache: new InMemoryCache(),
})

type Props = {
  setData: Dispatch<DataType>
  toggleFetch: Dispatch<boolean>
}

export const fetchData = async ({ setData, toggleFetch }: Props) => {
  toggleFetch(true)
  console.log('run')
  const { data } = await client.query({
    query: gql`
      {
        launchesPastResult {
          result {
            totalCount
          }
          data {
            launch_year
            rocket {
              rocket_name
            }
            launch_site {
              site_name
            }
          }
        }
      }
    `,
  })
  setData(data.launchesPastResult.data)
  localStorage.setItem('myData', JSON.stringify(data.launchesPastResult.data))
  toggleFetch(false)
}
