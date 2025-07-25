/**
 * @file app/accept-invite/page.tsx
 * @description This file contains the page for accepting user invitations.
 */

import { Suspense } from 'react';
import AcceptInvite from '../src/components/auth/AcceptInvite';

export default function AcceptInvitePage() {
  return (
    <div>
      <h1>Accept Invitation</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <AcceptInvite />
      </Suspense>
    </div>
  );
}
