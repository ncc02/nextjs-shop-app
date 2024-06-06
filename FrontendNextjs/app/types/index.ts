import { Session } from 'next-auth'

export type SessionUser = {
  id?: string | null | undefined
  name?: string | null | undefined
  email?: string | null | undefined
  image?: string | null | undefined
  role?: 'admin' | 'user' | null | undefined
}

export type MySession = Session & {
  user?: SessionUser
}
export type PublicUserType = {
  id: string
  name: string | null
  email: string | null
  role: string
  address: string | null
  phoneNumber: string | null
  birthDate: Date | null
  image: string | null
  createdAt: Date
}
export type ServerPageProps<PARAMS = any, SEARCHPARAMS = any> = {
  params?: PARAMS
  searchParams?: SEARCHPARAMS
}

export type CartItem = {
  productId: string
  productPrice: number
  quantity: number
}
