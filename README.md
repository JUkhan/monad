## Example

```ts
import { add, toOptional } from "./main.ts";

console.log("Add 2 + 3 =", add(2, 3));
console.log(
  toOptional('')
    .ifNull(_ => 101)
    .flatMap(v => toOptional(v + 1))
    .map(v => `val=${v}`)
    .map(a => a.toUpperCase()).val
)
toOptional(1).mapAsync(v => Promise.resolve(v + 1)).then(a => console.log(a))
```

## Run

```bash
deno main.ts
```