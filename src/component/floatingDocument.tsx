import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Text, Box, Sphere, Plane } from "@react-three/drei";
import * as THREE from "three";

// Floating 3D Document
function FloatingDocument() {
    const meshRef = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
        if (meshRef.current) {
            (meshRef.current as THREE.Mesh).rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 + 0.3;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
        }
    });

    return (
        <group ref={meshRef} position={[0, 0, 0]}>
            {/* Main document */}
            <Box args={[2, 2.5, 0.05]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#ffffff" />
            </Box>
            
            {/* Document lines */}
            {[...Array(8)].map((_, i) => (
                <Box 
                    key={i} 
                    args={[1.5, 0.08, 0.01]} 
                    position={[-0.2, 0.8 - i * 0.2, 0.026]}
                >
                    <meshStandardMaterial color="#e5e5e5" />
                </Box>
            ))}
            
            {/* Header box */}
            <Box args={[1.6, 0.3, 0.01]} position={[0, 0.9, 0.026]}>
                <meshStandardMaterial color="#374151" />
            </Box>
        </group>
    );
}

// 3D Person Character
function Person3D({ position, color = "#1f2937", hairColor = "#2d1810" }: { position: [number, number, number], color?: string, hairColor?: string }) {
    const groupRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (groupRef.current) {
            (groupRef.current as THREE.Group).rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Head */}
            <Sphere args={[0.15]} position={[0, 0.4, 0]}>
                <meshStandardMaterial color="#d4a574" />
            </Sphere>
            
            {/* Hair */}
            <Sphere args={[0.16, 16, 8, 0, Math.PI]} position={[0, 0.48, 0]}>
                <meshStandardMaterial color={hairColor} />
            </Sphere>
            
            {/* Body */}
            <Box args={[0.4, 0.6, 0.2]} position={[0, 0, 0]}>
                <meshStandardMaterial color={color} />
            </Box>
            
            {/* Arms */}
            <Box args={[0.1, 0.4, 0.1]} position={[-0.25, 0.1, 0]} rotation={[0, 0, 0.3]}>
                <meshStandardMaterial color="#d4a574" />
            </Box>
            <Box args={[0.1, 0.4, 0.1]} position={[0.25, 0.1, 0]} rotation={[0, 0, -0.3]}>
                <meshStandardMaterial color="#d4a574" />
            </Box>
            
            {/* Legs */}
            <Box args={[0.12, 0.5, 0.12]} position={[-0.1, -0.55, 0]}>
                <meshStandardMaterial color={color} />
            </Box>
            <Box args={[0.12, 0.5, 0.12]} position={[0.1, -0.55, 0]}>
                <meshStandardMaterial color={color} />
            </Box>
        </group>
    );
}

// Particle Background
function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 100;
    
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
    }
    
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute args={[positions, 3]}
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#00d4aa" transparent opacity={0.6} />
        </points>
    );
}

// Main 3D Scene
function Scene3D() {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-5, 5, 5]} intensity={0.4} color="#00d4aa" />
            
            {/* Background particles */}
            <ParticleField />
            
            {/* Ground plane */}
            <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                <meshStandardMaterial color="#6b7280" transparent opacity={0.3} />
            </Plane>
            
            {/* 3D Characters */}
            <Person3D position={[-2, -0.2, 0]} color="#1f2937" hairColor="#2d1810" />
            <Person3D position={[2, -0.2, 0]} color="#374151" hairColor="#8b4513" />
            
            {/* Floating document */}
            <FloatingDocument />
        </>
    );
}

const FindFreelancer = ()=> {
    return (
        <>
            <section className="w-full h-[525.6px] bg-[#6B7280] relative overflow-hidden">
                <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
                    
                    {/* Left Side - 3D Scene */}
                    <div className="w-full md:w-1/2 h-full relative">
                        <Canvas
                            camera={{ position: [0, 2, 8], fov: 50 }}
                            className="w-full h-full"
                        >
                            <Scene3D />
                        </Canvas>
                    </div>

                    {/* Right Side - Text Content */}
                    <motion.div 
                        className="w-full md:w-1/2 h-full flex flex-col justify-center px-4 md:px-8 relative z-10"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <motion.h2 
                            className="text-white text-3xl md:text-4xl lg:text-5xl font-bold font-[poppins] mb-8 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Find your next hire for long term or short term goes, it all start with an{' '}
                            <span className="text-[#00D4AA]">agreement</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <motion.button
                                className="bg-white text-[#5B3AED] px-8 py-3 rounded-full font-[poppins] font-medium text-lg transition-all duration-300 shadow-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                whileHover={{ 
                                    scale: 1.05,
                                    backgroundColor: "#00D4AA",
                                    color: "#ffffff",
                                    boxShadow: "0 10px 15px -3px rgba(0, 212, 170, 0.3), 0 4px 6px -2px rgba(0, 212, 170, 0.1)"
                                }}
                                whileTap={{ 
                                    scale: 0.95,
                                    transition: { duration: 0.1 }
                                }}
                            >
                                Find a freelancer
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default FindFreelancer;