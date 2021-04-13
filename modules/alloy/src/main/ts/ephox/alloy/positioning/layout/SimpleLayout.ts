import { Fun, Optional } from '@ephox/katamari';
import { SugarElement } from '@ephox/sugar';

import { Bounds } from '../../alien/Boxes';
import { AnchorOverrides, MaxHeightFunction, MaxWidthFunction } from '../mode/Anchoring';
import * as Callouts from '../view/Callouts';
import { Anchor } from './Anchor';
import { Bubble } from './Bubble';
import * as LayoutTypes from './LayoutTypes';
import * as MaxHeight from './MaxHeight';
import * as Origins from './Origins';

export interface ReparteeOptions {
  readonly bounds: Bounds;
  readonly origin: Origins.OriginAdt;
  readonly preference: LayoutTypes.AnchorLayout[];
  readonly maxHeightFunction: MaxHeightFunction;
  readonly maxWidthFunction: MaxWidthFunction;
}

const defaultOr = <K extends keyof AnchorOverrides>(options: AnchorOverrides, key: K, dephault: NonNullable<AnchorOverrides[K]>): NonNullable<AnchorOverrides[K]> => options[key] === undefined ? dephault : options[key] as NonNullable<AnchorOverrides[K]>;

// This takes care of everything when you are positioning UI that can go anywhere on the screen
const simple = (anchor: Anchor, element: SugarElement, bubble: Bubble, layouts: LayoutTypes.AnchorLayout[], getBounds: Optional<() => Bounds>, overrideOptions: AnchorOverrides, transitionAnimationClass: Optional<string>): void => {
  // the only supported override at the moment. Once relative has been deleted, maybe this can be optional in the bag
  const maxHeightFunction: MaxHeightFunction = defaultOr(overrideOptions, 'maxHeightFunction', MaxHeight.anchored());
  const maxWidthFunction: MaxWidthFunction = defaultOr(overrideOptions, 'maxWidthFunction', Fun.noop);

  const anchorBox = anchor.anchorBox;
  const origin = anchor.origin;

  const options: ReparteeOptions = {
    bounds: Origins.viewport(origin, getBounds),
    origin,
    preference: layouts,
    maxHeightFunction,
    maxWidthFunction
  };

  go(anchorBox, element, bubble, options, transitionAnimationClass);
};

// This is the old public API. If we ever need full customisability again, this is how to expose it
const go = (anchorBox: LayoutTypes.AnchorBox, element: SugarElement, bubble: Bubble, options: ReparteeOptions, transitionAnimationClass: Optional<string>): void => {
  const decision = Callouts.layout(anchorBox, element, bubble, options);

  Callouts.position(element, decision, options, transitionAnimationClass);
  Callouts.setClasses(element, decision);
  Callouts.setHeight(element, decision, options);
  Callouts.setWidth(element, decision, options);
};

export { simple };
