import { Client, Account, Functions } from 'appwrite'

const client = new Client()

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const functions = new Functions(client)

export const GENERATE_PDF_FUNCTION_ID = '6981ad05001d30bdc40c'

export { client }
