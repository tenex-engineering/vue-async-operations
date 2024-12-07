<script setup lang="ts">
import type { State } from '../state.types'

const { operation } = defineProps<{
  operation: State<unknown>
}>()

function isError(value: unknown): value is Error {
  return value instanceof Error
}
</script>

<template>
  <div data-testid="operation">
    <template v-if="operation.isInitial">
      <div>initial</div>
    </template>
    <template v-else-if="operation.isPending">
      <div>pending</div>
    </template>
    <template v-else-if="operation.isSettled">
      <div>settled</div>

      <template v-if="operation.isFulfilled">
        <div>fulfilled</div>
        <div>{{ operation.result }}</div>
      </template>
      <template v-else-if="operation.isRejected">
        <div>rejected</div>

        <template v-if="isError(operation.error)">
          <div>{{ operation.error.message }}</div>
        </template>
      </template>
    </template>
  </div>
</template>
