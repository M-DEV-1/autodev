import { create } from 'zustand';

export type WizardStep = 'mode_select' | 'scratch_prompt' | 'git_url' | 'creating';
export type WizardMode = 'menu' | 'wizard';

interface WizardState {
    // Mode (Menu vs Active Wizard)
    mode: WizardMode;
    setMode: (mode: WizardMode) => void;

    // Wizard Flow State
    step: WizardStep;
    setStep: (step: WizardStep) => void;

    // Actions
    reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
    mode: 'menu',
    setMode: (mode) => set({ mode }),

    step: 'mode_select',
    setStep: (step) => set({ step }),

    reset: () => set({ mode: 'menu', step: 'mode_select' })
}));
