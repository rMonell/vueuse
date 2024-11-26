import type { MaybeRef, Ref } from 'vue'
import { refDefault, toValue } from '@vueuse/shared'
import { computed, ref, watch } from 'vue'

type ComputeItem<TListItem, TReturnRaw extends boolean, TItemValue> = TReturnRaw extends true
  ? TListItem
  : TItemValue extends (item: TListItem) => infer TResult
    ? TResult
    : TListItem

type ComputeItemValue<TListItem, TMultiple extends boolean, TReturnRaw extends boolean, TItemValue = undefined> = TMultiple extends true
  ? ComputeItem<TListItem, TReturnRaw, TItemValue>[]
  : ComputeItem<TListItem, TReturnRaw, TItemValue>

interface UseListSelectionOptions<TItem, TMultiple extends boolean, TReturnRaw extends boolean, TItemValue> {
  /**
   * Use ref has selection state
   */
  selectionModel?: Ref<ComputeItemValue<TItem, TMultiple, TReturnRaw, TItemValue>>
  mandatory?: MaybeRef<boolean>
  multiple?: MaybeRef<TMultiple>
  /**
   * In case of object array, allows to select the raw data
   */
  selectRaw?: MaybeRef<TReturnRaw>
  /**
   * Custom item value key/getter (Recommended in case of object array).
   */
  itemValue?: (item: TItem) => unknown
}

export function useListSelection<TItem, TMultiple extends boolean, TReturnRaw extends boolean, TItemValue>(
  list: MaybeRef<TItem[]>,
  options?: UseListSelectionOptions<TItem, TMultiple, TReturnRaw, TItemValue>,
) {
  const isMultiple = computed(() => toValue(options?.multiple) || false)

  const source = ref()
  const selection = refDefault<ComputeItemValue<TItem, TMultiple, TReturnRaw, TItemValue>>(
    source,
    (isMultiple.value ? [] : undefined) as ComputeItemValue<TItem, TMultiple, TReturnRaw, TItemValue>,
  )

  const setState = (value: any) => {
    selection.value = value
    if (options?.selectionModel) {
      options.selectionModel.value = value
    }
  }

  const getItemValueKey = (item: TItem) => {
    return (typeof options?.itemValue === 'function' ? options.itemValue(item) : item) as ComputeItemValue<TItem, TMultiple, TReturnRaw, TItemValue>
  }

  const getItemValue = (item: TItem) => toValue(options?.selectRaw) ? item : getItemValueKey(item)

  const isSelected = (item: TItem) => {
    if (isMultiple.value) {
      return (selection.value as any[]).includes(getItemValueKey(item))
    }
    return getItemValueKey(selection.value as any) === getItemValueKey(item)
  }

  const toggle = (item: TItem) => {
    if (isMultiple.value && Array.isArray(selection.value)) {
      setState(isSelected(item) ? selection.value.filter(v => getItemValue(item) !== v) : [...selection.value, getItemValue(item)])
      return
    }
    setState(isSelected(item) ? undefined : getItemValue(item))
  }

  const select = (item: TItem) => setState(isMultiple.value ? [...selection.value as any[], getItemValue(item)] : getItemValue(item))

  const clear = () => setState(isMultiple.value ? [] : undefined)

  const isAllSelected = computed(() => toValue(list).every(isSelected))

  const isEmpty = computed(() => isMultiple.value ? (selection.value as any[]).length > 0 : !!selection.value)

  const isIndeterminate = computed(() => !isEmpty.value && !isAllSelected.value)

  watch(isMultiple, (_isMultiple) => {
    if ((Array.isArray(selection.value) && selection.value.length === 0) || !selection.value) {
      return
    }
    setState(_isMultiple ? [selection.value] : (selection.value as any[])[0])
  })

  watch(() => toValue(options?.selectionModel), newValue => setState(newValue))

  return {
    toggle,
    select,
    clear,
    isSelected,
    selection,
    isIndeterminate,
    isAllSelected,
    isEmpty,
  }
}
