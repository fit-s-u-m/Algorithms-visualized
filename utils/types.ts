export type sortingAlgorithms =
  | "Bubble Sort"
  | "Insertion Sort"
  | "Selection Sort"
  | "Merge Sort"
  | "Quick Sort"
  | "Heap Sort";
export interface SortAlgorithm {
  sort(arr: number[]): ITERATOR
}
export type ITERATOR = Iterator<
  { arr: number[]; index: INDEX[]; swaped: boolean; numComp: number }
>;
export type ITERATOR_RESULT = IteratorResult<
  { arr: number[]; index: INDEX[]; swaped: boolean; numComp: number }
>;
export type INDEX = { i: number; c: string };
export type JSON_DATA = {
  Amharic: {
    letters: string[];
    style: { color: string; bg_color: string };
  };
  nehemiah: {
    letters: string[];
    style: { color: string; bg_color: string; size_multiplier: number };
  };
  AmharicNums: {
    letters: string[];
    style: { color: string; bg_color: string };
  };
};
