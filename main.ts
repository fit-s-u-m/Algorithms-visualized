import p5 from "p5";
import * as json from "./public/asset/letters.json"
import { createArrayForLetters, drawArray } from "./utils/arrayUtil.ts";
import { SoundUtil } from "./utils/soundUtil.ts";
import { SortingAlgorithmsFactory } from "./utils/sortAlgorithmsFactory.ts";
import { Init } from "./intro_scene.ts"
import {
  ITERATOR,
  ITERATOR_RESULT,
  SortAlgorithm,
} from "./utils/types.ts";
import QueryParams from "./utils/queryParams.ts";

const app = document.getElementById("app") as HTMLDivElement;

const sketch = (p: p5) => {

  const init = new Init(p)
  if (!init.selections || !init.ui) return

  let sortAlgorithm: SortAlgorithm;
  let iterator: ITERATOR;
  let nextIteration: ITERATOR_RESULT;
  let lastValue: number[];
  let isMutted = true
  let selectedAlgorithm = init.selections.sortingAlgorithm
  let musicalScale = init.selections.musicalScale

  let intoDone = false;
  let main_font: p5.Font;
  let numSwap = 0;
  const letters = json.Amharic;

  const sound = new SoundUtil(init.ui.scale.value().toString());
  const queryParam = new QueryParams()

  bindCallbackForUI(sound) // add function to the buttons(UIs)
  p.preload = () => {
    main_font = p.loadFont(
      "/Algorithms-visualized/asset/fonts/AbyssinicaSIL-R.ttf",
    );
  };


  p.setup = async () => {
    const cvs = p.createCanvas(app.clientWidth, app.clientHeight);
    cvs.style("z-index", "1000");

    await init.introScene(json.nehemiah, sound, main_font, queryParam);

    sortAlgorithm = SortingAlgorithmsFactory.SortWith(selectedAlgorithm.selected()); // returns sorting algorithm class
    const letters_num = createArrayForLetters(letters.letters); // create array of numbers from the letters

    iterator = sortAlgorithm.sort(letters_num); // sorts and returns iterator
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

    selectedAlgorithm.changed(() => {
      sortAlgorithm = SortingAlgorithmsFactory.SortWith(selectedAlgorithm.selected());
      iterator = sortAlgorithm.sort(createArrayForLetters(letters.letters)); // create array of numbers from the letters
      nextIteration = iterator.next();
      queryParam.set("algorithm", selectedAlgorithm.selected())

      // reset
      numSwap = 0;
      init.ui?.numCompDiv.html("0");
      init.ui?.numSwapDiv.html("0");
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
    init.ui?.numCompDiv.html(`${nextIteration.value.numComp}`);
    if (nextIteration.value.swaped) {
      numSwap++;
    }
    init.ui?.numSwapDiv.html(`${numSwap}`);
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
  function bindCallbackForUI(sound: SoundUtil) {

    if (!init.ui) return
    init.ui.muteCheckbox.changed(toggleMute);
    init.ui.restart.mousePressed(() => {
      sortAlgorithm = SortingAlgorithmsFactory.SortWith(init.selections?.sortingAlgorithm.selected());
      iterator = sortAlgorithm.sort(createArrayForLetters(letters.letters)); // create array of numbers from the letters
      nextIteration = iterator.next();
      numSwap = 0;
    });
    init.ui.slider.changed(() => {
      if (!init.ui) return
      p.frameRate(+init.ui.slider.value()); // the plus symbol is to convert string to number
      init.ui.slider_label.html("Speed: " + init.ui.slider.value());
      if (init.ui.slider.value() == 0) {
        init.ui.slider_label.html("Speed = 0, paused");
      }
    });

  }
  function toggleMute() {
    isMutted = !isMutted
    if (isMutted) {
      init.ui?.muteCheckbox.addClass("[--tglbg:red]")
      init.ui?.mute.html("mute")
      sound.mute()
    }
    else {
      init.ui?.muteCheckbox.removeClass("[--tglbg:red]")
      init.ui?.mute.html("unmute")
      sound.unmute();
    }
  }
};

new p5(sketch, app);
