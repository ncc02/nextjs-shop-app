import { NextResponse } from "next/server";
import prisma from '../../../libs/prismadb';
import getSession from '@/app/actions/getSession'

export async function GET(
    req: Request
) {
    try {
        const categories= await prisma.category.findMany()
        return NextResponse.json({
            "success": true,
            "message": "Get success",
            "data": {categories},
            "error": {}
        });
    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return NextResponse.json({
            "success": false,
            "message": "Internal error",
            "data": {},
            "error": {
                "message":"Internal error"
            }
        }, {status: 500})
    }
}