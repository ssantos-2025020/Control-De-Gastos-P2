import { Component, computed, input } from '@angular/core';

const RING_COLORS = {
  gray: '#3a4159',
  green: '#34d399',
  amber: '#f97316',
  red: '#f43f5e',
} as const;

const PCT_FONT_CAP = 30;
const LABEL_FONT_CAP = 9.5;
const SUB_FONT_CAP = 9;

@Component({
  selector: 'app-radial-progress',
  standalone: true,
  template: `
    <div class="rpg-wrap" [style.width.px]="size()" [style.height.px]="size()">
      <svg
        class="rpg"
        viewBox="0 0 84 84"
        pathLength="100"
        [style.width.px]="size()"
        [style.height.px]="size()"
      >
        <circle cx="42" cy="42" r="36" class="rpg-track"></circle>
        <circle
          cx="42" cy="42" r="36"
          class="rpg-fill"
          [attr.stroke-dashoffset]="100 - clampedPct()"
          [style.stroke]="strokeColor()"
        ></circle>
      </svg>
      <div class="rpg-center">
        <span class="rpg-pct" [style.fontSize.px]="pctFont()">{{ pct() }}%</span>
        <span class="rpg-label" [style.fontSize.px]="labelFont()">{{ label() }}</span>
        @if (subLabel()) {
          <span
            class="rpg-sub"
            [style.fontSize.px]="subFont()"
          >{{ subLabel() }}</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .rpg-wrap {
        position: relative;
        display: inline-block;
        flex-shrink: 0;
      }

      .rpg {
        display: block;
        transform: rotate(-90deg);
        transform-origin: center;
      }

      .rpg .rpg-track {
        fill: none;
        stroke: var(--glass-border-strong);
        stroke-width: 8;
      }

      .rpg .rpg-fill {
        fill: none;
        stroke-width: 8;
        stroke-linecap: round;
        stroke-dasharray: 100;
        transition: stroke-dashoffset 0.5s ease, stroke 0.3s ease;
      }

      .rpg-center {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        text-align: center;
        padding: 0 8px;
        overflow: hidden;
      }

      .rpg-pct {
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        color: var(--text-heading);
        line-height: 1.05;
        max-width: 100%;
        white-space: nowrap;
      }

      .rpg-label,
      .rpg-sub {
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted);
        line-height: 1.2;
        max-width: 100%;
        white-space: nowrap;
      }

      .rpg-label {
        margin-top: 4px;
      }

      .rpg-sub {
        margin-top: 2px;
        opacity: 0.85;
      }
    `,
  ],
})
export class RadialProgressComponent {
  pct = input(0);
  size = input(74);
  label = input('');
  subLabel = input('');
  colorOverride = input<string | null>(null);

  clampedPct = computed(() => Math.min(this.pct(), 100));

  pctFont = computed(() => Math.min(this.size() * 0.22, PCT_FONT_CAP));
  labelFont = computed(() => Math.min(this.size() * 0.12, LABEL_FONT_CAP));
  subFont = computed(() => Math.min(this.size() * 0.1, SUB_FONT_CAP));

  strokeColor = computed(() => {
    if (this.colorOverride()) return this.colorOverride()!;
    const pct = this.clampedPct();
    if (pct === 0) return RING_COLORS.gray;
    if (pct > 90) return RING_COLORS.red;
    if (pct >= 70) return RING_COLORS.amber;
    return RING_COLORS.green;
  });
}