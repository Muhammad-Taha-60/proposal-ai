'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { supabase } from '@/lib/supabaseClient'; // Import supabase
import LandingNavBar from '@/components/LandingNavBar';
import * as THREE from 'three';

export default function LandingPage() {
  const heroAnimationRef = useRef<HTMLDivElement>(null);
  const staticAnimRef = useRef<HTMLDivElement>(null);
  const movingAnimRef = useRef<HTMLDivElement>(null);
  const examplesAnimRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Initialize useRouter

  // NEW: Effect to check authentication and redirect to dashboard if logged in
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is logged in, redirect to dashboard
        router.push('/dashboard');
      }
      // If no session, continue to render the landing page
    };

    checkUserSession();

    // Optionally, listen for auth state changes if you want real-time redirection
    // const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    //   if (session) {
    //     router.push('/dashboard');
    //   }
    // });
    // return () => {
    //   subscription.unsubscribe();
    // };
  }, [router]); // Dependency array includes router

  const exampleProposals = [
    {
      title: "Marketing Strategy for SaaS Startup",
      content: "This proposal outlines a comprehensive digital marketing strategy for a new SaaS startup. It includes SEO optimization, content marketing, social media engagement, and PPC campaigns aimed at acquiring early adopters and scaling user base. Key metrics and a phased implementation plan are detailed...",
      tone: "Formal"
    },
    {
      title: "Event Planning for Community Festival",
      content: "A friendly proposal for organizing a vibrant community festival. It covers venue selection, vendor coordination, entertainment booking, volunteer management, and a robust promotion strategy to ensure maximum local participation and a memorable experience for all attendees...",
      tone: "Friendly"
    },
    {
      title: "Technical Spec for AI-Powered Analytics",
      content: "Detailed technical proposal for developing an AI-powered data analytics module. Focuses on system architecture, machine learning model selection (e.g., deep learning for predictive analytics), data pipeline design, API integration, and performance benchmarks. Includes stack recommendations and security considerations...",
      tone: "Technical"
    }
  ];

  // --- Three.js Hero Section Animation (Abstract Blob/Shape Animation) ---
  useEffect(() => {
    const mount = heroAnimationRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5).normalize();
    scene.add(directionalLight);

    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);

    const colors = [
      new THREE.Color(0x8a2be2), new THREE.Color(0x4169e1),
      new THREE.Color(0x7b68ee), new THREE.Color(0xda70d6)
    ];

    const shapes: THREE.Mesh[] = [];
    const numShapes = 5;
    for (let i = 0; i < numShapes; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 5 + 3, 0);
      const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true, opacity: 0.6 + Math.random() * 0.2,
        roughness: 0.5, metalness: 0.3
      });
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set((Math.random() * 2 - 1) * 15, (Math.random() * 2 - 1) * 15, (Math.random() * 2 - 1) * 15);
      shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      shapeGroup.add(shape);
      shapes.push(shape);
    }

    camera.position.z = 25;

    let animationFrameId: number;
    const animate = (time: DOMHighResTimeStamp) => {
      animationFrameId = requestAnimationFrame(animate);
      shapes.forEach((shape, index) => {
        shape.position.x += Math.sin(time * 0.0001 + index) * 0.05;
        shape.position.y += Math.cos(time * 0.00015 + index) * 0.04;
        shape.position.z += Math.sin(time * 0.00012 + index) * 0.03;
        shape.rotation.x += 0.002;
        shape.rotation.y += 0.0015;
      });
      shapeGroup.rotation.y = Math.sin(time * 0.00005) * 0.2;
      shapeGroup.rotation.x = Math.cos(time * 0.00007) * 0.1;
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize);

    animate(0);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
      shapes.forEach(shape => {
        shape.geometry.dispose();
        (shape.material as THREE.Material).dispose();
      });
      ambientLight.dispose();
      directionalLight.dispose();
    };
  }, []);

  // --- Three.js Static Abstract Animation (How It Works - Left Edge) ---
  useEffect(() => {
    const mount = staticAnimRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 0);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const geometry = new THREE.IcosahedronGeometry(8, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const staticShape = new THREE.Mesh(geometry, material);
    scene.add(staticShape);

    camera.position.z = 20;

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      staticShape.rotation.x += 0.0005;
      staticShape.rotation.y += 0.0003;
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize);

    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
      material.dispose();
      geometry.dispose();
      light.dispose();
    };
  }, []);

  // --- Three.js Moving Abstract Animation (How It Works - Right Edge) ---
  useEffect(() => {
    const mount = movingAnimRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const shapes: THREE.Mesh[] = [];
    const numShapes = 3;
    const colors = [new THREE.Color(0xff69b4), new THREE.Color(0xdda0dd)];
    for (let i = 0; i < numShapes; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 16, 16);
      const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.5 + Math.random() * 0.3,
        roughness: 0.7,
        metalness: 0.2
      });
      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() * 2 - 1) * 5,
        (Math.random() * 2 - 1) * 5,
        (Math.random() * 2 - 1) * 5
      );
      shapes.push(shape);
      scene.add(shape);
    }

    camera.position.z = 10;

    let animationFrameId: number;
    const animate = (time: DOMHighResTimeStamp) => {
      animationFrameId = requestAnimationFrame(animate);

      shapes.forEach((shape, index) => {
        shape.position.x = Math.sin(time * 0.0005 + index) * 3;
        shape.position.y = Math.cos(time * 0.0007 + index) * 3;
        shape.position.z = Math.sin(time * 0.0004 + index) * 2;

        shape.rotation.x += 0.01;
        shape.rotation.y += 0.005;
      });
      
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize);

    animate(0);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
      shapes.forEach(shape => {
        shape.geometry.dispose();
        (shape.material as THREE.Material).dispose();
      });
      ambientLight.dispose();
    };
  }, []);

  // --- Three.js "See Our AI In Action" Section Animation (Scattered Cubes/Planes) ---
  useEffect(() => {
    const mount = examplesAnimRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 5).normalize();
    scene.add(directionalLight);

    const geometries = [
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.SphereGeometry(1.2, 8, 8),
      new THREE.CylinderGeometry(1, 1, 2, 8)
    ];
    const colors = [
      new THREE.Color(0xadd8e6), // Light Blue
      new THREE.Color(0x90ee90), // Light Green
      new THREE.Color(0xffb6c1)  // Light Pink
    ];

    const meshes: THREE.Mesh[] = [];
    const numMeshes = 15; // Number of floating elements
    for (let i = 0; i < numMeshes; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.2 + Math.random() * 0.2, // Very subtle opacity
        roughness: 0.7,
        metalness: 0.1
      });
      const mesh = new THREE.Mesh(geometry, material);

      // Position randomly across the section's space
      mesh.position.set(
        (Math.random() * 2 - 1) * 20,
        (Math.random() * 2 - 1) * 20,
        (Math.random() * 2 - 1) * 10
      );
      // Random initial rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      meshes.push(mesh);
      scene.add(mesh);
    }

    camera.position.z = 25; // Adjust camera to see shapes

    let animationFrameId: number;
    const animate = (time: DOMHighResTimeStamp) => {
      animationFrameId = requestAnimationFrame(animate);

      meshes.forEach((mesh, index) => {
        // Slow, consistent movement
        mesh.position.x += Math.sin(time * 0.0001 + index) * 0.02;
        mesh.position.y += Math.cos(time * 0.00015 + index) * 0.01;
        mesh.position.z += Math.sin(time * 0.00012 + index) * 0.015;

        // Continuous slow rotation
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.0008;
      });

      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onWindowResize);

    animate(0);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
      meshes.forEach(mesh => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      ambientLight.dispose();
      directionalLight.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <LandingNavBar />

      <main className="relative z-10 flex-grow pb-16">
        <section className="relative flex flex-col items-center justify-center py-20 px-4 mb-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden shadow-2xl min-h-[calc(100vh-64px)]">
          
          <div ref={heroAnimationRef} className="absolute inset-0 z-0">
            {/* The Three.js canvas will be appended here */}
          </div>
          <div className="absolute inset-0 z-10 bg-black opacity-10"></div> 
          
          <div className="relative z-20 max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Generate Winning Proposals with AI
            </h1>
            <p className="text-xl lg:text-2xl font-light opacity-90 mb-10 max-w-3xl mx-auto">
              Transform your ideas into polished, professional, and persuasive proposals in seconds.
            </p>
          </div>
        </section>

        <section className="relative px-8 mb-20">
          <div ref={staticAnimRef} className="absolute top-[-10%] bottom-[-10%] left-0 w-[30%] h-[120%] z-0 overflow-hidden"></div>
          <div ref={movingAnimRef} className="absolute top-[-10%] bottom-[-10%] right-0 w-[30%] h-[120%] z-0 overflow-hidden"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <h2 className="text-5xl font-bold text-gray-900 text-center mb-16">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-blue-600 text-6xl mb-6">✍️</div>
                <h3 className="text-3xl font-semibold mb-4 text-gray-800">1. Describe Your Needs</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Simply tell our AI about your project, client, and goals in natural language.</p>
              </div>
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-purple-600 text-6xl mb-6">✨</div>
                <h3 className="text-3xl font-semibold mb-4 text-gray-800">2. Choose Your Tone</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Select the perfect voice for your proposal: formal, friendly, technical, or persuasive.</p>
              </div>
              <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-200 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="text-green-600 text-6xl mb-6">🚀</div>
                <h3 className="text-3xl font-semibold mb-4 text-gray-800">3. Generate & Succeed</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Instantly get a polished, AI-crafted proposal, ready to impress and close deals.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative px-8 mb-20">
          <div ref={examplesAnimRef} className="absolute top-[-5%] inset-x-0 h-[110%] z-0 overflow-hidden"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-50 to-purple-100 opacity-20"></div>

          <div className="container mx-auto max-w-6xl relative z-20">
            <h2 className="text-5xl font-bold text-gray-900 text-center mb-16">
              See Our AI In Action
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {exampleProposals.map((example, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 flex flex-col transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{example.title}</h3>
                  <p className="text-base text-gray-600 mb-4">Tone: <span className="font-semibold text-blue-600">{example.tone}</span></p>
                  <p className="text-gray-700 text-md line-clamp-6 leading-relaxed flex-grow">
                    {example.content}
                  </p>
                  <a href="/signup" className="mt-6 text-blue-600 font-semibold hover:underline text-right flex items-center justify-end">
                    Try it yourself <span className="ml-2 text-xl">&rarr;</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="text-center py-20 px-8 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-inner">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-5xl font-bold mb-6 drop-shadow-md">Ready to Simplify Your Proposal Writing?</h2>
            <p className="text-2xl font-light mb-10">Join thousands of professionals saving time and winning more deals.</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white text-center p-6 text-sm">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} AI Proposal Generator. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
