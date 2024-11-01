import { ITERATOR } from "../utils/types"
export class BubbleSort {

  *sort(arr: number[]): ITERATOR {
    if (arr.length < 2)// already sorted case
      return { arr, index: -1, swaped: false }
    let swaped = true
    let i = 1
    let numComp = 0
    let n = arr.length

    while (swaped) {
      swaped = false
      let lastSwappedIndex = 0;
      for (let j = 0; j < n - 1; j++) {
        numComp++
        if (arr[j] > arr[j + 1]) {
          this.swap(arr, j + 1, j)
          swaped = true
          lastSwappedIndex = j + 1;
          yield {
            arr: arr.slice(), index: [
              { i: j, c: "red" },
              { i: j + 1, c: "blue" }
            ], swaped: true, numComp
          }
        }
        else {
          yield {
            arr: arr.slice(), index: [
              { i: j, c: "red" },
              { i: j + 1, c: "blue" }
            ], swaped: false, numComp
          }

        }
      }
      i += 1
      n = lastSwappedIndex;
    }
    yield { arr: arr.slice(), index: [], swaped: false, numComp }

  }

  swap(arr: number[], i: number, j: number) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}
