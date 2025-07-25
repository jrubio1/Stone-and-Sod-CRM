/**
 * @file app/invite/page.tsx
 * @description This file contains the page for inviting new users.
 */

import InviteUser from '../src/components/auth/InviteUser';
import AuthGuard from '../src/components/auth/AuthGuard';

const InvitePage = () => {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <div>
        <InviteUser />
      </div>
    </AuthGuard>
  );
};

export default InvitePage;
