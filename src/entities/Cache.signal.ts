import { signal } from '@preact/signals-react';

export const signalCacheCommonNoteUpdate = signal({ lastUpdate: new Date(), data: [] });

