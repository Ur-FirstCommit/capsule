# Production checklist

- [ ] Supabase production project created
- [ ] Database schema installed
- [ ] RLS verified with two test users
- [ ] Authentication and callback URLs configured
- [ ] Resend domain and API key configured
- [ ] Environment variables configured
- [ ] App URL configured
- [ ] Optional unlock-email scheduler configured
- [ ] Unlock email tested
- [ ] Password reset tested
- [ ] Capsule privacy tested
- [ ] Mobile and desktop tested
- [ ] Error states tested
- [ ] Production build tested
- [ ] Production deployment tested

Confirm sealed capsule requests return metadata only and `capsule_contents` has no select policy. Never use the service role key in browser code.
