import { describe, it, expect, test } from "vitest";
import { MergeSort } from "../algorithms/mergeSort";
import { ITERATOR } from "../utils/types"

const iteratorToArr = (iterator: ITERATOR) => {
  let result = iterator.next()
  let finalArr: number[] = result.value.arr
  while (!result.done) {
    finalArr = result.value.arr;
    result = iterator.next()
  }
  return finalArr
}
describe("Merge Sort", () => {

  it("sort empty array", () => {
    const testMergeSort = new MergeSort()
    const sortedArr = iteratorToArr(testMergeSort.sort([]))
    expect(sortedArr).toStrictEqual([])
  })

  it("if one item passed", () => {
    const testMergeSort = new MergeSort()
    const itemToTest = 1
    const sortedArr = iteratorToArr(testMergeSort.sort([itemToTest]))
    expect(sortedArr).toStrictEqual([itemToTest])
  })
  it("sort array", () => {
    const testMergeSort = new MergeSort()
    const sortedArr = iteratorToArr(testMergeSort.sort([4, 3, 2, 1]))
    expect(sortedArr).toStrictEqual([1, 2, 3, 4])
  })

  it("sort array 2", () => {
    const testMergeSort = new MergeSort()
    const sortedArr = iteratorToArr(testMergeSort.sort([3, 5, 6, 2, 1]))
    expect(sortedArr).toStrictEqual([1, 2, 3, 5, 6])
  })

})
