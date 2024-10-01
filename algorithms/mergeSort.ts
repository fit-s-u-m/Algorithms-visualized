import { ITERATOR } from "../utils/types"
export class MergeSort {

  numComp = 0;
  * sort(arr: number[]): ITERATOR {

    if (arr.length < 2)
      return { arr, index: { i: -1, j: -1 }, swaped: false, numComp: 0 }

    let n = arr.length;
    let temp = arr.slice()

    // Start with subarrays of size 1 and merge them
    for (let size = 1; size < n; size *= 2) {
      for (let left = 0; left < n; left += size * 2) {
        let mid = Math.min(left + size, n);
        let right = Math.min(left + size * 2, n);

        // Merge the two halves
        yield* this.merge(arr, temp, left, mid, right);
      }
      // Copy sorted elements back to original array
      for (let i = 0; i < n; i++) {
        arr[i] = temp[i];
      }
    }
    // yield { arr: arr, index: { i: -1, j: -1 }, swaped: false, numComp: 0 }
  }
  * merge(arr: number[], temp: number[], left: number, mid: number, right: number): ITERATOR {
    let i = left;   // Starting index for left subarray
    let j = mid;    // Starting index for right subarray
    let k = left;   // Starting index to be merged
    let test = []

    // Merge the two halves into temp[]
    while (i < mid && j < right) {
      if (arr[i] < arr[j]) {
        temp[k] = arr[i];
        test.push(arr[i])
        yield { arr: arr.slice(), index: { i, j, k }, swaped: true, numComp: this.numComp }
        i++
      } else if (arr[i] > arr[j]) {
        temp[k] = arr[j];
        test.push(arr[j])
        yield { arr: arr.slice(), index: { i, j, k }, swaped: true, numComp: this.numComp }
        j++
      }
      // else {
      //   yield { arr: arr.slice(), index: { i: j, j: j }, swaped: false, numComp: this.numComp }
      // }
      k++
      this.numComp++
    }


    // Copy remaining elements of left subarray, if any
    while (i < mid) {
      temp[k] = arr[i];
      test.push(arr[i])
      yield { arr: arr.slice(), index: { i, j, k }, swaped: true, numComp: this.numComp }
      k++
      i++
      this.numComp++
    }

    // Copy remaining elements of right subarray, if any
    while (j < right) {
      temp[k] = arr[j];
      test.push(arr[j])
      yield { arr: arr.slice(), index: { i, j, k }, swaped: true, numComp: this.numComp }
      k++
      j++
      this.numComp++
    }
    for (let t = 0; t < test.length; t++) {
      arr[left + t] = test[t];
    }

    yield { arr: arr.slice(), index: { i, j, k }, swaped: true, numComp: this.numComp }
  }

  swap(arr: number[], i: number, j: number) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}



