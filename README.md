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

[Try in StackBlitz!](https://stackblitz.com/edit/vitejs-vite-camb7nef?file=src%2FApp.vue)

```html
<script setup>
  import { useTrailingOperation } from '@txe/vue-async-operations'

  let abortController = new AbortController()

  const [search, searchOperation] = useTrailingOperation(async (query) => {
    abortController.abort('replaced')
    abortController = new AbortController()

    const params = new URLSearchParams({ query, tags: 'story' })

    const response = await fetch(
      `https://hn.algolia.com/api/v1/search?${params}`,
      { signal: abortController.signal },
    )

    const data = await response.json()

    return data
  })
</script>

<template>
  <form @submit.prevent>
    <input
      @input="(event) => search(event.target.value)"
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
        target="_blank"
        :href="
          hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`
        "
        v-html="hit._highlightResult.title?.value"
      ></a>
    </div>
  </template>
</template>
```
