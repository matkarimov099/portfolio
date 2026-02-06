"use client";

import { Sky } from "@react-three/drei";
import { CityGround, CityBoundary, CityModels } from "../city";
import { CityStreets } from "./CityStreets";
import { CityPark } from "./CityPark";
import { TechOffice } from "./TechOffice";
import { ProjectBuilding } from "./ProjectBuilding";
import { DataCenter } from "./DataCenter";
import { ChatCafe } from "./ChatCafe";
import { PostOffice } from "./PostOffice";
import { CareerMuseum } from "./CareerMuseum";
import { InstancedBuildings } from "../buildings/InstancedBuildings";
import {
  EiffelTower,
  BigBen,
  EmpireState,
  BurjAlArab,
  Colosseum,
  TokyoTower,
} from "../landmarks";
import { CityVegetation } from "../environment/CityVegetation";
import { StreetFurniture } from "../environment/StreetFurniture";
import { useChunkCulling } from "../../hooks/use-chunk-culling";

export function CityMap() {
  const activeChunks = useChunkCulling();

  return (
    <group>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 80, 50]}
        inclination={0.5}
        azimuth={0.25}
        turbidity={8}
        rayleigh={2}
      />

      {/* Ground and boundaries */}
      <CityGround />
      <CityBoundary />

      {/* GLB City Models */}
      <CityModels />

      {/* Road network */}
      <CityStreets />

      {/* Procedural buildings (InstancedMesh, chunk-filtered) */}
      <InstancedBuildings activeChunks={activeChunks} />

      {/* Portfolio zones (always rendered) */}
      <CityPark />
      <TechOffice />
      <ProjectBuilding />
      <DataCenter />
      <ChatCafe />
      <PostOffice />
      <CareerMuseum />

      {/* Famous landmarks (always rendered) */}
      <EiffelTower />
      <BigBen />
      <EmpireState />
      <BurjAlArab />
      <Colosseum />
      <TokyoTower />

      {/* Environment (chunk-filtered) */}
      <CityVegetation />
      <StreetFurniture />
    </group>
  );
}
