# useTrailingOperation

Wraps an asynchronous function to ensure that only the result of the most recent invocation
is tracked and reflected in the returned state. Even if earlier invocations are still pending,
their results are ignored once a new invocation starts.

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
