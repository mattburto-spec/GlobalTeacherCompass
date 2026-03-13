import { NextResponse } from 'next/server';
import { getCityProfiles } from '@/lib/data-service';

export async function GET() {
  const cities = await getCityProfiles();
  return NextResponse.json(cities);
}
