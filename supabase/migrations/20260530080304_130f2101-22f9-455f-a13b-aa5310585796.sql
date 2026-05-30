
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

GRANT INSERT ON public.membership_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.membership_applications TO authenticated;
GRANT ALL ON public.membership_applications TO service_role;

GRANT INSERT ON public.bhawan_bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bhawan_bookings TO authenticated;
GRANT ALL ON public.bhawan_bookings TO service_role;

GRANT INSERT ON public.ad_enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.ad_enquiries TO authenticated;
GRANT ALL ON public.ad_enquiries TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Ensure handle_new_user trigger exists on auth.users so signups create profile + role
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
