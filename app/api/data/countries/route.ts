import { NextResponse } from 'next/server';
import { getCountries } from '@/lib/data-service';

export async function GET() {
  const countries = await getCountries();
  return NextResponse.json(countries);
}
