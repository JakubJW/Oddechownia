import { EmailTemplate } from '@/components/emails/EmailTemplate';
import { Resend } from 'resend';
import { env } from '@/env';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(env.NEXT_RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['jakub.2115.wysocki@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 });
  }
}
