import { Pos } from "./types";
import { VNode, render } from "preact";

export function makeEmptyGrid<T>(
  w: number, h: number, val: T
): T[][] {
  const result = new Array(h);
  for (let y = 0; y < h; y++) {
    result[y] = new Array(w);
    for (let x = 0; x < w; x++) {
      result[y][x] = val;
    }
  }
  return result;
}

export function makeGrid<T>(
  w: number, h: number,
  func: (x: number, y: number) => T
): T[][] {
  const result = new Array(h);
  for (let y = 0; y < h; y++) {
    result[y] = new Array(w);
    for (let x = 0; x < w; x++) {
      result[y][x] = func(x, y);
    }
  }
  return result;
}

export function posEqual(a: Pos | null, b: Pos | null): boolean {
  if (a === b) {
    return true;
  }
  if (a === null || b === null) {
    return false;
  }
  return a.x === b.x && a.y === b.y;
}

export function renderWithRef<P>(
  node: VNode,
  element: Element,
  mergeWith?: Element | undefined
): Promise<P> {
  return new Promise((resolve, reject) => {
    node.attributes = node.attributes || {};
    node.attributes.ref = resolve;
    render(node, element, mergeWith);
  });
}

export function nextTo(a: Pos, b: Pos): boolean {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return Math.max(dx, dy) === 1;
}

export function simpleDistance(a: Pos, b: Pos): number {
  return Math.max(Math.abs(a.x-b.x), Math.abs(a.y-b.y));
}

export function manhattanDistance(a: Pos, b: Pos): number {
  return Math.abs(a.x-b.x) + Math.abs(a.y-b.y);
}

export function euclidDistance(a: Pos, b: Pos): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function minBy<T>(sequence: T[], key: (el: T) => number | null): T | null {
  let best = null;
  let bestVal = 0;
  for (let i = 0; i < sequence.length; i++) {
    const val = key(sequence[i]);
    if (val !== null && (best === null || val < bestVal)) {
      best = sequence[i];
      bestVal = val;
    }
  }
  return best;
}

export function maxBy<T>(sequence: T[], key: (el: T) => number | null): T | null {
  return minBy(sequence, el => {
    const val = key(el);
    return val === null ? null : -val;
  });
}

export function randomChoice<T>(sequence: T[]): T {
  const i = Math.floor(Math.random() * sequence.length);
  return sequence[i];
}

// @ts-ignore
export function speak({ text, speechRate, lang, volume, pitch }: { text: string, speechRate?: number, lang?: 'zh-CN'| 'en-US', volume?: number, pitch?: number }, endEvent?: any, startEvent?: any) {
  if (!window.SpeechSynthesisUtterance) {
    console.warn('当前浏览器不支持文字转语音服务')
    return;
  }

  if (!text) {
    return;
  }

  const speechUtterance = new SpeechSynthesisUtterance();
  speechUtterance.text = text;
  speechUtterance.rate = speechRate || 1;
  speechUtterance.lang = lang || 'zh-CN';
  speechUtterance.volume = volume || 1;
  speechUtterance.pitch = pitch || 1;
  speechUtterance.onend = function() {
    endEvent && endEvent();
  };
  speechUtterance.onstart = function() {
    startEvent && startEvent();
  };
  speechSynthesis.speak(speechUtterance);

  return speechUtterance;
}
const text2AudioApi = {
  //"url": "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=2&text="
  "url": "https://ai.baidu.com/aidemo?type=tns2&idx=1&tex=%s&cuid=baidu_speech_demo&cod=2&lan=zh&ctp=1&pdt=1&spd=5&per=4&vol=5&pit=5"
};
const util = {
  sprintf: function () {
    var arg = arguments,
        str = arg[0] || '',
        i, n;
    for (i = 1, n = arg.length; i < n; i++) {
      str = str.replace(/%s/, arg[i]);
    }
    return str;
  }
};
export function speak2({text}: {text:string}) {
  // @ts-ignore
  var url = util.sprintf(text2AudioApi.url, encodeURI(text));
  var audio = new Audio(url);
  audio.currentTime = 0;
  audio.play();
}
declare let responsiveVoice:any
export function speak3(text: string, i: number) {
  // if (i === 0) {
  //   responsiveVoice.speak(text, 'UK English Female')
  // }
  if (i === 1) {
    responsiveVoice.speak(`顾之找到了${text}`, 'Chinese Female')
  }
}