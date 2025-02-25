import { assertEquals } from "@std/assert";
import { add, toOptional } from "./main.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});

Deno.test(function optional(){
  const val=toOptional(1)
    .map(it=>it+1)
    .flatMap(it=>toOptional(it+1)).val;
    assertEquals(val, 3)
})