"use client";

import { Text } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { CITY_COLORS } from "../../constants/city-theme";

// ==================== Constants ====================

const BUILDING_WIDTH = 12;
const BUILDING_HEIGHT = 8;
const BUILDING_DEPTH = 8;

const CONTACT_KIOSKS = [
  { label: "GitHub", accent: "#333333" },
  { label: "LinkedIn", accent: "#0A66C2" },
  { label: "Telegram", accent: "#26A5E4" },
  { label: "Email", accent: "#EA4335" },
  { label: "Portfolio", accent: "#6D4C41" },
] as const;

// ==================== Front Windows ====================

function FrontWindows() {
  const windows = useMemo(() => {
    const items: { position: [number, number, number] }[] = [];
    const spacing = BUILDING_WIDTH / 4;

    // 3 medium windows across the front
    for (let i = 0; i < 3; i++) {
      const x = (i + 1) * spacing - BUILDING_WIDTH / 2;
      items.push({
        position: [x, 5, BUILDING_DEPTH / 2 + 0.06],
      });
    }

    return items;
  }, []);

  return (
    <>
      {windows.map((w, i) => (
        <mesh key={`front-win-${i}`} position={w.position}>
          <boxGeometry args={[1.5, 1.8, 0.1]} />
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

// ==================== Blue Trim ====================

function BlueTrim() {
  const trims = useMemo(() => {
    const items: {
      position: [number, number, number];
      size: [number, number, number];
    }[] = [];

    // Horizontal trim along front top edge
    items.push({
      position: [0, BUILDING_HEIGHT - 0.15, BUILDING_DEPTH / 2 + 0.06],
      size: [BUILDING_WIDTH + 0.2, 0.2, 0.08],
    });

    // Horizontal trim along front bottom edge
    items.push({
      position: [0, 0.1, BUILDING_DEPTH / 2 + 0.06],
      size: [BUILDING_WIDTH + 0.2, 0.2, 0.08],
    });

    // Vertical trim on front corners
    items.push({
      position: [
        -BUILDING_WIDTH / 2 + 0.1,
        BUILDING_HEIGHT / 2,
        BUILDING_DEPTH / 2 + 0.06,
      ],
      size: [0.15, BUILDING_HEIGHT, 0.08],
    });
    items.push({
      position: [
        BUILDING_WIDTH / 2 - 0.1,
        BUILDING_HEIGHT / 2,
        BUILDING_DEPTH / 2 + 0.06,
      ],
      size: [0.15, BUILDING_HEIGHT, 0.08],
    });

    // Horizontal trim mid-section
    items.push({
      position: [0, 3.5, BUILDING_DEPTH / 2 + 0.06],
      size: [BUILDING_WIDTH + 0.2, 0.1, 0.08],
    });

    return items;
  }, []);

  return (
    <>
      {trims.map((t, i) => (
        <mesh key={`trim-${i}`} position={t.position}>
          <boxGeometry args={t.size} />
          <meshStandardMaterial
            color={CITY_COLORS.signBlue}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      ))}
    </>
  );
}

// ==================== Contact Kiosk ====================

interface ContactKioskProps {
  label: string;
  accent: string;
  position: [number, number, number];
}

function ContactKiosk({ label, accent, position }: ContactKioskProps) {
  return (
    <group position={position}>
      {/* Kiosk body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.8, 1.5, 0.4]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {/* White screen panel */}
      <mesh position={[0, 0.9, 0.21]}>
        <boxGeometry args={[0.6, 0.8, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Label text */}
      <Text
        position={[0, 0.9, 0.23]}
        fontSize={0.15}
        color={accent}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.55}
      >
        {label}
      </Text>

      {/* Accent color strip at top of kiosk */}
      <mesh position={[0, 1.45, 0.21]}>
        <boxGeometry args={[0.6, 0.06, 0.02]} />
        <meshStandardMaterial color={accent} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.3]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
}

// ==================== Main PostOffice Component ====================

export function PostOffice() {
  return (
    <group position={[-150, 0, -300]}>
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
            color={CITY_COLORS.buildingWhite}
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>
      </RigidBody>

      {/* ==================== Blue Trim / Accents ==================== */}
      <BlueTrim />

      {/* ==================== Front Windows ==================== */}
      <FrontWindows />

      {/* ==================== Entrance ==================== */}
      {/* Door frame */}
      <mesh position={[0, 1.75, BUILDING_DEPTH / 2 + 0.12]}>
        <boxGeometry args={[2.2, 3.5, 0.2]} />
        <meshStandardMaterial
          color={CITY_COLORS.door}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Glass door panels */}
      <mesh position={[-0.45, 1.75, BUILDING_DEPTH / 2 + 0.24]}>
        <boxGeometry args={[0.7, 3, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.glassDark}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh position={[0.45, 1.75, BUILDING_DEPTH / 2 + 0.24]}>
        <boxGeometry args={[0.7, 3, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.glassDark}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* ==================== Roof Edge ==================== */}
      <mesh position={[0, BUILDING_HEIGHT + 0.15, 0]}>
        <boxGeometry args={[BUILDING_WIDTH + 0.4, 0.3, BUILDING_DEPTH + 0.4]} />
        <meshStandardMaterial
          color={CITY_COLORS.roofGray}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* ==================== Roof Antenna (Communication Device) ==================== */}
      {/* Antenna pole */}
      <mesh position={[0, BUILDING_HEIGHT + 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3.5, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Antenna sphere top */}
      <mesh position={[0, BUILDING_HEIGHT + 4, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>

      {/* Horizontal antenna crossbar */}
      <mesh position={[0, BUILDING_HEIGHT + 3.2, 0]}>
        <boxGeometry args={[2, 0.06, 0.06]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Small dish element */}
      <mesh position={[0, BUILDING_HEIGHT + 2.5, 0.3]} scale={[1, 0.3, 1]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial
          color={CITY_COLORS.buildingWhite}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* ==================== Mailbox ==================== */}
      <group position={[4.5, 0, BUILDING_DEPTH / 2 + 1.5]}>
        {/* Stand pole */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshStandardMaterial
            color={CITY_COLORS.metalDark}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        {/* Mailbox body */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.4, 0.8, 0.3]} />
          <meshStandardMaterial
            color={CITY_COLORS.signBlue}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Mailbox rounded top (small box to approximate) */}
        <mesh position={[0, 1.55, 0]}>
          <boxGeometry args={[0.42, 0.12, 0.32]} />
          <meshStandardMaterial
            color={CITY_COLORS.signBlue}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>

        {/* Mail slot */}
        <mesh position={[0, 1.2, 0.16]}>
          <boxGeometry args={[0.25, 0.04, 0.02]} />
          <meshStandardMaterial
            color={CITY_COLORS.metalDark}
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* "MAIL" label */}
        <Text
          position={[0, 0.95, 0.16]}
          fontSize={0.08}
          color={CITY_COLORS.signWhite}
          anchorX="center"
          anchorY="middle"
        >
          MAIL
        </Text>
      </group>

      {/* ==================== Contact Kiosks ==================== */}
      {CONTACT_KIOSKS.map((kiosk, i) => {
        const totalWidth = (CONTACT_KIOSKS.length - 1) * 1.8;
        const x = -totalWidth / 2 + i * 1.8;
        return (
          <ContactKiosk
            key={kiosk.label}
            label={kiosk.label}
            accent={kiosk.accent}
            position={[x, 0, BUILDING_DEPTH / 2 + 3.5]}
          />
        );
      })}

      {/* ==================== Building Sign ==================== */}
      <Text
        position={[0, BUILDING_HEIGHT - 1.2, BUILDING_DEPTH / 2 + 0.15]}
        fontSize={0.5}
        color={CITY_COLORS.signBlue}
        anchorX="center"
        anchorY="middle"
      >
        CONTACT HUB
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, BUILDING_HEIGHT - 1.8, BUILDING_DEPTH / 2 + 0.15]}
        fontSize={0.2}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        Post Office
      </Text>

      {/* ==================== Flag Pole ==================== */}
      {/* Pole */}
      <mesh position={[-5, 2.5, BUILDING_DEPTH / 2 + 1.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 5, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metalDark}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Pole top cap */}
      <mesh position={[-5, 5.1, BUILDING_DEPTH / 2 + 1.5]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color={CITY_COLORS.metal}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Flag */}
      <mesh position={[-4.45, 4.5, BUILDING_DEPTH / 2 + 1.5]}>
        <boxGeometry args={[1, 0.6, 0.02]} />
        <meshStandardMaterial
          color={CITY_COLORS.signBlue}
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Flag text */}
      <Text
        position={[-4.45, 4.5, BUILDING_DEPTH / 2 + 1.52]}
        fontSize={0.15}
        color={CITY_COLORS.signWhite}
        anchorX="center"
        anchorY="middle"
      >
        CONTACT
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
