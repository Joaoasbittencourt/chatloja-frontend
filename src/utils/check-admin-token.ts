import { GetServerSidePropsContext } from 'next'

export const isValidAdminToken = (ctx: GetServerSidePropsContext) => {
  const token = ctx.query.token as string
  return token === process.env.ADMIN_TOKEN
}
