"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";

// ==================== Constants ====================

const BUILDING_WIDTH = 10;
const BUILDING_HEIGHT = 30;
const BUILDING_DEPTH = 10;

const FLOOR_COUNT = 10;
const FLOOR_HEIGHT = BUILDING_HEIGHT / FLOOR_COUNT; // 3m per floor
const WINDOWS_PER_FACE = 3;
const WINDOW_WIDTH = 1.5;
const WINDOW_HEIGHT = 1.5;
const WINDOW_DEPTH = 0.1;

const LOBBY_HEIGHT = 4;

const PROJECT_PANELS = [
  { label: "Portfolio", floor: 2 },
  { label: "E-commerce", floor: 3 },
  { label: "Dashboard", floor: 5 },
  { label: "Mobile App", floor: 6 },
  { label: "API", floor: 8 },
  { label: "CMS", floor: 9 },
] as const;

// ==================== Window Face ====================

interface WindowFaceProps {
  face: "front" | "left" | "right";
}

function WindowFace({ face }: WindowFaceProps) {
  const windows = useMemo(() => {
    const items: { position: [number, number, number] }[] = [];
    const spacing = BUILDING_WIDTH / (WINDOWS_PER_FACE + 1);

    // Floors 2-10 (floor 1 is lobby with different windows)
    for (let floor = 1; floor < FLOOR_COUNT; floor++) {
      const y = floor * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;

      for (let col = 0; col < WINDOWS_PER_FACE; col++) {
        const offset = (col + 1) * spacing - BUILDING_WIDTH / 2;

        let position: [number, number, number];
        if (face === "front") {
          position = [offset, y, BUILDING_DEPTH / 2 + WINDOW_DEPTH / 2];
        } else if (face === "right") {
          position = [BUILDING_WIDTH / 2 + WINDOW_DEPTH / 2, y, offset];
        } else {
          position = [-BUILDING_WIDTH / 2 - WINDOW_DEPTH / 2, y, offset];
        }

        items.push({ position });
      }
    }
    return items;
  }, [face]);

  return (
    <>
      {windows.map((w, i) => (
        <mesh key={`win-${face}-${i}`} position={w.position}>
          <boxGeometry
            args={[
              face === "front" ? WINDOW_WIDTH : WINDOW_DEPTH,
              WINDOW_HEIGHT,
              face === "front" ? WINDOW_DEPTH : WINDOW_WIDTH,
            ]}
          />
          <meshStandardMaterial
            color={CITY_COLORS.glass}
            roughness={0.2}
            metalness={0.3}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

// ==================== Glass Lobby ====================

function GlassLobby() {
  const lobbyPanels = useMemo(() => {
    const items: {
      position: [number, number, number];
      size: [number, number, number];
    }[] = [];
    const panelWidth = 2.2;
    const panelHeight = 3.2;
    const spacing = BUILDING_WIDTH / 4;

    // Front face lobby windows (3 tall glass panels)
    for (let col = 0; col < 3; col++) {
      const x = (col + 1) * spacing - BUILDING_WIDTH / 2;
      items.push({
        position: [x, LOBBY_HEIGHT / 2, BUILDING_DEPTH / 2 + 0.06],
        size: [panelWidth, panelHeight, 0.08],
      });
    }

    return items;
  }, []);

  return (
    <>
      {lobbyPanels.map((panel, i) => (
        <mesh key={`lobby-${i}`} position={panel.position}>
          <boxGeometry args={panel.size} />
          <meshStandardMaterial
            color={CITY_COLORS.glassDark}
            roughness={0.15}
            metalness={0.2}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}

      {/* Lobby door */}
      <mesh position={[0, 1.5, BUILDING_DEPTH / 2 + 0.12]}>
        <boxGeometry args={[1.8, 3, 0.2]} />
        <meshStandardMaterial
          color={CITY_COLORS.door}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Door glass insert */}
      <mesh position={[0, 1.6, BUILDING_DEPTH / 2 + 0.24]}>
        <boxGeometry args={[1.4, 2.4, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.glassDark}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Horizontal lobby divider line */}
      <mesh position={[0, LOBBY_HEIGHT, BUILDING_DEPTH / 2 + 0.02]}>
        <boxGeometry args={[BUILDING_WIDTH, 0.1, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingGray}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
    </>
  );
}

// ==================== Project Display Panel ====================

interface ProjectPanelProps {
  label: string;
  floor: number;
}

function ProjectPanel({ label, floor }: ProjectPanelProps) {
  const y = floor * FLOOR_HEIGHT + FLOOR_HEIGHT / 2;
  const z = BUILDING_DEPTH / 2 + 0.06;

  return (
    <group position={[0, y, z]}>
      {/* White panel background */}
      <mesh castShadow>
        <boxGeometry args={[2, 1.5, 0.05]} />
        <meshStandardMaterial
          color={CITY_COLORS.signWhite}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Project label text */}
      <Text
        position={[0, 0, 0.04]}
        fontSize={0.25}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {label}
      </Text>

      {/* Thin border line at bottom of panel */}
      <mesh position={[0, -0.7, 0.03]}>
        <boxGeometry args={[1.8, 0.04, 0.01]} />
        <meshStandardMaterial
          color={CITY_COLORS.glass}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

// ==================== Main ProjectBuilding Component ====================

export function ProjectBuilding() {
  return (
    <group position={[100, 0, -100]}>
      {/* ==================== Main Building ==================== */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[BUILDING_WIDTH / 2, BUILDING_HEIGHT / 2, BUILDING_DEPTH / 2]}
          position={[0, BUILDING_HEIGHT / 2, 0]}
        />

        {/* Building walls */}
        <mesh position={[0, BUILDING_HEIGHT / 2, 0]} castShadow>
          <boxGeometry
            args={[BUILDING_WIDTH, BUILDING_HEIGHT, BUILDING_DEPTH]}
          />
          <meshStandardMaterial
            color={CITY_COLORS.buildingGray}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      </RigidBody>

      {/* ==================== Windows ==================== */}
      <WindowFace face="front" />
      <WindowFace face="left" />
      <WindowFace face="right" />

      {/* ==================== Glass Lobby (Ground Floor) ==================== */}
      <GlassLobby />

      {/* ==================== Floor Separator Lines ==================== */}
      {Array.from({ length: FLOOR_COUNT - 1 }, (_, i) => {
        const y = (i + 1) * FLOOR_HEIGHT;
        return (
          <mesh
            key={`floor-line-${i}`}
            position={[0, y, BUILDING_DEPTH / 2 + 0.01]}
          >
            <boxGeometry args={[BUILDING_WIDTH, 0.06, 0.01]} />
            <meshStandardMaterial
              color={CITY_COLORS.buildingGray}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* ==================== Roof Edge ==================== */}
      <mesh position={[0, BUILDING_HEIGHT + 0.15, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.4, 0.3, BUILDING_DEPTH + 0.4]} />
        <meshStandardMaterial
          color={CITY_COLORS.roofGray}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* ==================== Antenna on Roof ==================== */}
      {/* Antenna pole */}
      <mesh position={[0, BUILDING_HEIGHT + 2.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Antenna tip sphere */}
      <mesh position={[0, BUILDING_HEIGHT + 4.5, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>

      {/* ==================== Project Display Panels ==================== */}
      {PROJECT_PANELS.map((panel) => (
        <ProjectPanel
          key={panel.label}
          label={panel.label}
          floor={panel.floor}
        />
      ))}

      {/* ==================== Entrance Pillars ==================== */}
      {/* Left pillar */}
      <mesh position={[-1.5, 2, BUILDING_DEPTH / 2 + 0.5]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 4, 12]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingCream}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Right pillar */}
      <mesh position={[1.5, 2, BUILDING_DEPTH / 2 + 0.5]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 4, 12]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingCream}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Pillar crossbeam above entrance */}
      <mesh position={[0, 4.1, BUILDING_DEPTH / 2 + 0.5]}>
        <boxGeometry args={[3.4, 0.2, 0.3]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingCream}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* ==================== Flag Pole ==================== */}
      {/* Pole */}
      <mesh position={[4, 2.5, BUILDING_DEPTH / 2 + 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 5, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Flag */}
      <mesh position={[4.5, 4.6, BUILDING_DEPTH / 2 + 2]}>
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.signBlue}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* ==================== Building Sign ==================== */}
      <Text
        position={[0, BUILDING_HEIGHT - 1.5, BUILDING_DEPTH / 2 + 0.08]}
        fontSize={0.6}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        PROJECT TOWER
      </Text>

      {/* ==================== Front Sidewalk ==================== */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, BUILDING_DEPTH / 2 + 2]}
        receiveShadow
      >
        <boxGeometry args={[BUILDING_WIDTH + 4, 3, 0.04]} />
        <meshStandardMaterial
          color={CITY_COLORS.sidewalk}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}
