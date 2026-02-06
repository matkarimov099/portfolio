"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type * as THREE from "three";
import { useChunkCulling } from "../../hooks/use-chunk-culling";
import { CITY_COLORS } from "../../constants/city-theme";
import { GRID_ROADS } from "../../constants/road-grid";
import type { ChunkId } from "../../types";

// ==================== Helpers ====================

function getChunkId(x: number, z: number): ChunkId {
  const gx = Math.floor((x + 400) / 200) - 2;
  const gz = Math.floor((z + 400) / 200) - 2;
  return `${gx}_${gz}` as ChunkId;
}

// ==================== Types ====================

interface CarConfig {
  color: string;
  speed: number;
  offset: number;
  route: {
    start: [number, number, number];
    end: [number, number, number];
  };
}

interface TrafficLightConfig {
  position: [number, number, number];
  rotationY: number;
  cycleOffset: number;
  chunkId: ChunkId;
}

interface RoadSignConfig {
  position: [number, number, number];
  rotationY: number;
  text: string;
  isStop?: boolean;
  chunkId: ChunkId;
}

// ==================== Car Sub-Component ====================

function Car({
  color,
  speed,
  offset,
  route,
  activeChunkSet,
}: CarConfig & { activeChunkSet: Set<ChunkId> }) {
  const groupRef = useRef<THREE.Group>(null);

  const routeData = useMemo(() => {
    const dx = route.end[0] - route.start[0];
    const dz = route.end[2] - route.start[2];
    const midX = (route.start[0] + route.end[0]) / 2;
    const midZ = (route.start[2] + route.end[2]) / 2;
    const halfRangeX = dx / 2;
    const halfRangeZ = dz / 2;
    const baseAngle = Math.atan2(dx, dz);
    return { midX, midZ, halfRangeX, halfRangeZ, baseAngle };
  }, [route]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    const sinVal = Math.sin(t * speed + offset);
    const cosVal = Math.cos(t * speed + offset);

    const x = routeData.midX + sinVal * routeData.halfRangeX;
    const z = routeData.midZ + sinVal * routeData.halfRangeZ;

    // Check if the car's current position is in an active chunk
    const chunk = getChunkId(x, z);
    if (!activeChunkSet.has(chunk)) {
      // Hide car when outside active chunks
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;
    groupRef.current.position.set(x, 0.3, z);

    const facing = cosVal >= 0 ? 0 : Math.PI;
    groupRef.current.rotation.y = routeData.baseAngle + facing;
  });

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[1, 0.8, 2]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Roof / cabin */}
      <mesh castShadow position={[0, 0.65, -0.15]}>
        <boxGeometry args={[0.9, 0.5, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Front windshield */}
      <mesh position={[0, 0.55, 0.48]}>
        <boxGeometry args={[0.8, 0.4, 0.04]} />
        <meshStandardMaterial
          color="#88CCFF"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.55, -0.78]}>
        <boxGeometry args={[0.8, 0.35, 0.04]} />
        <meshStandardMaterial
          color="#88CCFF"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Wheels */}
      <mesh position={[-0.55, -0.3, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0.55, -0.3, 0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[-0.55, -0.3, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0.55, -0.3, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.35, 0.1, 1.02]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshStandardMaterial
          color="#FFFFEE"
          roughness={0.3}
          metalness={0.1}
          emissive="#FFFFEE"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh position={[0.35, 0.1, 1.02]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshStandardMaterial
          color="#FFFFEE"
          roughness={0.3}
          metalness={0.1}
          emissive="#FFFFEE"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-0.35, 0.1, -1.02]}>
        <sphereGeometry args={[0.07, 6, 4]} />
        <meshStandardMaterial
          color={CITY_COLORS.trafficRed}
          roughness={0.4}
          metalness={0.1}
          emissive={CITY_COLORS.trafficRed}
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0.35, 0.1, -1.02]}>
        <sphereGeometry args={[0.07, 6, 4]} />
        <meshStandardMaterial
          color={CITY_COLORS.trafficRed}
          roughness={0.4}
          metalness={0.1}
          emissive={CITY_COLORS.trafficRed}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

// ==================== Traffic Light Sub-Component ====================

const CYCLE_DURATION = 18; // Green 8s + Yellow 2s + Red 8s = 18s total

function getActiveLight(
  elapsed: number,
  cycleOffset: number,
): "green" | "yellow" | "red" {
  const t = (elapsed + cycleOffset) % CYCLE_DURATION;
  if (t < 8) return "green";
  if (t < 10) return "yellow";
  return "red";
}

function TrafficLight({
  position,
  rotationY,
  cycleOffset,
}: Omit<TrafficLightConfig, "chunkId">) {
  const redRef = useRef<THREE.Mesh>(null);
  const yellowRef = useRef<THREE.Mesh>(null);
  const greenRef = useRef<THREE.Mesh>(null);
  const prevLight = useRef<string>("");

  useFrame((state) => {
    const active = getActiveLight(state.clock.elapsedTime, cycleOffset);

    if (active === prevLight.current) return;
    prevLight.current = active;

    const setIntensity = (
      ref: React.RefObject<THREE.Mesh | null>,
      intensity: number,
    ) => {
      if (ref.current) {
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = intensity;
      }
    };

    setIntensity(redRef, active === "red" ? 2 : 0.1);
    setIntensity(yellowRef, active === "yellow" ? 2 : 0.1);
    setIntensity(greenRef, active === "green" ? 2 : 0.1);
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pole */}
      <mesh castShadow position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3.5, 6]} />
        <meshStandardMaterial
          color={CITY_COLORS.trafficPole}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Signal box housing */}
      <mesh castShadow position={[0, 3.65, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.15]} />
        <meshStandardMaterial
          color={CITY_COLORS.trafficPole}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Red light (top) */}
      <mesh ref={redRef} position={[0, 3.85, 0.08]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial
          color={CITY_COLORS.trafficRed}
          roughness={0.5}
          metalness={0.1}
          emissive={CITY_COLORS.trafficRed}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Yellow light (middle) */}
      <mesh ref={yellowRef} position={[0, 3.65, 0.08]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial
          color={CITY_COLORS.trafficYellow}
          roughness={0.5}
          metalness={0.1}
          emissive={CITY_COLORS.trafficYellow}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Green light (bottom) */}
      <mesh ref={greenRef} position={[0, 3.45, 0.08]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial
          color={CITY_COLORS.trafficGreen}
          roughness={0.5}
          metalness={0.1}
          emissive={CITY_COLORS.trafficGreen}
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}

// ==================== Road Sign Sub-Component ====================

function RoadSign({
  position,
  rotationY,
  text,
  isStop = false,
}: Omit<RoadSignConfig, "chunkId">) {
  const bgColor = isStop ? CITY_COLORS.trafficRed : CITY_COLORS.signWhite;
  const textColor = isStop ? CITY_COLORS.signWhite : "#333333";

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pole */}
      <mesh castShadow position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.5, 6]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Sign board */}
      <mesh castShadow position={[0, 2.6, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.03]} />
        <meshStandardMaterial
          color={bgColor}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Text on front face */}
      <Text
        position={[0, 2.6, 0.02]}
        fontSize={0.12}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.6}
      >
        {text}
      </Text>

      {/* Text on back face */}
      <Text
        position={[0, 2.6, -0.02]}
        fontSize={0.12}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.6}
        rotation={[0, Math.PI, 0]}
      >
        {text}
      </Text>
    </group>
  );
}

// ==================== Data Definitions ====================

// Find boulevard intersections for traffic lights and car routes
const X_BOULEVARDS = GRID_ROADS.filter(
  (r) => r.type === "boulevard" && r.axis === "x",
);
const Z_BOULEVARDS = GRID_ROADS.filter(
  (r) => r.type === "boulevard" && r.axis === "z",
);

// Pick specific road segments for car routes across the 800x800 map
// Cars oscillate back and forth on road segments
const CAR_COLORS = [
  "#E53935", // red
  "#3B82F6", // blue
  "#E8E8E8", // white
  "#8B8B8B", // gray
  "#4CAF50", // green
  "#FFC107", // yellow
  "#333333", // black
  "#FF8C00", // orange
  "#C0C0C0", // silver
  "#1A237E", // dark-blue
  "#6D4C41", // brown
  "#009688", // teal
];

function generateCarConfigs(): CarConfig[] {
  const cars: CarConfig[] = [];

  // Get some road segments for cars to drive on
  // Use X-axis roads (cars drive along X, fixed Z)
  const xRoads = GRID_ROADS.filter((r) => r.axis === "x");
  const zRoads = GRID_ROADS.filter((r) => r.axis === "z");

  // Pick 6 cars on X-axis roads
  const xSegments = xRoads.slice(0, 6);
  for (let i = 0; i < xSegments.length && i < 6; i++) {
    const road = xSegments[i];
    // Use a portion of the road (not the full 800m)
    const segStart = road.start + 50 + i * 40;
    const segEnd = Math.min(segStart + 200, road.end - 50);
    // Offset the car to one lane (not center)
    const laneOffset = i % 2 === 0 ? road.width / 4 : -road.width / 4;

    cars.push({
      color: CAR_COLORS[i],
      speed: 0.3 + i * 0.05,
      offset: i * 1.7,
      route: {
        start: [segStart, 0.3, road.position + laneOffset],
        end: [segEnd, 0.3, road.position + laneOffset],
      },
    });
  }

  // Pick 6 cars on Z-axis roads
  const zSegments = zRoads.slice(0, 6);
  for (let i = 0; i < zSegments.length && i < 6; i++) {
    const road = zSegments[i];
    const segStart = road.start + 50 + i * 40;
    const segEnd = Math.min(segStart + 200, road.end - 50);
    const laneOffset = i % 2 === 0 ? road.width / 4 : -road.width / 4;

    cars.push({
      color: CAR_COLORS[6 + i],
      speed: 0.25 + i * 0.06,
      offset: i * 2.3,
      route: {
        start: [road.position + laneOffset, 0.3, segStart],
        end: [road.position + laneOffset, 0.3, segEnd],
      },
    });
  }

  return cars;
}

function generateTrafficLights(): TrafficLightConfig[] {
  const lights: TrafficLightConfig[] = [];

  // Place traffic lights at boulevard intersections (up to 8)
  let count = 0;
  for (const xRoad of X_BOULEVARDS) {
    for (const zRoad of Z_BOULEVARDS) {
      if (count >= 8) break;

      const ix = zRoad.position; // intersection X
      const iz = xRoad.position; // intersection Z
      const offset = Math.max(xRoad.width, zRoad.width) / 2 + 1;

      // N/S pair (cycleOffset = 0)
      lights.push({
        position: [ix + offset, 0, iz + offset],
        rotationY: 0,
        cycleOffset: 0,
        chunkId: getChunkId(ix + offset, iz + offset),
      });

      lights.push({
        position: [ix - offset, 0, iz - offset],
        rotationY: Math.PI,
        cycleOffset: 0,
        chunkId: getChunkId(ix - offset, iz - offset),
      });

      // E/W pair (cycleOffset = 10 for opposite phase)
      lights.push({
        position: [ix + offset, 0, iz - offset],
        rotationY: -Math.PI / 2,
        cycleOffset: 10,
        chunkId: getChunkId(ix + offset, iz - offset),
      });

      lights.push({
        position: [ix - offset, 0, iz + offset],
        rotationY: Math.PI / 2,
        cycleOffset: 10,
        chunkId: getChunkId(ix - offset, iz + offset),
      });

      count++;
    }
    if (count >= 8) break;
  }

  return lights;
}

function generateRoadSigns(): RoadSignConfig[] {
  const signs: RoadSignConfig[] = [];

  // Signs at boulevard intersections
  let count = 0;
  for (const xRoad of X_BOULEVARDS) {
    for (const zRoad of Z_BOULEVARDS) {
      if (count >= 12) break;

      const ix = zRoad.position;
      const iz = xRoad.position;
      const offset = Math.max(xRoad.width, zRoad.width) / 2 + 3;

      // Direction sign or stop sign at each intersection
      const signType = count % 3;

      if (signType === 0) {
        // Stop sign
        signs.push({
          position: [ix + offset, 0, iz],
          rotationY: -Math.PI / 2,
          text: "STOP",
          isStop: true,
          chunkId: getChunkId(ix + offset, iz),
        });
      } else if (signType === 1) {
        // Speed limit sign
        signs.push({
          position: [ix, 0, iz + offset],
          rotationY: 0,
          text: "SPEED 30",
          chunkId: getChunkId(ix, iz + offset),
        });
      } else {
        // District direction sign
        const label = iz < 0 ? "\u2191 Downtown" : "\u2193 Central Park";
        signs.push({
          position: [ix - offset, 0, iz],
          rotationY: Math.PI / 2,
          text: label,
          chunkId: getChunkId(ix - offset, iz),
        });
      }

      count++;
    }
    if (count >= 12) break;
  }

  return signs;
}

// ==================== Pre-generate data (module level) ====================

const CAR_CONFIGS = generateCarConfigs();
const TRAFFIC_LIGHT_CONFIGS = generateTrafficLights();
const ROAD_SIGN_CONFIGS = generateRoadSigns();

// ==================== Main Component ====================

export function TrafficSystem() {
  const activeChunks = useChunkCulling();

  const activeChunkSet = useMemo(() => new Set(activeChunks), [activeChunks]);

  // Filter traffic lights by active chunks
  const visibleLights = useMemo(
    () => TRAFFIC_LIGHT_CONFIGS.filter((l) => activeChunkSet.has(l.chunkId)),
    [activeChunkSet],
  );

  // Filter road signs by active chunks
  const visibleSigns = useMemo(
    () => ROAD_SIGN_CONFIGS.filter((s) => activeChunkSet.has(s.chunkId)),
    [activeChunkSet],
  );

  return (
    <group>
      {/* Cars (all 12 mounted, visibility toggled per-frame based on chunk) */}
      {CAR_CONFIGS.map((config, i) => (
        <Car key={`car-${i}`} {...config} activeChunkSet={activeChunkSet} />
      ))}

      {/* Traffic lights (chunk-filtered) */}
      {visibleLights.map((config, _i) => (
        <TrafficLight
          key={`tl-${config.position[0].toFixed(0)}-${config.position[2].toFixed(0)}`}
          position={config.position}
          rotationY={config.rotationY}
          cycleOffset={config.cycleOffset}
        />
      ))}

      {/* Road signs (chunk-filtered) */}
      {visibleSigns.map((config, _i) => (
        <RoadSign
          key={`sign-${config.position[0].toFixed(0)}-${config.position[2].toFixed(0)}`}
          position={config.position}
          rotationY={config.rotationY}
          text={config.text}
          isStop={config.isStop}
        />
      ))}
    </group>
  );
}
