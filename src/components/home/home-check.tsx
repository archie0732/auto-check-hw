'use client';
import Link from 'next/link';
import { AppStore } from '../../../store/app';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function HomeCheckHW() {
  const { user } = AppStore();

  if (user === 'none') {
    return (
      <div className="flex justify-center gap-2">
        <span>您尚未登入?</span>
        <Link href="/login" className="hover:underline">Login</Link>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>HW Check</CardTitle>
        </CardHeader>

        <CardContent>

        </CardContent>
      </Card>
    </>
  );
}
