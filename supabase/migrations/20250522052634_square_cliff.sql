/*
  # Create storage buckets for app files

  1. New Storage Buckets
    - `apk_files`: For storing APK application files
    - `app_icons`: For storing app icon images
    - `app_screenshots`: For storing app screenshot images

  2. Security
    - Enable public access for downloading APKs and viewing images
    - Restrict uploads to authenticated users only
*/

-- Create the required storage buckets
insert into storage.buckets (id, name, public)
values 
  ('apk_files', 'apk_files', true),
  ('app_icons', 'app_icons', true),
  ('app_screenshots', 'app_screenshots', true);

-- Set up security policies for apk_files bucket
create policy "Anyone can download APK files"
  on storage.objects for select
  using ( bucket_id = 'apk_files' );

create policy "Authenticated users can upload APK files"
  on storage.objects for insert
  with check ( 
    bucket_id = 'apk_files' 
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Set up security policies for app_icons bucket
create policy "Anyone can view app icons"
  on storage.objects for select
  using ( bucket_id = 'app_icons' );

create policy "Authenticated users can upload app icons"
  on storage.objects for insert
  with check ( 
    bucket_id = 'app_icons'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Set up security policies for app_screenshots bucket
create policy "Anyone can view app screenshots"
  on storage.objects for select
  using ( bucket_id = 'app_screenshots' );

create policy "Authenticated users can upload app screenshots"
  on storage.objects for insert
  with check ( 
    bucket_id = 'app_screenshots'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );