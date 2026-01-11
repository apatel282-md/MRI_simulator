# MRI Physics Playground - Implementation Plan

## Overview
Build a Single Page Application that visually simulates proton spin dynamics to teach MRI physics concepts including Fat vs Water protons, Net Magnetization, and Laboratory vs Rotating reference frames.

## Tech Stack
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **3D Engine**: React Three Fiber (R3F) + Three.js + @react-three/drei
- **Animations**: Framer Motion (UI), R3F useFrame (Physics)
- **Charting**: Recharts

---

## Physics Constants (Scaled for Visualization)

Based on real MRI physics, scaled to emphasize the **relational differences** between tissue types:

| Property | Water (Blue) | Fat (Yellow) | Real-World Ratio |
|----------|--------------|--------------|------------------|
| T1 Recovery | 4.0s (slow) | 1.5s (fast) | Water ~2-3x longer |
| T2 Decay | 2.0s (slow) | 0.4s (fast) | Water ~4-5x longer |
| Precession Freq | 1.0 Hz (base) | 0.93 Hz | Fat ~3.5ppm slower |

**Key Teaching Points These Constants Demonstrate:**
- Fat recovers longitudinal magnetization faster (shorter T1) - appears brighter on T1-weighted images
- Water maintains transverse coherence longer (longer T2) - appears brighter on T2-weighted images
- Chemical shift: Fat precesses slightly slower due to electron shielding

**B0 Off State**: Spins orient randomly with no precession, NMV collapses to ~0.

**RF Pulse Animation**: 300ms smooth rotation for 90° and 180° pulses.

---

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Main layout orchestration
├── index.css                   # Tailwind imports
│
├── components/
│   ├── ui/
│   │   ├── TopBar.tsx          # Header with title
│   │   ├── Sidebar.tsx         # Control panel container
│   │   ├── TissueSelector.tsx  # Water/Fat/Both radio buttons
│   │   ├── ViewModeToggle.tsx  # NMV vs Individual spins
│   │   ├── FrameToggle.tsx     # Laboratory vs Rotating
│   │   ├── FieldControls.tsx   # B0 on/off switch
│   │   ├── PulseButtons.tsx    # 90° and 180° pulse buttons
│   │   ├── ResetButton.tsx     # Reset to equilibrium
│   │   └── Tooltip.tsx         # Reusable tooltip component
│   │
│   ├── scene/
│   │   ├── ScannerScene.tsx    # Main R3F Canvas wrapper
│   │   ├── CameraRig.tsx       # Handles rotating frame camera
│   │   ├── CoordinateGrid.tsx  # XYZ axes with labels
│   │   ├── ProtonSystem.tsx    # Manages all spin objects
│   │   ├── NetMagnetizationVector.tsx  # Large NMV arrow
│   │   ├── IndividualSpins.tsx # Instanced spin meshes
│   │   └── Lighting.tsx        # Scene lighting setup
│   │
│   └── chart/
│       └── MagnetizationChart.tsx  # Recharts live line chart
│
├── hooks/
│   ├── useSimulationState.ts   # Global simulation state (Zustand)
│   ├── usePhysicsEngine.ts     # Core physics calculations
│   └── useChartData.ts         # Chart data sampling & history
│
├── types/
│   └── simulation.ts           # TypeScript interfaces
│
└── constants/
    └── physics.ts              # T1, T2, frequency constants
```

---

## Implementation Steps

### Phase 1: Project Setup
1. Initialize Vite + React + TypeScript project
2. Install dependencies:
   - `three`, `@react-three/fiber`, `@react-three/drei`
   - `tailwindcss`, `postcss`, `autoprefixer`
   - `framer-motion`
   - `recharts`
   - `zustand` (state management)
3. Configure Tailwind CSS
4. Create basic folder structure

### Phase 2: State Management & Types
1. Define TypeScript interfaces in `types/simulation.ts`:
   - `Spin` (position, magnetization vector)
   - `SimulationState` (tissue type, view mode, frame, B0, etc.)
   - `ChartDataPoint` (timestamp, Mz, Mxy)
2. Create Zustand store in `useSimulationState.ts`
3. Define physics constants in `constants/physics.ts`

### Phase 3: 3D Scene Foundation
1. **ScannerScene.tsx**: R3F Canvas with proper sizing
2. **Lighting.tsx**: Ambient + directional lights
3. **CoordinateGrid.tsx**: XYZ axes with labeled arrows (X, Y, Z/B0)
4. **CameraRig.tsx**: OrbitControls + rotating frame logic

### Phase 4: Physics Engine
1. **usePhysicsEngine.ts**: Core hook containing:
   - Spin array initialization (30 spins)
   - Precession calculation (based on tissue type)
   - T1 recovery (exponential growth toward equilibrium)
   - T2 decay (exponential decay + dephasing)
   - NMV calculation (vector sum)
   - RF pulse application (animated 90°/180° tips)
   - B0 toggle behavior

### Phase 5: 3D Visualization
1. **ProtonSystem.tsx**: Orchestrates spin visualization
2. **NetMagnetizationVector.tsx**: Single large arrow (cone + cylinder)
3. **IndividualSpins.tsx**: Instanced meshes for 30 spins
   - Use `InstancedMesh` for performance
   - Color-coded: Blue (water), Yellow (fat)

### Phase 6: UI Controls
1. **TopBar.tsx**: "MRI Physics Simulator" header
2. **Sidebar.tsx**: Right-side control panel
3. Individual control components with tooltips:
   - TissueSelector (Water/Fat/Both)
   - ViewModeToggle (NMV/Individual)
   - FrameToggle (Lab/Rotating)
   - FieldControls (B0 switch)
   - PulseButtons (90°/180°)
   - ResetButton

### Phase 7: Chart Integration
1. **useChartData.ts**:
   - Sample every 100ms
   - Store last 10 seconds (~100 data points)
   - Calculate Mz and Mxy from NMV
2. **MagnetizationChart.tsx**:
   - Dual line chart (Green = Mz/T1, Red = Mxy/T2)
   - Fixed Y-axis [0, 1]
   - Rolling X-axis (time)
   - Legend explaining T1/T2

### Phase 8: Polish & Integration
1. Framer Motion animations for UI transitions
2. Tooltip content for all controls
3. Responsive layout adjustments (desktop)
4. Performance optimization review
5. Final testing of all interactions

---

## Key Technical Decisions

### State Management
Using **Zustand** for lightweight, performant global state that can be accessed both in React components and inside R3F's render loop without causing unnecessary re-renders.

### Performance Strategy
- **Instanced Meshes**: 30 spins rendered via single draw call
- **Ref-based Animation**: Physics updates via refs, not React state
- **Chart Sampling**: 100ms intervals, not every frame
- **Memoization**: Heavy calculations memoized appropriately

### "Both" Tissue Mode
- Display two separate NMV arrows (blue + yellow) when in NMV mode
- Display mixed colored spins (15 blue, 15 yellow) in individual mode
- Chart shows 2 combined lines: Total Mz (green), Total Mxy (red) - representing the combined system for simpler visualization

### Rotating Frame Implementation
Camera rotates at the "average" Larmor frequency. In this frame:
- On-resonance spins appear stationary
- Off-resonance spins (fat/water difference) precess slowly
- Chemical shift becomes visible

---

## UI Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│  MRI Physics Simulator                              [?]     │  <- TopBar
├─────────────────────────────────────────────┬───────────────┤
│                                             │  Tissue Type  │
│                                             │  ○ Water      │
│                                             │  ○ Fat        │
│                                             │  ● Both       │
│                                             │───────────────│
│           3D SCENE                          │  View Mode    │
│        (Canvas Area)                        │  [NMV|Spins]  │
│                                             │───────────────│
│                                             │  Ref Frame    │
│                                             │  [Lab|Rot]    │
│                                             │───────────────│
│                                             │  B0 Field     │
│                                             │  [Off|On]     │
│                                             │───────────────│
│                                             │  [90° Pulse]  │
│                                             │  [180° Pulse] │
│                                             │  [Reset]      │
├─────────────────────────────────────────────┴───────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Magnetization Chart (Mz green, Mxy red)            │    │  <- Bottom Panel
│  │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Files to Create (in order)

1. `package.json` (via Vite init)
2. `vite.config.ts`
3. `tailwind.config.js`
4. `postcss.config.js`
5. `src/index.css`
6. `src/main.tsx`
7. `src/App.tsx`
8. `src/types/simulation.ts`
9. `src/constants/physics.ts`
10. `src/hooks/useSimulationState.ts`
11. `src/hooks/usePhysicsEngine.ts`
12. `src/hooks/useChartData.ts`
13. `src/components/ui/Tooltip.tsx`
14. `src/components/ui/TopBar.tsx`
15. `src/components/ui/Sidebar.tsx`
16. `src/components/ui/TissueSelector.tsx`
17. `src/components/ui/ViewModeToggle.tsx`
18. `src/components/ui/FrameToggle.tsx`
19. `src/components/ui/FieldControls.tsx`
20. `src/components/ui/PulseButtons.tsx`
21. `src/components/ui/ResetButton.tsx`
22. `src/components/scene/Lighting.tsx`
23. `src/components/scene/CoordinateGrid.tsx`
24. `src/components/scene/CameraRig.tsx`
25. `src/components/scene/NetMagnetizationVector.tsx`
26. `src/components/scene/IndividualSpins.tsx`
27. `src/components/scene/ProtonSystem.tsx`
28. `src/components/scene/ScannerScene.tsx`
29. `src/components/chart/MagnetizationChart.tsx`

---

## Estimated Complexity
- **Total Files**: ~30 files
- **Core Logic**: Physics engine + state management
- **Most Complex Component**: `usePhysicsEngine.ts` (physics calculations)
