<script setup lang="ts">
import { useListSelection } from '@vueuse/core'
import { ref } from 'vue'

const isMultiple = ref(false)
const isMandatory = ref(false)

const list = Array.from({ length: 5 }).map((_, i) => `Item ${i + 1}`)

const { toggle, isAllSelected, isEmpty, isIndeterminate, selection } = useListSelection(list, { multiple: isMultiple, mandatory: isMandatory })
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <label class="checkbox">
        <input
          :checked="isMultiple" type="checkbox" name="multiple"
          @input="isMultiple = ($event.target as HTMLInputElement)!.checked "
        >
        <span>Multiple</span>
      </label>
      <label class="checkbox">
        <input
          :checked="isMandatory" type="checkbox" name="mandatory"
          @input="isMandatory = ($event.target as HTMLInputElement)!.checked "
        >
        <span>Mandatory</span>
      </label>
    </div>
    <div class="flex gap-2">
      <div class="flex flex-col gap-2">
        <button v-for="(item, index) in list" :key="index" class="w-8" @click="toggle(item)">
          {{ item }}
        </button>
      </div>
      <div class="flex flex-col gap-2">
        <div class="note">
          All selected: {{ isAllSelected }}
        </div>
        <div class="note">
          Empty: {{ isEmpty }}
        </div>
        <div class="note">
          Indeterminate: {{ isIndeterminate }}
        </div>
      </div>
      <pre> {{ selection }} </pre>
    </div>
  </div>
</template>
