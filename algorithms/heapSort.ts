import { INDEX, ITERATOR } from "../utils/types"
import { Heap } from "../data_structures/heap"
export class HeapSort {
  heap: Heap;
  counter = 0;
  indexes: INDEX[] = []
  constructor() {
    this.heap = new Heap()
  }
  * sort(arr: number[]): ITERATOR {
    if (arr.length < 2) return { arr, index: this.indexes, swaped: false, numComp: 1 }
    yield* this.buildHeap(arr)
    for (let i = arr.length - 1; i >= 0; i--) {
      const colorIndex = { i: 0, c: "blue" }
      const colorMaxIndex = { i: i, c: "red" }
      const highlights = [...this.indexes.map(value => ({ ...value })), colorMaxIndex, colorIndex]; // Clone and highlight
      yield {
        arr: arr.slice(),
        index: highlights
        , swaped: true, numComp: this.counter
      }
      this.swap(arr, 0, i) // swap first and last
      this.indexes.forEach((value) => {
        if (value.i == i)
          value.c = "white"
      })
      yield* this.heapify(arr, i)
    }
    return {
      arr: arr.slice(),
      index: this.indexes.slice()
      , swaped: false, numComp: this.counter
    }
  }
  * heapify(arr: number[], arrLimit = arr.length, startingIndex = 0) {
    let isRightPosition: boolean = false
    let index = startingIndex
    if (arrLimit == 0) return
    while (!isRightPosition) {
      this.counter += 1
      const parent = arr[index]
      let l = this.heap.getLeftIndex(index)
      let r = this.heap.getRightIndex(index)
      let maxIndex = this.whoHasMax(arr, l, r, arrLimit)
      if (maxIndex == undefined || maxIndex >= arrLimit) break
      if (arr[maxIndex] > parent) {
        this.swap(arr, index, maxIndex)
        const colorIndex = { i: index, c: "blue" }
        const colorMaxIndex = { i: maxIndex, c: "red" }
        const highlights = [...this.indexes.map(value => ({ ...value })), colorMaxIndex, colorIndex]; // Clone and highlight
        yield {
          arr: arr.slice(),
          index: highlights.slice(),
          swaped: true, numComp: this.counter
        }
        index = maxIndex
      }
      else
        isRightPosition = true
    }
    yield {
      arr: arr.slice(),
      index: this.indexes.slice()
      , swaped: false, numComp: this.counter
    }
  }
  * buildHeap(arr: number[]) {
    if (arr.length < 2) return { arr, index: this.indexes, swaped: false, numComp: 1 }
    const numLevel = Math.floor(Math.log2(arr.length));
    for (let i = arr.length - 1; i >= 0; i--) { // checking staring from the childrens
      const parrentIndex = this.heap.getParrentIndex(i)
      const parrent = arr[parrentIndex]
      const child = arr[i]
      const level = Math.floor(Math.log2(i + 1))
      const color = this.getColorForLevel(level, numLevel);
      this.indexes.push({ i, c: color })
      if (parrent < child)
        yield* this.heapify(arr, arr.length, parrentIndex)
    }
  }
  getColorForLevel(level: number, maxLevel: number, brightness = 50): [number, number, number] {
    const hue = (level / maxLevel) * 360;
    const saturation = 100
    return [hue, saturation, brightness];
  }
  whoHasMax(arr: number[], l: number, r: number, limit: number) {
    const left = l < limit && arr[l] ? arr[l] : undefined
    const right = r < limit && arr[r] ? arr[r] : undefined
    if (right != undefined && left != undefined)
      return left > right ? l : r
    else {
      return left ? l : r
    }
  }
  swap(arr: number[], i: number, j: number) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

}
