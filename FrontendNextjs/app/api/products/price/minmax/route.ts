import { NextResponse } from "next/server";
import prisma from '../../../../libs/prismadb'

export async function GET(req: Request) {
  try {
   
    //get min and max price of products
    const minPriceProduct = await prisma.product.findFirst({
        orderBy: {
            price: 'asc',
        },
    });

    const maxPriceProduct = await prisma.product.findFirst({
        orderBy: {
            price: 'desc',
        },
    });
    
    const minPriceResult = minPriceProduct?.price;
    const maxPriceResult = maxPriceProduct?.price;

    return NextResponse.json({
      success: true,
      message: 'Get success',
      data: { minPrice:minPriceResult, maxPrice:maxPriceResult },
      error: {},
    });
  } catch (error) {
    console.log('[PRODUCTS_GET_MIN_MAX]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal error',
        data: {},
        error: {
          message: 'Internal error',
        },
      },
      { status: 500 },
    );
  }
}
