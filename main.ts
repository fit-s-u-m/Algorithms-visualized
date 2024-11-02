import p5 from "p5";
import * as json from "./public/asset/letters.json";
import { createArrayForLetters, drawArray } from "./utils/arrayUtil.ts";
import { SoundUtil } from "./utils/soundUtil.ts";
import { SortingAlgorithmsFactory } from "./utils/sortAlgorithmsFactory.ts";
import { Init } from "./intro_scene.ts";
import { History } from "./utils/history.ts";
import {
  ITERATOR,
  ITERATOR_RESULT,
  SortAlgorithm,
  State,
} from "./utils/types.ts";
import QueryParams from "./utils/queryParams.ts";

const app = document.getElementById("app") as HTMLDivElement;
const history = new History()

const sketch = (p: p5) => {
  const init = new Init(p);
  if (!init.selections || !init.ui) return;

  let sortAlgorithm: SortAlgorithm;
  let iterator: ITERATOR;
  let nextIteration: ITERATOR_RESULT;
  let lastValue: number[];
  let isMutted = true;
  let selectedAlgorithm = init.selections.sortingAlgorithm;
  let musicalScale = init.selections.musicalScale;

  let intoDone = false;
  let main_font: p5.Font;
  let numSwap = 0;
  const letters = json.Amharic;

  const sound = new SoundUtil(init.ui.scale.value().toString());
  const queryParam = new QueryParams();

  bindCallbackForUI();
  p.preload = () => {
    main_font = p.loadFont(
      "/Algorithms-visualized/asset/fonts/AbyssinicaSIL-R.ttf"
    );
  };

  p.setup = async () => {
    const cvs = p.createCanvas(app.clientWidth, app.clientHeight);
    cvs.style("z-index", "1000");

    await init.introScene(json.nehemiah, sound, main_font, queryParam);

    sortAlgorithm = SortingAlgorithmsFactory.SortWith(selectedAlgorithm.selected());
    const letters_num = createArrayForLetters(letters.letters);

    iterator = sortAlgorithm.sort(letters_num);
    nextIteration = iterator.next();
    const state: State = {
      arr: nextIteration.value.arr,
      index: nextIteration.value.index.slice(),
      swaped: false,
    }
    history.saveState(state)

    drawArray({
      p,
      arr: nextIteration.value.arr,
      swapIndex: nextIteration.value.index,
      swaped: false,
      json: letters,
      sound,
      font: main_font,
    });

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
      resetSorting();
    });

    if (nextIteration.done) {
      // If sorting is done, draw the last value
      drawFinalState();
      return;
    }

    const speed = init.ui?.slider.value()
    if (speed == '0')
      displayCurrentHistoryState()
    else
      drawCurrentIteration();
  };

  function resetSorting() {
    sortAlgorithm = SortingAlgorithmsFactory.SortWith(selectedAlgorithm.selected());
    iterator = sortAlgorithm.sort(createArrayForLetters(letters.letters));
    nextIteration = iterator.next();
    queryParam.set("algorithm", selectedAlgorithm.selected());
    history.resetState()

    // Reset UI
    numSwap = 0;
    init.ui?.numCompDiv.html("0");
    init.ui?.numSwapDiv.html("0");
  }

  function drawFinalState() {
    drawArray({
      p,
      arr: lastValue,
      swapIndex: [],
      swaped: false,
      json: letters,
      sound,
      font: main_font,
    });
  }

  function drawCurrentIteration() {
    drawArray({
      p,
      arr: nextIteration.value.arr,
      swapIndex: nextIteration.value.index,
      swaped: nextIteration.value.swaped,
      json: letters,
      sound,
      font: main_font,
    });

    // Update stats
    init.ui?.numCompDiv.html(`${nextIteration.value.numComp}`);
    if (nextIteration.value.swaped) {
      numSwap++;
    }
    init.ui?.numSwapDiv.html(`${numSwap}`);
    lastValue = nextIteration.value.arr;
    nextIteration = iterator.next();
    const state: State = {
      arr: nextIteration.value.arr,
      index: nextIteration.value.index.slice(),
      swaped: false,
    }
    history.saveState(state)
  }

  p.windowResized = () => {
    if (!nextIteration || nextIteration.done) {
      p.resizeCanvas(app.clientWidth, app.clientHeight);
      return;
    }

    const prevMuteState = sound.isMutted;
    sound.mute();
    p.resizeCanvas(app.clientWidth, app.clientHeight);
    if (!prevMuteState) {
      sound.unmute();
    }
  };

  function bindCallbackForUI() {
    if (!init.ui) return;

    init.ui.muteCheckbox.changed(toggleMute);
    init.ui.restart.mousePressed(() => resetSorting());

    init.ui.slider.changed(() => {
      if (!init.ui) return
      const value = +init.ui.slider.value();
      p.frameRate(value);
      init.ui.slider_label.html(value === 0 ? "Speed = 0, paused" : "Speed: " + value);
      init.ui.play.html(value === 0 ? "play" : "pause")
      history.stateIndex = 0
      init.ui.history_label.html("History: " + 0)
    });

    init.ui.prev.mousePressed(() => {
      history.prev()
      displayCurrentHistoryState()
    });
    init.ui.play.mousePressed(() => {
      if (!init.ui) return
      const prevSpeed = +init.ui.slider.value();
      if (prevSpeed == 0) {
        const speed = 3
        init.ui.slider.value(speed);
        init.ui.history_label.html("History: " + 0)
        history.stateIndex = 0
        p.frameRate(speed);
        init.ui.slider_label.html(`Speed: ${speed}`);
        init.ui.play.html("pause")
      }
      else {
        const speed = 0
        init.ui.slider.value(speed);
        p.frameRate(speed);
        init.ui.slider_label.html("Paused");
        init.ui.play.html("play")
      }
    });

    init.ui.next.mousePressed(() => {
      history.next()
      displayCurrentHistoryState()
    });
  }

  function displayCurrentHistoryState() {
    init.ui?.slider.value(0);
    init.ui?.slider_label.html("Paused");
    init.ui?.play.html("play")
    p.frameRate(0); // Pause drawing

    init.ui?.history_label.html("History: " + (history.stateIndex));

    p.clear();
    const state = history.getState()
    console.log(state.index)
    drawArray({
      p,
      arr: state.arr,
      swapIndex: state.index,
      swaped: state.swaped,
      json: letters,
      sound,
      font: main_font,
    });
  }

  function toggleMute() {
    isMutted = !isMutted;
    if (isMutted) {
      init.ui?.muteCheckbox.addClass("[--tglbg:red]");
      init.ui?.mute.html("mute");
      sound.mute();
    } else {
      init.ui?.muteCheckbox.removeClass("[--tglbg:red]");
      init.ui?.mute.html("unmute");
      sound.unmute();
    }
  }
};

new p5(sketch, app);

