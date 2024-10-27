import { ITERATOR } from "../utils/types"
export class MergeSort {

  numComp = 0;
  * sort(arr: number[]): ITERATOR {

    if (arr.length < 2) {
      yield { arr, index: [], swaped: false, numComp: 0 };
      return; // Exit early from the generator function
    }

    let n = arr.length;
    // Start with subarrays of size 1 and merge them
    for (let size = 1; size < n; size *= 2) {
      for (let left = 0; left < n; left += size * 2) {
        let mid = Math.min(left + size, n);
        let right = Math.min(left + size * 2, n);

        // Merge the two halves
        yield* this.merge(arr, left, mid, right);
      }
    }
    for (let i = 0; i < n; i++) {
      yield {
        arr: arr.slice(),
        index: [
          { i, c: "red" },
        ], swaped: false, numComp: this.numComp
      }
    }
  }
  * merge(arr: number[], left: number, mid: number, right: number): ITERATOR {
    let i = left;   // Starting index for left subarray
    let j = mid;    // Starting index for right subarray
    let temp = []

    // Merge the two halves into temp[]
    while (i < mid && j < right) {
      if (arr[i] < arr[j]) {
        temp.push(arr[i])
        i++
      } else if (arr[i] > arr[j]) {
        temp.push(arr[j])
        j++
      }
      yield {
        arr: arr.slice(),
        index: [
          { i: left, c: "green" },
          { i: mid, c: "green" },
          { i: i, c: "red" },
          { i: j, c: "blue" },
        ], swaped: false, numComp: this.numComp
      }
      this.numComp++
    }


    // Copy remaining elements of left subarray, if any
    while (i < mid) {
      temp.push(arr[i])
      yield {
        arr: arr.slice(),
        index: [
          { i: left, c: "green" },
          { i: mid, c: "green" },
          { i: i, c: "red" },
          { i: j, c: "blue" },
        ], swaped: false, numComp: this.numComp
      }
      i++
      this.numComp++
    }

    // Copy remaining elements of right subarray, if any
    while (j < right) {
      temp.push(arr[j])
      yield {
        arr: arr.slice(),
        index: [
          { i: left, c: "green" },
          { i: mid, c: "green" },
          { i: i, c: "red" },
          { i: j, c: "blue" },
        ], swaped: false, numComp: this.numComp
      }
      j++
      this.numComp++
    }
    // show mergeing
    for (let t = 0; t < temp.length; t++) {
      arr[left + t] = temp[t];
      yield {
        arr: arr.slice(),
        index: [
          { i: left + t, c: "red" },],
        swaped: true, numComp: this.numComp
      }
    }
    yield {
      arr: arr.slice(),
      index: [
        { i: mid, c: "green" },
        { i: left, c: "green" },
        { i: i, c: "red" },
        { i: j, c: "blue" },
      ], swaped: false, numComp: this.numComp
    }

  }

  swap(arr: number[], i: number, j: number) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}



