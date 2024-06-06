import getSession from '@/app/actions/getSession'
import prisma from '@/app/libs/prismadb'
import axios from 'axios'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })
  if (!product) notFound()
  return product
})

export const getCategorys = cache(async () => {
  const categorys = await prisma.category.findMany({})
  return categorys
})

export interface SearchProductsProps {
  name?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  categoryId?: string | null
  page?: number
  pageSize?: number
  orderBy?: string | null
}

export const searchProducts = async ({
  name,
  minPrice,
  maxPrice,
  categoryId,
  page = 1,
  pageSize = 9,
  orderBy,
}: SearchProductsProps) => {
  const searchConditions: any = {
    isActive: true,
  }

  if (name) {
    searchConditions.name = {
      contains: name,
      mode: 'insensitive',
    }
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    searchConditions.price = {
      gte: minPrice,
      lte: maxPrice,
    }
  } else if (minPrice !== undefined) {
    searchConditions.price = {
      gte: minPrice,
    }
  } else if (maxPrice !== undefined) {
    searchConditions.price = {
      lte: maxPrice,
    }
  }

  if (categoryId) {
    searchConditions.categoryIds = {
      has: categoryId,
    }
  }
  const hasSearchConditions = Object.keys(searchConditions).length > 0

  const skip = (page - 1) * pageSize
  const take = pageSize
  const orderByOption = orderBy === 'desc' ? 'desc' : 'asc'

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: hasSearchConditions ? { AND: [searchConditions] } : {},
      include: {
        category: true,
      },
      orderBy: {
        price: orderByOption,
      },
      skip,
      take,
    }),
    prisma.product.count({
      where: hasSearchConditions ? { AND: [searchConditions] } : {},
    }),
  ])

  return { products, totalCount }
}
