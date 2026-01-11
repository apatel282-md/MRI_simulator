import { useRef } from "react";
import type { MutableRefObject } from "react";
import type { Vector3 } from "three";
import { FAT_PROPS, WATER_PROPS } from "../../constants/physics";
import { usePhysicsEngine } from "../../hooks/usePhysicsEngine";
import { useSimulationState } from "../../hooks/useSimulationState";
import type { Spin } from "../../types/simulation";
import IndividualSpins from "./IndividualSpins";
import NetMagnetizationVector from "./NetMagnetizationVector";

interface ProtonSystemProps {
  nmvRef: MutableRefObject<Vector3>;
  nmvWaterRef: MutableRefObject<Vector3>;
  nmvFatRef: MutableRefObject<Vector3>;
}

const ProtonSystem = ({
  nmvRef,
  nmvWaterRef,
  nmvFatRef,
}: ProtonSystemProps) => {
  const viewMode = useSimulationState((state) => state.viewMode);
  const tissueMode = useSimulationState((state) => state.tissueMode);
  const spinsRef = useRef<Spin[]>([]);

  usePhysicsEngine({ spinsRef, nmvRef, nmvWaterRef, nmvFatRef });

  return (
    <group>
      {viewMode === "spins" ? (
        <IndividualSpins spinsRef={spinsRef} tissueMode={tissueMode} />
      ) : (
        <>
          {tissueMode === "both" && (
            <>
              <NetMagnetizationVector
                nmvRef={nmvWaterRef}
                color={WATER_PROPS.color}
              />
              <NetMagnetizationVector
                nmvRef={nmvFatRef}
                color={FAT_PROPS.color}
              />
            </>
          )}
          {tissueMode === "water" && (
            <NetMagnetizationVector
              nmvRef={nmvWaterRef}
              color={WATER_PROPS.color}
            />
          )}
          {tissueMode === "fat" && (
            <NetMagnetizationVector
              nmvRef={nmvFatRef}
              color={FAT_PROPS.color}
            />
          )}
        </>
      )}
    </group>
  );
};

export default ProtonSystem;
