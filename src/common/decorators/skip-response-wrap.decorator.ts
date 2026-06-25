import { SetMetadata } from '@nestjs/common';

export const SKIP_RESPONSE_WRAP = 'skipResponseWrap';
export const SkipResponseWrap = (): ReturnType<typeof SetMetadata> =>
  SetMetadata(SKIP_RESPONSE_WRAP, true);
