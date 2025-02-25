export function add(a: number, b: number): number {
  return a + b;
}

export interface Optional<T> {
  val: T,
  map<U>(fx: (v: T) => U): Optional<U>,
  flatMap<U>(fx: (v: T) => Optional<U>): Optional<U>,
  ifNull<U>(fx: (v: T) => U): Optional<U>,
  mapAsync<U>(fx: (v: T) => Promise<U>): Promise<U>
}


function _ifNull<T>(v: T): <U>(transform: (val: T) => U) => Optional<U> {
  return <U>(transform: (v: T) => U) => {
    const val = !v ? transform(v) : v as unknown as U;
    return {
      val,
      map: _map(val),
      flatMap: _flatMap(val),
      ifNull: _ifNull(val),
      mapAsync: _mapAsync(val)
    };
  }
}

function _map<T>(v: T): <U>(transform: (val: T) => U) => Optional<U> {
  return <U>(transform: (v: T) => U) => {
    const val = v ? transform(v) : v as unknown as U;
    return {
      val,
      map: _map(val),
      flatMap: _flatMap(val),
      ifNull: _ifNull(val),
      mapAsync: _mapAsync(val)
    };
  }
}

function _flatMap<T>(v: T): <U>(transform: (val: T) => Optional<U>) => Optional<U> {
  return <U>(transform: (v: T) => Optional<U>) => {
    const val = v ? transform(v).val : v as unknown as U;
    return {
      val,
      map: _map(val),
      flatMap: _flatMap(val),
      ifNull: _ifNull(val),
      mapAsync: _mapAsync(val)
    };
  }
}

function _mapAsync<T>(v: T): <U>(transform: (val: T) => Promise<U>) => Promise<U> {
  return <U>(transform: (v: T) => Promise<U>) => transform(v).then(v => v)
}

export function toOptional<T>(val: T): Optional<T> {
  return {
    val,
    map: _map(val),
    flatMap: _flatMap(val),
    ifNull: _ifNull(val),
    mapAsync: _mapAsync(val)
  };
}


// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
  console.log(
    toOptional('')
      .ifNull(_ => 101)
      .flatMap(v => toOptional(v + 1))
      .map(v => `val=${v}`)
      .map(a => a.toUpperCase()).val
  )
  toOptional(1).mapAsync(v => Promise.resolve(v + 1)).then(a => console.log(a))
  //Map(2, v=>v.toString())
}
