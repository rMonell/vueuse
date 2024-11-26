import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { useListSelection } from '.'

const defaultList = ['item-1', 'item-2']

const objectList: { id: 'item-1' | 'item-2' }[] = [{ id: 'item-1' }, { id: 'item-2' }]

describe('useListSelection', () => {
  describe('initial selection is', () => {
    it('undefined on single selection', () => {
      const { selection } = useListSelection([])
      expect(selection.value).toBeUndefined()
    })

    it('empty array on multiple selection', () => {
      const { selection } = useListSelection([], { multiple: true })
      expect(selection.value).toStrictEqual([])
    })
  })

  describe('should clear the selection state', () => {
    it('on single selection', () => {
      const { select, clear, selection } = useListSelection(defaultList)
      select(defaultList[0])

      clear()
      expect(selection.value).toBeUndefined()
    })

    it('should update the selection on each ref update', () => {
      const { select, clear, selection } = useListSelection(defaultList, { multiple: true })
      select(defaultList[0])

      clear()
      expect(selection.value).toStrictEqual([])
    })
  })

  it('should update the selection on each multiple selection update', async () => {
    const isMultiple = ref(false)
    const { select, selection } = useListSelection(defaultList, { multiple: isMultiple })
    select(defaultList[0])

    expect(selection.value).toStrictEqual(defaultList[0])

    isMultiple.value = true
    await nextTick()
    expect(selection.value).toStrictEqual([defaultList[0]])

    isMultiple.value = false
    await nextTick()
    expect(selection.value).toStrictEqual(defaultList[0])

    isMultiple.value = true
    await nextTick()
    select(defaultList[1])
    expect(selection.value).toStrictEqual([defaultList[0], defaultList[1]])
  })

  describe('handles selection model', () => {
    it('should update the ref on each selection update', () => {
      const selection = ref()
      const { select } = useListSelection(defaultList, { selectionModel: selection })

      select(defaultList[0])
      expect(selection.value).toBe('item-1')

      select(defaultList[1])
      expect(selection.value).toBe('item-2')
    })

    it('should update the selection on each ref update', async () => {
      const selectionModel = ref()
      const { selection } = useListSelection(defaultList, { selectionModel })

      selectionModel.value = defaultList[1]
      await nextTick()
      expect(selection.value).toBe(defaultList[1])
    })
  })

  it('should select given item value', () => {
    const { select, selection } = useListSelection(objectList, { itemValue: item => item.id })

    select(objectList[0])
    expect(selection.value).toBe('item-1')

    select(objectList[0])
    expect(selection.value).toBe('item-1')

    select(objectList[1])
    expect(selection.value).toBe('item-2')
  })

  it('should select raw value with selectRaw option enabled', () => {
    const { select, selection } = useListSelection(objectList, { selectRaw: true, itemValue: item => item.id })

    select(objectList[0])
    expect(selection.value).toStrictEqual(objectList[0])

    select(objectList[1])
    expect(selection.value).toStrictEqual(objectList[1])
  })

  it('should toggle given item value', () => {
    const { toggle, selection } = useListSelection(defaultList)

    toggle(defaultList[0])
    expect(selection.value).toBe('item-1')

    toggle(defaultList[0])
    expect(selection.value).toBeUndefined()
  })

  describe('should return item selection state', () => {
    it('default behavior', () => {
      const { select, isSelected } = useListSelection(defaultList)

      select(defaultList[0])
      expect(isSelected(defaultList[0])).toBeTruthy()

      select(defaultList[1])
      expect(isSelected(defaultList[0])).toBeFalsy()
      expect(isSelected(defaultList[1])).toBeTruthy()
    })

    it('object list with item value and selectRaw options', () => {
      const { select, isSelected } = useListSelection(objectList, { selectRaw: true, itemValue: item => item.id })

      select(objectList[0])
      expect(isSelected(objectList[0])).toBeTruthy()

      select(objectList[1])
      expect(isSelected(objectList[0])).toBeFalsy()
      expect(isSelected(objectList[1])).toBeTruthy()
    })
  })

  it('should return all item selected state', () => {
    const list = [defaultList[0], defaultList[1]]
    const { select, isAllSelected } = useListSelection(list, { multiple: true })

    select(list[0])
    expect(isAllSelected.value).toBeFalsy()

    select(list[1])
    expect(isAllSelected.value).toBeTruthy()
  })

  it('should return empty selection state', async () => {
    const isMultiple = ref(false)

    const { select, isEmpty, clear } = useListSelection(defaultList, { multiple: isMultiple })

    select(defaultList[0])
    expect(isEmpty.value).toBeFalsy()

    clear()
    expect(isEmpty.value).toBeTruthy()

    isMultiple.value = true
    await nextTick()

    select(defaultList[0])
    expect(isEmpty.value).toBeFalsy()

    clear()
    expect(isEmpty.value).toBeTruthy()
  })

  it('should return indeterminate selection state', () => {
    const list = [defaultList[0], defaultList[1]]

    const { select, isIndeterminate } = useListSelection(defaultList, { multiple: true })

    expect(isIndeterminate.value).toBeFalsy()

    select(list[0])
    expect(isIndeterminate.value).toBeTruthy()

    select(list[1])
    expect(isIndeterminate.value).toBeFalsy()
  })
})
