import {
  Directive, Output, Input, EventEmitter, HostBinding, HostListener,
  ElementRef, Renderer2
} from '@angular/core';


@Directive({
  selector: '[menuSub]'
})
export class MenuSubDirective {

  constructor(protected el: ElementRef,
    protected renderer: Renderer2) {
    this.mClazz = 'sub-menu';
  }

  protected dropActive = 'd-active';

  @Output() onToggle = new EventEmitter<any>();

  @Input('class')
  @HostBinding('class')
  mClazz = '';

  // @HostBinding('style.background-color') protected background = '#ffffff'
  // @HostBinding('style.opacity') protected opacity = '1'
  @HostListener('click', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onToggle.emit(true);
    let clazz: any[] = this.mClazz.trim().split(/[\s]+/);
    let i = clazz.indexOf(this.dropActive);
    if (i >= 0) {
      clazz.splice(i, 1);
    } else {
      clazz.push(this.dropActive)
    }
    this.mClazz = clazz.join(' ');

    
  }
}

@Directive({
  selector: '[menuHasSub]'
})
export class MenuHasSubDirective extends MenuSubDirective {

  constructor(protected el: ElementRef,
    protected renderer: Renderer2) {
    super(el, renderer);
    this.mClazz = 'has-sub';
  }

  protected dropActive = 'drop-active';
  @HostListener('click', ['$event']) public ondrop(evt) {
    super.ondrop(evt);

    let child: HTMLElement = this.el.nativeElement.querySelector('.sub-menu');
    if (child.classList.contains('d-active')) {
      child.classList.remove('d-active')
    } else {
      child.classList.add('d-active')
    }
  }
}

