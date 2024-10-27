import p5 from "p5"
import { SoundUtil } from "./soundUtil"
import { INDEX } from "./types"

type param = {
  p: p5
  arr: number[]
  swapIndex: INDEX[]
  swaped: boolean
  json: { style: { color: string, bg_color: string, size_multiplier: number }, letters: string[] } | null
  sound: SoundUtil
  font: p5.Font
}

export const drawArray = ({ p, arr, swapIndex, swaped, json, sound, font }: param) => {
  if (swapIndex.length > 1) {
    sound.playNotes(swaped)
  }

  for (let i = 0; i < arr.length; i++) {
    const xWidth = 0.9 * (p.width / (arr.length))
    const arrWidth = xWidth * arr.length
    const remaingSpace = p.width - arrWidth
    const maxHeight = (0.5) * p.height // half of the height
    const xPos = (i * xWidth) + xWidth / 2 + remaingSpace / 2
    const yHeight = p.map(arr[i], 0, arr.length, 10, maxHeight)
    swapIndex.filter(index => index.i == i).forEach(index => {
      p.fill(index.c)
    })
    const barSize = p.map(p.width, 50, 2000, 2, 10)
    p.rect(xPos, p.height, barSize, -yHeight) // bar representing the array
    p.fill("#111")
    p.rect(xPos, 0, barSize, p.height - yHeight) //  bar on top of the array
    const text: string = json?.letters ? json.letters[arr[i]] : `${arr[i]}`
    let fontSize = p.map(p.width, 0, 2000, 10, 40)
    if (json?.style.size_multiplier) fontSize *= json.style.size_multiplier

    p.textSize(fontSize)
    p.textFont(font)
    p.fill(json?.style.color || "white")
    p.text(text, xPos, p.height - yHeight - 10)
  }
}

export const createArrayForLetters = (letters: string[]): number[] => {
  let arr: number[] = [...Array(letters.length).keys()];
  // Shuffle the array using Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr
}

export const createRandArray = (n: number, upto = 100): number[] => {
  let arr: number[] = []
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * upto))
  }
  return arr
}
