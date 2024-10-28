import p5 from "p5";
import { SortingAlgorithmsFactory } from "./utils/sortAlgorithmsFactory.ts";
import { SoundUtil } from "./utils/soundUtil.ts";
import { SortAlgorithm } from "./utils/types.ts";
import { createArrayForLetters, drawArray } from "./utils/arrayUtil.ts"
import QueryParam from "./utils/queryParams.ts"

export class Init {
  p: p5
  ui: {
    select: p5.Element,
    slider: p5.Element,
    scale: p5.Element,
    slider_label: p5.Element,
    numCompDiv: p5.Element,
    numSwapDiv: p5.Element,
    mute: p5.Element,
    restart: p5.Element,
    muteCheckbox: p5.Element,
  } | null = null
  selections: {
    sortingAlgorithm: p5.Element,
    musicalScale: p5.Element
  } | null = null
  lastValue: number[] = []
  selectedAlgorithm: SortAlgorithm

  constructor(p: p5) {
    this.p = p
    // initalizing buttons and value defined in html
    const select = this.p.select("#select");
    const slider = this.p.select("#slider");
    const scale = this.p.select("#scale"); //musical
    const slider_label = this.p.select("#slider-label");
    const numCompDiv = this.p.select("#num-comp");
    const numSwapDiv = this.p.select("#num-swap");
    const restart = this.p.select("#restart");
    const mute = this.p.select("#mute");
    const muteCheckbox = this.p.select("#muteCheckbox");

    if (slider && select && slider_label && numCompDiv && numSwapDiv && scale && restart && mute && muteCheckbox) { // if any of them are not defined return false
      const sortingAlgorithm = this.p.createSelect(select);
      const musicalScale = this.p.createSelect(scale);
      this.selections = { sortingAlgorithm, musicalScale }
      this.ui = { select, slider, scale, slider_label, numCompDiv, numSwapDiv, mute, muteCheckbox, restart }

      // defalut values
      this.ui.muteCheckbox.checked(false);
      this.ui.slider.value(3);
      this.ui.slider_label.html("Speed: " + slider.value());
      this.p.frameRate(+slider.value()); // setting the speed the plus operator change from string to number
    }
  }
  introScene(data: { letters: string[], size_multiplier: number }, sound: SoundUtil, font: p5.Font, queryParam: QueryParam) {
    return new Promise<void>((resolve) => {
      this.checkQuery(queryParam); // check the query before

      const sortingAlgorithm = SortingAlgorithmsFactory.SortWith(this.selections?.sortingAlgorithm.selected());
      const num_array = data.letters.map((_: any, i: number) => i).reverse(); // always start with reversed order at the beginning

      const intro_iterator = sortingAlgorithm.sort(num_array);
      let intro_nextIteration = intro_iterator.next();

      const id = setInterval(() => {
        this.p.background(25);
        if (intro_nextIteration.done) { // if it finished drawing
          drawArray({
            p: this.p,
            arr: this.lastValue,
            swapIndex: [],
            swaped: false,
            json: data,
            sound,
            font,
          });
          clearInterval(id);
          setTimeout(() => {
            this.p.clear();
            resolve();
          }, 5);
          return;
        }
        drawArray({
          p: this.p,
          arr: intro_nextIteration.value.arr,
          swapIndex: intro_nextIteration.value.index,
          swaped: intro_nextIteration.value.swaped,
          json: data,
          sound,
          font,
        });
        this.lastValue = intro_nextIteration.value.arr;
        intro_nextIteration = intro_iterator.next();
      }, 400);
    });

  }
  private checkQuery(queryParam: any) {
    const algorithms = ["Bubble Sort", "Insertion Sort", "Selection Sort", "Merge Sort", "Quick Sort", "Heap Sort"]
    const selectedAlgorithm = queryParam.get("algorithm", algorithms); // give value only if it is in the list
    if (!selectedAlgorithm)
      queryParam.set("algorithm", this.selections?.sortingAlgorithm.selected());
    else
      this.selections?.sortingAlgorithm.value(selectedAlgorithm);
  };

}
