import { db } from '@/db';
import { settings } from '@/db/schema';
import { NextResponse } from 'next/server';

const PUBLIC_KEYS = new Set([
  'siteName','siteTagline','logoUrl','faviconUrl','facebookUrl','youtubeUrl','instagramUrl',
  'primaryColor','accentColor','backgroundColor','backgroundColorTwo','backgroundStyle','backgroundAngle',
  'viewDealColor','viewDealText','productDealText','categorySelectedColor','sortSelectedColor','hoverColor',
  'headerCtaColor','footerActionColor','otherPrimaryColor','animation','themePreset','productLayout',
  'mobileProductColumns','navMenu','heroTitle','heroSubtitle','featuredTitle','searchPlaceholder',
  'splashStyle','splashDuration','splashBackground','splashAccent','splashBackgroundImage','splashBackgroundBlur','splashShowLogo','splashShowName','splashName',
  'footerCustomerCare','footerAffiliateShop'
]);

export async function GET() {
  try {
    const allSettings = await db.query.settings.findMany();
    const config = allSettings.reduce((acc: any, curr) => {
      if (PUBLIC_KEYS.has(curr.key)) acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}
