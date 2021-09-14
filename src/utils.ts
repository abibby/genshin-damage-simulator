/**
 * `byKey` is to be used with the array sort function to sort objects by one of
 * their properties.
 *
 * ```ts
 * const array = [
 *   { foo: 1},
 *   { foo: 7},
 *   { foo: -1},
 * ].sort(byKey('foo'));
 *
 * // array === [
 * //   { foo: -1},
 * //   { foo: 1},
 * //   { foo: 7},
 * // ]
 * ```
 *
 * @param col the column to sort the data by
 * @param order if you want to sort in descending or ascending order
 */
 export function byKey<T>(
    col: keyof T,
    order: "asc" | "desc" = "asc"
  ): (a: T, b: T) => number {
    return (a, b): number => {
      let ret = 0;
      if (a[col] === b[col]) {
        ret = 0;
      } else if (a[col] > b[col]) {
        ret = 1;
      } else {
        ret = -1;
      }
      if (order === "desc") {
        ret = -ret;
      }
      return ret;
    };
  }