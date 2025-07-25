import { Suspense } from 'react';
import Register from '../src/components/auth/Register';

export default function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Register />
      </Suspense>
    </div>
  );
}
