export interface IFullPage {
  idx?: number;
  container: Element;
  slides: HTMLElement[];
  activeSlide: HTMLElement;
  preSlide: HTMLElement;
  nextSlide: HTMLElement;
  slideDistance: number;
  startPostion: IPosition | null;
  endPosition: IPosition | null;
  slideTo: (idx: number) => void;
  onSlide: (this: IFullPage, idx: number) => void;
  onSlidePrev: (this: IFullPage, idx: number) => void;
  onSlideNext: (this: IFullPage, idx: number) => void;
}
export interface IFullPageCtor
  extends Partial<
    Pick<IFullPage, 'idx' | 'onSlide' | 'onSlidePrev' | 'onSlideNext'>
  > {
  container: HTMLElement | string;
  slideItem: string;
}

export interface IPosition {
  x: number;
  y: number;
}
