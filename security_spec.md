# Security Spec: User Profile Access Control and Integrity

## 1. Data Invariants
- **Owner-Only Read/Write**: A user profile is strictly private; only the owner can read or write to `/users/{userId}`.
- **Immutable Admin Roles**: Users are forbidden from appointing themselves as admins on creation or changing their role after creation.
- **Strict Size and Shape**: Profiles must strictly contain `userId`, `email`, `displayName`, `role`, `createdAt`, and `updatedAt`.
- **System Timestamps**: Creation and update timestamps are governed strictly by the server's transactional time (`request.time`). They cannot be fabricated by the client.

## 2. The "Dirty Dozen" Threat Payloads
These payloads must return `PERMISSION_DENIED` under all conditions:

1. **Anonymous Read**: Attempt to read profile of user `alice` without authentication.
2. **Identity Theft (Foreign Read)**: Authenticated user `bob` attempting to view profile of user `alice`.
3. **Identity Spoofing**: Registering a profile for `alice` under `request.auth.uid = bob`.
4. **Privilege Escalation**: Registering `student` account with role forced to `admin`.
5. **Role Hijacking**: Authenticated owner `alice` attempting to update her role from `student` to `admin`.
6. **Creation Timing Fraud**: Forcing `createdAt` to a historical or future date instead of `request.time`.
7. **Update Timing Fraud**: Forcing `updatedAt` to a historical date instead of `request.time`.
8. **Shadow Field Injection**: Injecting a hidden field `canAcessAllData: true` into the user profile document.
9. **Creation Field Missing**: Attempting to register without a required field (e.g. leaving out `displayName`).
10. **ID Poisoning Attack**: Attempting to create a profile with a 2MB string or garbage characters as a custom `userId`.
11. **Account Deletion Bypass**: Standard user attempting to delete their profile.
12. **Bulk Index Scraping**: Performing a query/list on `/users` collection to scan registered email addresses.

## 3. Security Evaluation Results
- **Pass Status**: All "Dirty Dozen" threat vectors are statically neutralized by the custom layout rules in `/firestore.rules`.
