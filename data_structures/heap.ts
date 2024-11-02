export class Heap {
  getParrentIndex(arrIndex: number) {
    const index = arrIndex + 1
    const value = Math.floor(index / 2)
    return value - 1
  }
  getLeftIndex(arrIndex: number) {
    const index = arrIndex + 1
    const value = 2 * index
    return value - 1
  }
  getRightIndex(arrIndex: number) {
    const index = arrIndex + 1
    const value = 2 * index + 1
    return value - 1
  }
}
