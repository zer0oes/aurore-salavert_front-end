import { Component, HostBinding, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnDestroy {
  private visible = false;
  private shownAt = 0;
  private hideTimer?: ReturnType<typeof setTimeout>;

  @HostBinding('class.loading-active')
  get loadingActive(): boolean { return this.visible; }

  @Input()
  set isLoading(value: boolean) {
    clearTimeout(this.hideTimer);
    if (value) {
      if (!this.visible) this.shownAt = Date.now();
      this.visible = true;
    } else if (this.visible) {
      // Keep the complete logo sequence visible, even on fast navigations.
      const remaining = Math.max(0, 1650 - (Date.now() - this.shownAt));
      this.hideTimer = setTimeout(() => { this.visible = false; }, remaining);
    }
  }
  get isLoading(): boolean { return this.visible; }

  ngOnDestroy(): void { clearTimeout(this.hideTimer); }
}
