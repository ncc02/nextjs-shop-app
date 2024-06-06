import prisma from '@/app/libs/prismadb'
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

export interface SearchProductsProps {
  name : string
  minPrice: number | null
  maxPrice: number | null
  categoryId : string | null
  page : number
  pageSize : number
}

export const searchProducts = async ({ name, minPrice, maxPrice, categoryId, page = 1, pageSize = 10 } : SearchProductsProps) => {
  const searchConditions : any = {};

  if (name) {
    searchConditions.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (minPrice !== undefined && maxPrice !== undefined) {
    searchConditions.price = {
      gte: minPrice,
      lte: maxPrice,
    };
  } else if (minPrice !== undefined) {
    searchConditions.price = {
      gte: minPrice,
    };
  } else if (maxPrice !== undefined) {
    searchConditions.price = {
      lte: maxPrice,
    };
  }

  if (categoryId) {
    searchConditions.categoryIds = {
      contains: categoryId,
    };
  }

  const hasSearchConditions = Object.keys(searchConditions).length > 0;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const products = await prisma.product.findMany({
    where: hasSearchConditions ? { AND: [searchConditions] } : {},
    include: {
      category: true,
    },
    skip,
    take,
  });

  return products;
};
