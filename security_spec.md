# Security Specification for Digital Oromia

## 1. Data Invariants
- A User document must have a `uid` matching the document ID and the `request.auth.uid`.
- A Course can only be created/updated/deleted by an admin (currently disabled for client SDKs).
- An Enrollment must belong to the user creating it (`userId` matches `request.auth.uid`).
- An Enrollment must point to an existing `courseId`.
- Progress tracking in Enrollments can only be updated by the owner of that enrollment.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Identity Spoofing**: Create a user document with `uid: "victim_id"` while logged in as `attacker_id`.
   - Result: PERMISSION_DENIED
2. **Shadow Field Injection**: Update a user profile with an extra `isAdmin: true` field.
   - Result: PERMISSION_DENIED
3. **Course Defacement**: Attempt to `update` a course title as a regular student.
   - Result: PERMISSION_DENIED
4. **Unauthorized Enrollment Listing**: Attempt to `list` all enrollments without a filter on `userId`.
   - Result: PERMISSION_DENIED
5. **Enrolling Others**: Create an enrollment where `userId` is someone else's ID.
   - Result: PERMISSION_DENIED
6. **Orphaned Enrollment**: Create an enrollment for a `courseId` that doesn't exist.
   - Result: PERMISSION_DENIED
7. **Progress Faking**: Update enrollment progress for another user's enrollment.
   - Result: PERMISSION_DENIED
8. **PII Leak**: Attempt to `get` another user's profile document.
   - Result: PERMISSION_DENIED
9. **Timestamp Manipulation**: Create an enrollment with `enrolledAt` set to a date in the past (not `request.time`).
   - Result: PERMISSION_DENIED
10. **Junk ID Attack**: Create a course with a 2KB long string as ID.
    - Result: PERMISSION_DENIED (via `isValidId` check if applied, though course creation is disabled currently)
11. **State Shortcut**: Update enrollment status directly to "completed" without following course requirements (if logic exists).
    - Result: Restricted via `affectedKeys()` if we want to be strict.
12. **Blanket Read Query**: Query `/courses` while not signed in.
    - Result: PERMISSION_DENIED

## 3. Deployment Plan
1. Finalize `firestore.rules` from `DRAFT_firestore.rules`.
2. Deploy via `deploy_firebase`.
