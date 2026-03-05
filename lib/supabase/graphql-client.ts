import { GraphQLClient } from 'graphql-request'

const GRAPHQL_URL = process.env.NEXT_PUBLIC_SUPABASE_GRAPHQL_URL!

/**
 * Client GraphQL public (anon)
 * Folosit în Server Components sau Client Components
 */
export const supabaseGraphqlPublic = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
  },
})

/**
 * Client GraphQL cu service role
 * ⚠️ DOAR pe server
 */
export const supabaseGraphqlService = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
  },
})

/**
 * Client GraphQL cu JWT din user session
 */
export function createUserGraphqlClient(accessToken: string) {
  return new GraphQLClient(GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
