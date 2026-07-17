'use client';

import * as React from 'react';
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { productTour } from '@nyvora/ui/lib/help-content';

const TOUR_STORAGE_KEY = 'nyvora_product_tour_done';
const TOUR_EVENT = 'nyvora:start-tour';

function buildSteps(): DriveStep[] {
  return productTour.map((s) => ({
    element: s.element,
    popover: {
      title: s.title,
      description: s.description,
    },
  }));
}

export function ProductTour() {
  const runTour = React.useCallback(() => {
    const steps = buildSteps().filter(
      (s) => !s.element || document.querySelector(s.element as string)
    );
    if (steps.length === 0) return;

    const d = driver({
      showProgress: true,
      overlayColor: 'rgba(0, 0, 0, 0.6)',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Atras',
      doneBtnText: 'Finalizar',
      progressText: '{{current}} de {{total}}',
      steps,
      onDestroyed: () => {
        try {
          localStorage.setItem(TOUR_STORAGE_KEY, 'true');
        } catch {
          /* ignore */
        }
      },
    });
    d.drive();
  }, []);

  React.useEffect(() => {
    const handler = () => runTour();
    window.addEventListener(TOUR_EVENT, handler);

    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!localStorage.getItem(TOUR_STORAGE_KEY)) {
        timer = setTimeout(runTour, 900);
      }
    } catch {
      /* ignore */
    }

    return () => {
      window.removeEventListener(TOUR_EVENT, handler);
      if (timer) clearTimeout(timer);
    };
  }, [runTour]);

  return null;
}
