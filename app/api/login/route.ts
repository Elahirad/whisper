import prisma from '@/prisma/client';
import {NextResponse} from 'next/server';
import bcrypt from 'bcrypt';
import {z} from 'zod';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
	email: z.string(),
	password: z.string(),
});

export async function POST(req: Request) {
	const parsed = loginSchema.safeParse(await req.json());

	if (!parsed.success)
		return NextResponse.json(
			{message: 'Enter valid email and password'},
			{status: 400}
		);

	let user = await prisma.user.findFirst({
		where: {
			email: parsed.data.email,
		},
	});

	if (!user)
		return NextResponse.json({message: 'Invalid credentials.'}, {status: 400});
	if (await bcrypt.compare(parsed.data.password, user.password)) {
		const token = jwt.sign(user, 'asd');
		const res = NextResponse.json({message: 'OK'});
		res.cookies.set('x-auth-token', token, {
			secure: true,
			httpOnly: true,
			maxAge: 27 * 24 * 60 * 60,
		});
		return res;
	} else
		return NextResponse.json({message: 'Invalid credentials.'}, {status: 400});
}
