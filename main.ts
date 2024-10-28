import p5 from "p5";
import * as json from "./public/asset/letters.json"
import { createArrayForLetters, drawArray } from "./utils/arrayUtil.ts";
import { SoundUtil } from "./utils/soundUtil.ts";
import { SortingAlgorithmsFactory } from "./utils/sortAlgorithmsFactory.ts";
import {
  ITERATOR,
  ITERATOR_RESULT,
  SortAlgorithm,
} from "./utils/types.ts";
import QueryParams from "./utils/queryParams.ts";

const app = document.getElementById("app") as HTMLDivElement;

const sketch = (p: p5) => {
  let sortAlgorithms: SortAlgorithm;
  let iterator: ITERATOR;
  let nextIteration: ITERATOR_RESULT;
  let lastValue: number[];
  let isMutted = true;

  const select = p.select("#select");
  const slider = p.select("#slider");
  const scale = p.select("#scale"); //musical
  const slider_label = p.select("#slider-label");
  const numCompDiv = p.select("#num-comp");
  const numSwapDiv = p.select("#num-swap");
  let intoDone = false;
  let main_font: p5.Font;
  let numSwap = 0;
  const letters = json.Amharic;
  if (!slider || !select || !slider_label || !numCompDiv || !numSwapDiv || !scale) return; // if any UI is not loaded just return

  const sortingAlgorithm = p.createSelect(select);
  const musicalScale = p.createSelect(scale);
  const sound = new SoundUtil(scale.value().toString());
  const queryParam = new QueryParams()
  p.preload = () => {
    // into_font = p.loadFont(
    //   "/Algorithms-visualized/asset/fonts/yigezubisratgothic.ttf",
    // );
    main_font = p.loadFont(
      "/Algorithms-visualized/asset/fonts/AbyssinicaSIL-R.ttf",
    );
  };

  const checkQuery = () => {
    const algorithms = ["Bubble Sort", "Insertion Sort", "Selection Sort", "Merge Sort", "Quick Sort", "Heap Sort"]
    const selectedAlgorithm = queryParam.get("algorithm", algorithms); // give value only if it is in the list
    if (!selectedAlgorithm)
      queryParam.set("algorithm", sortingAlgorithm.selected());
    else
      sortingAlgorithm.value(selectedAlgorithm);
  };

  const intro = () => {
    return new Promise<void>((resolve) => {
      checkQuery(); // check the query before

      const intro_Sort = SortingAlgorithmsFactory.SortWith(sortingAlgorithm.selected());
      const num_array = json.nehemiah.letters.map((_: any, i: number) => i).reverse();
      const restart = p.select("#restart");
      const mute = p.select("#mute");
      const muteCheckbox = p.select("#muteCheckbox");
      if (!restart || !mute || !muteCheckbox) return; // if any ui has not been found return

      // defalut values
      muteCheckbox.checked(false);
      slider.value(3);
      slider_label.html("Speed: " + slider.value());
      p.frameRate(+slider.value());

      mute.mousePressed(() => {
        isMutted = !isMutted;
        isMutted ? sound.mute() : sound.unmute();
      });
      restart.mousePressed(() => {
        sortAlgorithms = SortingAlgorithmsFactory.SortWith(sortingAlgorithm.selected());
        iterator = sortAlgorithms.sort(createArrayForLetters(letters.letters)); // create array of numbers from the letters
        nextIteration = iterator.next();
        numSwap = 0;
      });
      slider.changed(() => {
        p.frameRate(+slider.value()); // the plus symbol is to convert string to number
        slider_label.html("Speed: " + slider.value());
        if (slider.value() == 0) {
          slider_label.html("Speed = 0, paused");
        }
      });

      const intro_iterator = intro_Sort.sort(num_array);
      let intro_nextIteration = intro_iterator.next();

      const id = setInterval(() => {
        p.background(25);
        if (intro_nextIteration.done) { // if it finished drawing
          drawArray({
            p,
            arr: lastValue,
            swapIndex: [],
            swaped: false,
            json: json.nehemiah,
            sound,
            font: main_font,
          });
          clearInterval(id);
          setTimeout(() => {
            p.clear();
            resolve();
          }, 0);
          return;
        }
        drawArray({
          p,
          arr: intro_nextIteration.value.arr,
          swapIndex: intro_nextIteration.value.index,
          swaped: intro_nextIteration.value.swaped,
          json: json.nehemiah,
          sound,
          font: main_font,
        });
        lastValue = intro_nextIteration.value.arr;
        intro_nextIteration = intro_iterator.next();
      }, 400);
    });
  };

  p.setup = async () => {
    const cvs = p.createCanvas(app.clientWidth, app.clientHeight);
    cvs.style("z-index", "1000");

    await intro();

    sortAlgorithms = SortingAlgorithmsFactory.SortWith(sortingAlgorithm.selected()); // returns sorting algorithm class
    const letters_num = createArrayForLetters(letters.letters); // create array of numbers from the letters

    iterator = sortAlgorithms.sort(letters_num); // sorts and returns iterator
    nextIteration = iterator.next();

    drawArray({
      p,
      arr: nextIteration.value.arr,
      swapIndex: nextIteration.value.index,
      swaped: false,
      json: letters,
      sound,
      font: main_font,
    }); // draw num as a bar hieght

    intoDone = true;
  };
  p.draw = () => {
    if (!intoDone) return;
    p.clear(); // clear canvas

    musicalScale.changed(() => {
      const selected = musicalScale.selected();
      sound.setScale(selected);
      console.log(selected);
    });

    sortingAlgorithm.changed(() => {
      sortAlgorithms = SortingAlgorithmsFactory.SortWith(sortingAlgorithm.selected());
      iterator = sortAlgorithms.sort(createArrayForLetters(letters.letters)); // create array of numbers from the letters
      nextIteration = iterator.next();
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("algorithm", sortingAlgorithm.selected()); // set query parameter
      history.replaceState(null, "", "?" + urlParams.toString());

      // reset
      numSwap = 0;
      numCompDiv.html("0");
      numSwapDiv.html("0");
    });
    if (nextIteration.done) { // if it finished drawing
      drawArray({
        p,
        arr: lastValue,
        swapIndex: [],
        swaped: false,
        json: letters,
        sound,
        font: main_font,
      });
      return;
    }
    drawArray({ // if finished drawing show the last value it got(sorted)
      p,
      arr: nextIteration.value.arr,
      swapIndex: nextIteration.value.index,
      swaped: nextIteration.value.swaped,
      json: letters,
      sound,
      font: main_font,
    });
    // show stat
    numCompDiv.html(`${nextIteration.value.numComp}`);
    if (nextIteration.value.swaped) {
      numSwap++;
    }
    numSwapDiv.html(`${numSwap}`);
    lastValue = nextIteration.value.arr;
    nextIteration = iterator.next();
  };
  p.windowResized = () => {
    if (!nextIteration || nextIteration.done) { // if it finished drawing resize canvas then quit
      p.resizeCanvas(app.clientWidth, app.clientHeight);
      return;
    }

    const prevMuteState = sound.isMutted;
    sound.mute();
    p.resizeCanvas(app.clientWidth, app.clientHeight);
    if (!prevMuteState) { // if previouly has sound
      sound.unmute();
    }
  };
};

new p5(sketch, app);
