import {NextResponse} from 'next/server';

export function POST() {
	const res = NextResponse.json({message: 'OK'});
	res.cookies.delete('x-auth-token');
	return res;
}
