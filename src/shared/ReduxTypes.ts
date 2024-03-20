export type TStoreActionWithPayload<SliceName extends string, ActionName extends string, Fn extends (state: any, action: any) => void> = 
  {type: `${SliceName}/${ActionName}`, payload: Parameters<Fn>[1]['payload']}
