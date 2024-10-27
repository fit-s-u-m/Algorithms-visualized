export type sortingAlgorithms = "Bubble Sort" | "Insertion Sort" | "Selection Sort" | "Merge Sort" | "Quick Sort" | "Heap Sort"
export interface SortAlgorithm {
  (arr: number[]): Iterator<{ arr: number[], index: INDEX[], swaped: boolean }>
}
export type ITERATOR = Iterator<{ arr: number[], index: INDEX[], swaped: boolean, numComp: number }>
export type ITERATOR_RESULT = IteratorResult<{ arr: number[], index: INDEX[], swaped: boolean, numComp: number }>
export type INDEX = { i: number, c: string }
