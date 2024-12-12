# @txe/vue-async-operations

Streamlined async operations for Vue.

## Installation

Available as `@txe/vue-async-operations` via your preferred Node.js package manager.

## Features

| Function                                       | Description                                                     |
| ---------------------------------------------- | --------------------------------------------------------------- |
| [useLeadingOperation](src/leading/README.md)   | Prevents new async operations while one is already in progress. |
| [useTrailingOperation](src/trailing/README.md) | Ignores previous async operations and tracks only the latest.   |

## Example

```html
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useTrailingOperation } from '@txe/vue-async-operations'

const form = reactive({
  query: '',
})

let abortController: AbortController | undefined

const [search, searchOperation] = useTrailingOperation(
  async ({ query }: { query: string }) => {
    abortController?.abort()
    abortController = new AbortController()

    const params = new URLSearchParams({ query, tags: 'story' })

    const response = await fetch(
      `http://hn.algolia.com/api/v1/search?${params}`,
      { signal: abortController.signal },
    )

    const data = await response.json()

    return data
  },
)

watch(
  () => form.query,
  async (query) => {
    if (query === '') {
      return
    }

    await search({ query }).catch((error) => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      throw error
    })
  },
)
</script>

<template>
  <div>
    <form @submit.prevent>
      <input
        v-model="form.query"
        type="text"
        placeholder="Search HN stories..."
      />
    </form>

    <template v-if="searchOperation.isPending">
      <div>Searching...</div>
    </template>
    <template v-else-if="searchOperation.isFulfilled">
      <div v-for="hit of searchOperation.result.hits" :key="hit.objectID">
        <a
          :href="hit.url"
          target="_blank"
          v-html="hit._highlightResult.title?.value"
        ></a>
      </div>
    </template>
  </div>
</template>
```
