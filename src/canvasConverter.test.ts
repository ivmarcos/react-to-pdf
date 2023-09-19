/**
 * @jest-environment jsdom
 */

import { expect, test } from "@jest/globals";
import { CanvasConverter } from "./canvasConverter";
import { Size } from "./constants";
import { parseOptions } from "./documentConverter";

describe('CanvasConverter', () => {

  describe('calculaResizeScale', () => {

    test('should correctly return the scale when size option is SHRINK_TO_FIT', () => {
      const options = parseOptions({
        size: Size.SHRINK_TO_FIT
      })
      const canvasConverter = new CanvasConverter({maxHeight: 500, maxWidth: 100, options});
      const element = document.createElement('div');
      element.style.width = `1000px`
      expect(canvasConverter.calculateResizeScale(element)).toBe(.1)
    })
  })
})