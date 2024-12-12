# useLeadingOperation

Creates a utility for managing asynchronous operations where only the first invocation (the "leading" operation) is allowed to execute until it resolves. Subsequent calls made while the first is pending will throw a `LeadingOperationError`.

## Example

```html
<script setup lang="ts">
import { reactive } from 'vue'
import { useLeadingOperation } from '@txe/vue-async-operations'

const form = reactive({
  text: '',
})

const [submit, submission] = useLeadingOperation(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/', {
    method: 'POST',
    body: JSON.stringify(form),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

  const data = await response.json()

  return data
})
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.text" type="text" placeholder="Write new post..." />
    <button>Submit</button>
  </form>

  <template v-if="submission.isPending">
    <div>Submitting...</div>
  </template>
  <template v-else-if="submission.isFulfilled">
    <div>Post submitted.</div>
  </template>
</template>
```
