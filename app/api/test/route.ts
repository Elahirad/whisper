import {NextResponse} from 'next/server';
import prisma from '@/prisma/client';

export async function GET() {
	await prisma.image.create({data: {}});
	const images = await prisma.image.findMany();
	return NextResponse.json({message: 'OK', data: {images}});
}
