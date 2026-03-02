declare module 'rc-util/es/hooks/useMergedState' {
  import type { Dispatch, SetStateAction } from 'react';

  // 定义 useMergedState 的类型（根据实际功能调整）
  export default function useMergedState<T>(
    defaultState: T | (() => T),
    option?: {
      value?: T;
      onChange?: (value: T) => void;
      postState?: (value: T) => T;
    },
  ): [T, Dispatch<SetStateAction<T>>];
}


/**
 * 【核心工具类型】SelectiveTypeMapper
 * 根据一个 'TypeMap' 来选择性地替换和统一类型。
 * @TKeys 所有要出现在最终对象中的键的联合类型 (即 DataIndexKeys)。
 * @TypeMap 一个映射对象，用于指定例外键和它们的目标类型。
 * @DefaultType 未在 TypeMap 中定义的键所使用的默认类型 (例如 string)。
 */
export type SelectiveTypeMapper<
  TKeys extends PropertyKey,
  TypeMap extends Partial<Record<TKeys, any>>,
  DefaultType
> = {
  [K in TKeys]: 
    K extends keyof TypeMap
      ? TypeMap[K]
      : DefaultType;
};
