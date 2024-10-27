import { ITERATOR } from "../utils/types"
export class SelectionSort {

  *sort(arr: number[]): ITERATOR {
    if (arr.length < 2)// already sorted case
      return { arr, index: 1, swaped: false }
    let counter = 0
    for (let i = 0; i < arr.length - 1; i++) { // until second last elt
      let min = arr[i]
      let minIndex = i
      for (let j = i + 1; j < arr.length; j++) { // check sorted
        counter++
        if (arr[j] <= min) {
          min = arr[j] // undate the min
          minIndex = j
          yield {
            arr, index: [
              { i: j, c: "red" },
              { i: minIndex, c: "blue" },
              { i: i, c: "green" }
            ],
            swaped: true, numComp: counter
          }
        }
        else {
          yield {
            arr, index: [
              { i: j, c: "red" },
              { i: minIndex, c: "blue" },
              { i: i, c: "green" }
            ],
            swaped: false, numComp: counter
          }
        }
      }
      this.swap(arr, i, minIndex)
      yield {
        arr, index: [
          { i: i, c: "red" },
          { i: minIndex, c: "blue" },
        ],
        swaped: false, numComp: counter
      }
    }
    yield {
      arr, index: [],
      swaped: false, numComp: counter
    }
  }

  swap(arr: number[], i: number, j: number) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}
