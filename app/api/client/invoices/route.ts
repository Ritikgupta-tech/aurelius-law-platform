import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'client-usr-101';

    const invoices = db.getInvoices(userId);
    return NextResponse.json({ success: true, invoices });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, paymentMethod } = body;

    if (!invoiceId) {
      return NextResponse.json({ success: false, error: 'invoiceId is required' }, { status: 400 });
    }

    const updated = db.payInvoice(invoiceId, paymentMethod || 'Online Escrow Trust Settlement');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, invoice: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
