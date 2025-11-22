import { EmailTemplate } from '@/components/emails/EmailTemplate';
import { EmailService } from '@/server/services/emails.service';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { data, error } = await EmailService.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['jakub.2115.wysocki@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'Jakub' }),
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
