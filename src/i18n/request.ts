import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async ({ locale }) => {
  // Try to get locale from URL first, then from cookie
  let selectedLocale = locale;
  
  if (!selectedLocale) {
    const cookieStore = await cookies();
    selectedLocale = cookieStore.get('NEXT_LOCALE')?.value || 'fa';
  }
  
  console.log('🔍 Loading messages for locale:', selectedLocale);

  return {
    locale: selectedLocale,
    messages: (await import(`../../messages/${selectedLocale}.json`)).default
  };
});