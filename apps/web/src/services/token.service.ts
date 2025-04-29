import jwt from 'jsonwebtoken'

export const getUserIdFromToken = async ({ token }: { token: string }) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string }
  const { id } = decoded
  console.log(`\n==============user_id: ${id}==============\n`)
  return id
}
