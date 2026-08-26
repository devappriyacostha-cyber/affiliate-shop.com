# AffiliateShop.lk — Pro Admin Upgrade

This build keeps the existing Next.js + PostgreSQL + Drizzle stack and upgrades the existing website instead of replacing its visual identity.

## Main upgrades
- Full product CRUD with edit/delete
- Original price + selling/discount price
- Automatic discount percentage
- Multiple product image URLs
- Product/category/banner management
- Settings CMS for site name, tagline, logo URL, social links, hero text, search text
- Theme colors and animation preset selector
- Dynamic browser title and generated favicon
- Real affiliate click analytics
- Analytics clearing
- Faster cached category/banner/settings reads
- Improved product cards and mobile UI
- Existing admin authentication preserved

## Database
After adding the code to your repository, run:

```bash
npm install
npm run db:push
```

Use the same `DATABASE_URL` that your Vercel deployment uses.

If the database already contains old tables, Drizzle will show the required changes before applying them. Back up production data before pushing schema changes.

## Vercel
Set:
- DATABASE_URL
- ADMIN_PASSWORD
- ADMIN_SESSION_SECRET
- NEXT_PUBLIC_SITE_URL

Then deploy the GitHub commit. Vercel will run `npm run build`.

## GitHub Web
Upload/replace the files from this project in the same paths. Do not upload `.env` or production secrets.

The visual theme is controlled from Admin > Settings after the schema has been pushed.


## Motion / Opening UX
- Opening screen is fast by default (650ms) and never displays a percentage counter.
- Admin Settings controls opening logo/name, duration, background color, background image URL and blur.
- Product cards use GPU-friendly hover/tap motion and route transitions are shortened for a responsive feel.
- Admin mutations require a valid server-side admin session.
