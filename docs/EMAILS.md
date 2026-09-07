# Emails

Capsule Ready emails are sent by `/api/cron/unlock`, never from client-side code. The endpoint refreshes due statuses using database time, claims a pending email event with a unique partial index, then sends through Resend. Sent events prevent duplicates. Failed events are recorded and can be retried by a later run.

The endpoint requires `Authorization: Bearer CRON_SECRET`. Configure an external scheduler with that header if automatic email delivery is required. The website itself does not require a cron job to launch or unlock capsules when users visit. The sender must be a verified Resend domain.
