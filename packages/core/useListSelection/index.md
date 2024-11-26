---
category: Utilities
---

# useListSelection

Manages a selection through a list of items.

## Usage

### Single selection

```ts
import { useListSelection } from '@vueuse/core'

const { selection, select } = useListSelection(['Dog', 'Cat', 'Lizard'])

select('Dog')

console.log(selection.value) // 'Dog'

select('Cat')

console.log(selection.value) // 'Cat'
```

### Multiple selection

```ts
import { useListSelection } from '@vueuse/core'

const { selection, isAllSelected, isIndeterminate, select } = useListSelection(['Dog', 'Cat', 'Lizard'], { multiple: true })

select('Dog')

console.log(selection.value) // ['Dog']
console.log(isAllSelected.value) // false
console.log(isIndeterminate.value) // true

select('Cat')

console.log(selection.value) // ['Dog', 'Cat']
console.log(isAllSelected.value) // true
console.log(isIndeterminate.value) // false
```

### Object list

In case of list of object, this `itemValue` is highly recommended.

```ts
import { useListSelection } from '@vueuse/core'

const { selection, select } = useListSelection([
  { id: 'dog' },
  { id: 'cat' },
  { id: 'lizard' },
], {
  itemValue: item => item.id
})

select('dog')

console.log(selection.value) // 'dog'
```

In some case, you may want your selection to includes the raw object and not the provided `itemValue`. In this case, use the `selectRaw` option.

```ts
import { useListSelection } from '@vueuse/core'

const { selection, select } = useListSelection([
  { id: 'dog' },
  { id: 'cat' },
  { id: 'lizard' },
], {
  selectRaw: true,
  itemValue: item => item.id
})

select('dog')

console.log(selection.value) // '{ id: 'dog' }'
```

### Custom selection model

In case of list of object, this `itemValue` is highly recommended.

```ts
import { useListSelection } from '@vueuse/core'

const selectionModel = ref<string>()

const { select } = useListSelection(['Dog', 'Cat', 'Lizard'], { selectionModel })

select('Dog')

console.log(selectionModel.value) // 'Dog'

select('Cat')

console.log(selectionModel.value) // 'Cat'
```
