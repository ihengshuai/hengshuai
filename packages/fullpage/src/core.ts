import { IFullPage, IFullPageCtor, IPosition } from './type';
import { isString } from '@hengshuai/helper';

export class FullPage implements IFullPage {
  container: Element;
  slides: HTMLElement[];
  idx: number;
  activeSlide: HTMLElement;
  preSlide: HTMLElement;
  nextSlide: HTMLElement;
  slideDistance: number;
  startPostion: IPosition;
  endPosition: IPosition;
  slideTo: (idx: number) => void;
  constructor(opts: IFullPageCtor) {
    if (!document && !window) return;
    this.init(opts);
    this.bindEvent();
  }
  onSlide: (this: IFullPage, idx: number) => void;
  onSlidePrev: (this: IFullPage, idx: number) => void;
  onSlideNext: (this: IFullPage, idx: number) => void;

  init(opts: IFullPageCtor) {
    if (isString(opts.container)) {
      this.container = this.findElem(opts.container);
    } else {
      this.container = opts.container;
    }
    this.slides = this.findElemAll(
      opts.slideItem,
      this.container.cloneNode(true) as Element,
    );
    if (!this.slides) {
      // eslint-disable-next-line quotes
      throw Error("don't not find slide item element.");
    }
    this.idx = Math.abs(~~opts.idx) % this.slides.length || 0;
    this.slideDistance = this.container.clientHeight;
    this.startPostion = { x: 0, y: 0 };
    this.endPosition = { x: 0, y: 0 };

    /**
     * 初始化slide item样式
     */
    const slideStyleProperties: Record<string, any> = {
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      'will-change': 'auto',
    };
    const slideStyleText = this.transferCssPropertyToText(slideStyleProperties);
    for (const slide of this.slides) {
      slide.style.cssText = slideStyleText;
    }
    const frag = document.createDocumentFragment();
    this.activeSlide = this.slides[this.idx];
    this.activeSlide.style.cssText += this.getSlideStyle(
      this.idx * this.slideDistance,
    );
    if (this.idx > 0) {
      this.preSlide = this.slides[this.idx - 1];
      this.preSlide.style.cssText += this.getSlideStyle(
        (this.idx - 1) * this.slideDistance,
      );
      frag.appendChild(this.preSlide);
    }
    frag.appendChild(this.activeSlide);
    if (this.idx < this.slides.length - 1) {
      this.nextSlide = this.slides[this.idx + 1];
      this.nextSlide.style.cssText += this.getSlideStyle(
        (this.idx + 1) * this.slideDistance,
      );
      frag.appendChild(this.nextSlide);
    }
    this.container.innerHTML = '';
    this.container.appendChild(frag);
    opts.onSlide?.call(this, this.idx);
  }

  findElem<T extends Element = Element>(selector: string, r?: Element): T {
    return (r || document).querySelector(selector);
  }

  findElemAll<T extends Element = Element>(selector: string, r?: Element): T[] {
    return Array.from((r || document).querySelectorAll(selector));
  }

  private getSlideStyle(y: number) {
    const style = {
      transform: `translate(0, ${y}px)`,
    };
    return this.transferCssPropertyToText(style);
  }

  private bindEvent() {
    this.container.addEventListener(
      'touchstart',
      (e) => {
        this.listenTouchStart(e as TouchEvent);
      },
      false,
    );
    this.container.addEventListener(
      'touchmove',
      (e) => {
        this.listenTouchMove(e as TouchEvent);
      },
      false,
    );
    this.container.addEventListener(
      'touchend',
      (e) => {
        this.listenTouchEnd(e as TouchEvent);
      },
      false,
    );
  }
  private listenTouchStart(e: TouchEvent) {
    if (e.touches.length > 1) return;
    const [touch] = Array.from(e.touches);
    this.startPostion.x = touch.pageX;
    this.startPostion.y = touch.pageY;
    console.log(this.startPostion);
  }

  private listenTouchMove(e: TouchEvent) {
    const [touch] = Array.from(e.touches);
    // 行向容错处理
    const offsetX = Math.abs(this.startPostion.x - touch.pageX);
    const offsetY = Math.abs(this.startPostion.y - touch.pageY);
    if (offsetY < offsetX) {
      e.preventDefault();
      return;
    }
    console.log(touch.pageX, touch.pageY);
    for (
      let i = Math.max(this.idx - 1, 0), j = i;
      i < Math.min(this.idx + 1, this.slides.length - 1);
      i++, j++
    ) {
      this.slides[i].style.cssText +=
        this.getSlideStyle(
          j * this.slideDistance + (touch.pageY - this.startPostion.y),
        ) + 'transition-duration:400ms';
    }
  }

  private listenTouchEnd(e: TouchEvent) {
    const [touch] = Array.from(e.changedTouches);
    const offsetY = Math.abs(this.startPostion.y - touch.pageY);
    if (offsetY > 200) {
      if (touch.pageY > this.startPostion.y) {
        for (
          let i = Math.max(this.idx - 1, 0), j = -1;
          i < Math.min(this.idx + 1, this.slides.length - 1);
          i++, j++
        ) {
          this.slides[i].style.cssText +=
            this.getSlideStyle((j + 1) * this.slideDistance) +
            'transition-duration:400ms';
        }
        this.prev();
      } else {
        for (
          let i = Math.max(this.idx - 1, 0), j = 0;
          i < this.idx, i < this.slides.length;
          i++, j++
        ) {
          this.slides[i].style.cssText +=
            this.getSlideStyle((j + 1) * this.slideDistance) +
            'transition-duration:400ms';
        }
        this.next();
      }
    } else {
      this.activeSlide.style.cssText +=
        this.getSlideStyle(0 * this.slideDistance) +
        'transition-duration:400ms';
      this.nextSlide.style.cssText +=
        this.getSlideStyle(1 * this.slideDistance) +
        'transition-duration:400ms';
    }
  }

  private prev() {
    console.log('prev', this.idx);
    this.container.removeChild(this.slides[this.idx + 1]);
    this.idx--;
  }

  private next() {
    console.log('next', this.idx);
    if (this.idx < 2) {
      this.container.appendChild(this.slides[this.idx + 1]);
    }
    this.idx++;
  }

  private transferCssPropertyToText(properties: Record<string, any>) {
    return Object.keys(properties).reduce<string>(
      (p, k) => (p += `${k}:${properties[k]};`),
      '',
    );
  }
}

export default FullPage;
