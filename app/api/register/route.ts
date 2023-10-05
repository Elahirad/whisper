import prisma from '@/prisma/client';
import {NextResponse} from 'next/server';
import bcrypt from 'bcrypt';
import {z} from 'zod';

const registerSchema = z.object({
	email: z.string(),
	name: z.string(),
	password: z.string(),
});

export async function POST(req: Request) {
	const parsed = registerSchema.safeParse(await req.json());
	if (!parsed.success)
		return NextResponse.json({message: 'Invalid user data.'}, {status: 400});
	let user = await prisma.user.findFirst({where: {email: parsed.data.email}});
	if (user)
		return NextResponse.json(
			{message: 'There is a user registered with this email.'},
			{status: 400}
		);
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(parsed.data.password, salt);

	let newUser = await prisma.user.create({
		data: {
			email: parsed.data.email,
			name: parsed.data.name,
			password: hashedPassword,
		},
	});

	return NextResponse.json(newUser);
}
