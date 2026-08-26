# AffiliateShop.Pro Enhanced Build

This build preserves the existing application structure and adds:
- 25 visual theme presets without emoji-only theme cards
- Full-site theme variables and theme-specific surface/header/footer styling
- Mobile product display control (1/2/3 columns), default 2 columns
- Mobile overflow/zoom-safe product card sizing
- Configurable opening/splash animation (style, duration, background, accent, logo/photo, progress)
- Configurable top navigation JSON manager with category dropdown support
- Configurable footer Customer Care, AffiliateShop and Payment Methods JSON managers
- Payment method image/logo URL support
- Product detail page theme panel and configurable deal-button text/color
- Existing 4-image product gallery auto/manual rotation retained
- Analytics clear now also resets product click totals; period clears recalculate remaining totals
- Reduced mobile overflow and improved product-card sizing

Database:
- Existing generic `settings` table is used for the new settings; no new migration is required for these configuration keys.
- Run `npm install` and `npm run db:push` against the Supabase database before deploying if the database schema has not yet been created.

Security:
- Do not commit `.env` or database passwords.
