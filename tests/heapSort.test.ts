import { describe, it, expect } from "vitest";
import { HeapSort } from "../algorithms/heapSort";
import { ITERATOR } from "../utils/types";

// Helper function to convert an iterator to an array
const iteratorToArr = (iterator: ITERATOR) => {
  let result = iterator.next();
  let finalArr: number[] = result.value.arr || []; // Handle case if value is undefined
  while (!result.done) {
    finalArr = result.value.arr;
    result = iterator.next();
  }
  return finalArr;
}

describe("Heap Sort", () => {
  it("should return an empty array when given an empty array", () => {
    const heap = new HeapSort();
    const arr = [];
    const answer = heap.buildHeap(arr);
    expect(iteratorToArr(answer)).toEqual([]);
  });

  it("should heapify an array with two elements", () => {
    const heap = new HeapSort();
    const arr = [1, 2];
    const answer = heap.buildHeap(arr);
    expect(iteratorToArr(answer)).toEqual([2, 1]);
  });

  it("should correctly heapify an array of numbers", () => {
    const heap = new HeapSort();
    const arr = [5, 7, 6, 8, 9, 2, 3, 4];
    const answer = heap.buildHeap(arr);
    expect(iteratorToArr(answer)).toEqual([9, 8, 6, 5, 7, 2, 3, 4]);
  });

  it("should correctly heapify another array of numbers", () => {
    const heap = new HeapSort();
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const answer = heap.buildHeap(arr);
    expect(iteratorToArr(answer)).toEqual([9, 8, 7, 4, 5, 6, 3, 2, 1]);
  });

  it("should sort an already sorted array", () => {
    const heap = new HeapSort();
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const answer = heap.sort(arr.slice());
    expect(iteratorToArr(answer)).toEqual(arr.slice());
  });

  it("should sort a reverse sorted array", () => {
    const heap = new HeapSort();
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();
    const answer = heap.sort(arr.slice());
    expect(iteratorToArr(answer)).toEqual(arr.slice().sort());
  });

  it("should sort an array containing zero", () => {
    const heap = new HeapSort();
    let arr = [1, 0];
    const answer = heap.sort(arr.slice());
    expect(iteratorToArr(answer)).toEqual(arr.sort((a, b) => a - b));
  });

  it("should sort a random array", () => {
    const heap = new HeapSort();
    const random = () => Math.floor(Math.random() * 100);
    const arr = Array.from({ length: 32 }, () => random());
    const answer = heap.sort(arr.slice());
    expect(iteratorToArr(answer)).toEqual(arr.slice().sort((a, b) => a - b));
  });

  // Additional test cases for edge scenarios
  it("should handle an array of identical elements", () => {
    const heap = new HeapSort();
    const arr = [5, 5, 5, 5, 5];
    const answer = heap.sort(arr.slice());
    expect(iteratorToArr(answer)).toEqual(arr.slice());
  });

  it("should handle an array with negative numbers", () => {
    const heap = new HeapSort();
    const arr = [-1, -3, -2, -4];
    const answer = heap.sort(arr.slice());
    expect(iteratorToArr(answer)).toEqual(arr.slice().sort((a, b) => a - b));
  });
  it("should handle an array with two negative numbers", () => {
    const heap = new HeapSort();
    const arr = [-1, -2, -3, -4, -5];
    const answer = heap.sort(arr.slice());
    expect(iteratorToArr(answer)).toEqual(arr.slice().sort((a, b) => a - b));
  });

  it("should handle a large array efficiently", () => {
    const heap = new HeapSort();
    const largeArr = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
    const answer = heap.sort(largeArr.slice());
    expect(iteratorToArr(answer)).toEqual(largeArr.slice().sort((a, b) => a - b));
  });
});

