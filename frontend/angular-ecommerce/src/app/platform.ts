import { PLATFORM_ID } from '@angular/core';

export function isPlatformBrowser(platformId: Object): boolean {
  return platformId === 'browser';
}
