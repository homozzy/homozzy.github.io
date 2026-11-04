import { getCliClient } from 'sanity/cli'
console.log('getCliClient', typeof getCliClient)
const client = getCliClient({ apiVersion: '2024-01-01' })
console.log('client', typeof client, typeof client.create)
