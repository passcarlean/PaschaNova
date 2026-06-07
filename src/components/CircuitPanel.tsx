import React, { useState, useEffect, useRef } from 'react';
import { CircuitComponent, WireConnection } from '../types';
import { 
  Plus, RotateCw, Trash2, Zap, AlertTriangle, Play, HelpCircle, 
  Settings, ZoomIn, ZoomOut, Compass, Sparkles, Search, Mic, MicOff, Square, Volume2, Info
} from 'lucide-react';

interface CircuitPanelProps {
  components: CircuitComponent[];
  setComponents: React.Dispatch<React.SetStateAction<CircuitComponent[]>>;
  wires: WireConnection[];
  setWires: React.Dispatch<React.SetStateAction<WireConnection[]>>;
  isRunning: boolean;
  addConsoleLine: (line: string) => void;
}

export default function CircuitPanel({
  components,
  setComponents,
  wires,
  setWires,
  isRunning,
  addConsoleLine,
}: CircuitPanelProps) {
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [wireStart, setWireStart] = useState<{ componentId: string; pinName: string } | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [selectedWireColor, setSelectedWireColor] = useState<string>('#3B82F6'); // Default Blue
  const [activeSnap, setActiveSnap] = useState<{
    breadboardId: string;
    breadboardPin: string;
    draggedId: string;
    draggedPin: string;
  } | null>(null);
  const [hoveredPartPreview, setHoveredPartPreview] = useState<{
    type: string;
    name: string;
    x: number;
    y: number;
  } | null>(null);

  // Search and Voice states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [voiceNotes, setVoiceNotes] = useState<{ id: string; url: string; name: string; date: string }[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [showVoicePanel, setShowVoicePanel] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string>('');
  const [isSpeackingSearch, setIsSpeackingSearch] = useState<boolean>(false);

  // Sensor scale values
  const [sensorValues, setSensorValues] = useState<{ [id: string]: number }>({});

  const availableParts = [
    { 
      type: 'arduino_uno', 
      name: 'Arduino Uno R3', 
      color: 'border-teal-500 bg-teal-50 dark:bg-teal-900/10',
      category: 'Controller',
      image: 'https://images.unsplash.com/photo-1608564697071-409da4114d65?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'High-performance ATmega328P microcontroller board. Built-in USB support, 14 digital pins (6 PWM outputs), and 6 analog input pins.',
      pinDetails: '5V (Power Output), 3V3 (3.3V Power), GND (Ground), D2-D13 (Digital Control), A0-A1 (Analog Inputs)',
      status: 'Available' as const
    },
    { 
      type: 'esp32', 
      name: 'ESP32 IoT Node', 
      color: 'border-red-500 bg-red-50 dark:bg-red-900/10',
      category: 'Controller',
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Dual-core MCU chip with integrated Wi-Fi & dual-mode Bluetooth connectivity. Perfect for remote cloud telemetry & low-power IoT circuits.',
      pinDetails: '3V3 (VCC Supply), GND (Ground), GPIO12 (Digital Pin), A1 (Analog Sensing Input)',
      status: 'Available' as const
    },
    { 
      type: 'breadboard', 
      name: 'Mini Breadboard', 
      color: 'border-gray-300 bg-gray-50 dark:bg-gray-800/20',
      category: 'Prototyping',
      image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Solderless prototyping grid with 5 interconnected pin blocks. Includes central rails for jumper connectors and clean terminal routing.',
      pinDetails: 'Interconnected rows a-e per column (1-12) for custom circuit junction connections without solder.',
      status: 'Available' as const
    },
    { 
      type: 'led', 
      name: 'LED Indicator', 
      color: 'border-rose-400 bg-rose-50 dark:bg-rose-900/10',
      category: 'Output',
      image: 'https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Standard 5mm Light Emitting Diode. Produces instant photon feedback. MUST be wired with a limiting resistor to avoid combustion!',
      pinDetails: 'Anode (Positive leg, connect to digital/power pin), Cathode (Negative leg, connect to Ground)',
      status: 'Available' as const
    },
    { 
      type: 'resistor', 
      name: 'Resistor 220Ω', 
      color: 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10',
      category: 'Utility',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Carbon film resistor limiting current flow. Essential for safe indicator led circuits and active pulls, protecting boards from shorting.',
      pinDetails: 'Pin A & Pin B (Bi-directional passive resistive lead legs resisting up to 220 Ohms)',
      status: 'Available' as const
    },
    { 
      type: 'buzzer', 
      name: 'Active Siren Buzzer', 
      color: 'border-purple-400 bg-purple-50 dark:bg-purple-900/10',
      category: 'Output',
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Piezoelectric audio transducer. Emits a high pitch pulse signal when triggered. Excellent for alarms, bells, and feedback sirens.',
      pinDetails: 'Pos (Positive Terminal leg), Neg (Ground terminal pin)',
      status: 'Available' as const
    },
    { 
      type: 'ultrasonic', 
      name: 'Ultrasonic Distance Sensor', 
      color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10',
      category: 'Sensor',
      image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'HC-SR04 sonar proximity detector. Emits 40kHz sonic waves and measures echo return time flight to calculate millimeter-level target distance.',
      pinDetails: 'Trig (Trigger input pin), Echo (Echo return time measurement output), GND (Ground reference)',
      status: 'Available' as const
    },
    { 
      type: 'servo', 
      name: 'Robotic Servo Joint', 
      color: 'border-orange-500 bg-orange-50 dark:bg-orange-900/10',
      category: 'Actuator',
      image: 'https://images.unsplash.com/photo-1581091215367-9b6c00b3035a?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Precision direct-current servomotor with positional gear teeth. Rotates dynamically between 0° and 180° using pulse-width modulation signals.',
      pinDetails: 'Signal (PWM frequency modulation), Power (VCC power line input), Ground (Negative Ground reference)',
      status: 'Available' as const
    },
    { 
      type: 'relay', 
      name: '5V Smart Relay', 
      color: 'border-blue-400 bg-blue-50 dark:bg-blue-900/10',
      category: 'Actuator',
      image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Electromagnetic digital switch interface. High voltage isolation relay board, allowing microcontrollers to isolate high current appliances.',
      pinDetails: 'IN (Digital relay active control signal trigger), VCC (Positive power supply rail), GND (System Ground)',
      status: 'Out of Stock' as const
    },
    { 
      type: 'lcd', 
      name: 'LCD Display 16x2', 
      color: 'border-pink-500 bg-pink-50',
      category: 'Output',
      image: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Alphanumeric display screen. Supports showing two rows of 16 text characters using integrated liquid crystal arrays. Great for reading states.',
      pinDetails: 'VSS (Ground), VDD (Power 5V), RS (Reg Select), E (Enable Clock input), D4 (Data transmission bus byte)',
      status: 'Available' as const
    },
    { 
      type: 'ldr', 
      name: 'LDR Photoresistor', 
      color: 'border-amber-500 bg-amber-50',
      category: 'Sensor',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=150&q=80',
      summary: 'Light-Dependent Resistor. Photo-conductive semiconductor whose internal resistance decreases dramatically under brighter light.',
      pinDetails: 'Pin1 & Pin2 (Bi-directional analog resistive lead outputs connected to voltage dividers)',
      status: 'Available' as const
    }
  ];

  // Recording timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Voice Speech search recognition handler
  const triggerVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Try Chrome!');
      return;
    }

    try {
      setIsSpeackingSearch(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        addConsoleLine('[Voice] Listening for a component keyword (e.g., "Led", "Arduino", "Servo")...');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        addConsoleLine(`[Voice] Search matched voice keyword: "${transcript}"`);
        setSearchQuery(transcript);
        setIsSpeackingSearch(false);
      };

      recognition.onerror = (err: any) => {
        console.error('Recognition error', err instanceof Error ? err.message : String(err));
        setIsSpeackingSearch(false);
      };

      recognition.onend = () => {
        setIsSpeackingSearch(false);
      };

      recognition.start();
    } catch (e) {
      setIsSpeackingSearch(false);
    }
  };

  // HTML5 MediaRecorder voice notes generator
  const startVoiceRecording = async () => {
    setSpeechError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const newNote = {
          id: `voice_${Date.now()}`,
          url,
          name: `Memo Rec #${voiceNotes.length + 1}`,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setVoiceNotes(prev => [newNote, ...prev]);
        addConsoleLine(`[Voice Notes] Successfully captured sandbox memo: "${newNote.name}"`);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (err: any) {
      console.error('Microphone permission issues', err instanceof Error ? err.message : String(err));
      setSpeechError('Microphone block. Please allow mic stream access.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const deleteVoiceNote = (id: string) => {
    setVoiceNotes(prev => prev.filter(n => n.id !== id));
  };

  const filteredParts = availableParts.filter(part => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      part.name.toLowerCase().includes(query) ||
      part.category.toLowerCase().includes(query) ||
      part.summary.toLowerCase().includes(query)
    );
  });

  const wireColors = [
    { name: 'Red (Power)', hex: '#EF4444' },
    { name: 'Black (Ground)', hex: '#111827' },
    { name: 'Blue (Signal)', hex: '#3B82F6' },
    { name: 'Green (Digital)', hex: '#10B981' },
    { name: 'Yellow (Analog)', hex: '#F59E0B' },
    { name: 'Orange (Servo)', hex: '#F97316' }
  ];

  // Spawn component onto SVG board (fallback/random spawn)
  const spawnComponent = (type: string, name: string) => {
    let pins: { [key: string]: { x: number; y: number } } = {};

    // Standard high fidelity coordinate configurations for wire nodes
    if (type === 'arduino_uno') {
      pins = {
        '5V': { x: 95, y: 150 },
        '3V3': { x: 80, y: 150 },
        'GND': { x: 110, y: 150 },
        'D13': { x: 140, y: 35 },
        'D12': { x: 130, y: 35 },
        'D11': { x: 120, y: 35 },
        'D10': { x: 110, y: 35 },
        'D8': { x: 90, y: 35 },
        'D3': { x: 60, y: 35 },
        'D2': { x: 50, y: 35 },
        'A0': { x: 140, y: 150 },
        'A1': { x: 150, y: 150 }
      };
    } else if (type === 'esp32') {
      pins = {
        '3V3': { x: 95, y: 130 },
        'GND': { x: 80, y: 130 },
        'GPIO12': { x: 110, y: 40 },
        'A1': { x: 130, y: 40 }
      };
    } else if (type === 'led') {
      pins = { 'Anode': { x: 20, y: 60 }, 'Cathode': { x: 40, y: 60 } };
    } else if (type === 'resistor') {
      pins = { 'Pin A': { x: 15, y: 35 }, 'Pin B': { x: 75, y: 35 } };
    } else if (type === 'buzzer') {
      pins = { 'Pos': { x: 25, y: 50 }, 'Neg': { x: 45, y: 50 } };
    } else if (type === 'ultrasonic') {
      pins = { 'Trig': { x: 20, y: 65 }, 'Echo': { x: 35, y: 65 }, 'GND': { x: 50, y: 65 } };
    } else if (type === 'servo') {
      pins = { 'Signal': { x: 20, y: 70 }, 'Power': { x: 35, y: 70 }, 'Ground': { x: 50, y: 70 } };
    } else if (type === 'relay') {
      pins = { 'IN': { x: 15, y: 60 }, 'VCC': { x: 35, y: 60 }, 'GND': { x: 55, y: 60 } };
    } else if (type === 'lcd') {
      pins = { 'VSS': { x: 15, y: 80 }, 'VDD': { x: 30, y: 80 }, 'RS': { x: 45, y: 80 }, 'E': { x: 60, y: 80 }, 'D4': { x: 75, y: 80 } };
    } else if (type === 'ldr') {
      pins = { 'Pin1': { x: 15, y: 40 }, 'Pin2': { x: 35, y: 40 } };
    } else if (type === 'breadboard') {
      const rows = ['a', 'b', 'c', 'd', 'e'];
      for (let rIndex = 0; rIndex < rows.length; rIndex++) {
        const rName = rows[rIndex];
        for (let col = 1; col <= 12; col++) {
          const pinName = `${rName}${col}`;
          pins[pinName] = {
            x: Math.round(37 + (col - 1) * 18.5),
            y: Math.round(32 + rIndex * 14)
          };
        }
      }
    } else {
      pins = { 'Pin A': { x: 15, y: 35 }, 'Pin B': { x: 45, y: 35 } };
    }

    const newComp: CircuitComponent = {
      id: `${type}_${Date.now()}`,
      type,
      name,
      x: 150 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      rotation: 0,
      pins,
      value: type === 'led' ? 'Red' : type === 'resistor' ? '220Ω' : undefined
    };

    setComponents(prev => [...prev, newComp]);
    const partDef = availableParts.find(p => p.type === type);
    if (partDef && partDef.status === 'Out of Stock') {
      addConsoleLine(`[Circuit] Warning: Prototype includes Out of Stock part (${name}).`);
    } else {
      addConsoleLine(`[Circuit] Spawned electronic part at random position: ${name}`);
    }
  };

  // Get optimal preview coordinate for ghosting component snapping
  const getOptimalPreviewCoords = (type: string): { x: number; y: number } | null => {
    let breadboard = components.find(c => c.type === 'breadboard');
    let updatedComponents = [...components];

    // If no breadboard exists yet, and target part requires a breadboard,
    // we simulate the breadboard which may be auto-spawned at x: 100, y: 150
    const needsAutoBreadboard = !breadboard && ['led', 'resistor', 'buzzer', 'ldr'].includes(type);
    
    let tempBreadboard: any = null;
    if (needsAutoBreadboard) {
      tempBreadboard = {
        id: 'preview_bb',
        type: 'breadboard',
        name: 'Mini Breadboard',
        x: 100,
        y: 150,
        rotation: 0,
        pins: {}
      };
      breadboard = tempBreadboard;
      updatedComponents.push(tempBreadboard);
    }

    let targetX = 140;
    let targetY = 110;

    if (breadboard) {
      if (['led', 'resistor', 'buzzer', 'ldr'].includes(type)) {
        const placedOnBreadboard = updatedComponents.filter(c => 
          c.id !== breadboard?.id && 
          ['led', 'resistor', 'buzzer', 'ldr'].includes(c.type)
        );
        const count = placedOnBreadboard.length;
        // Evenly spacing columns to prevent collision (Col 2, 4, 6, 8, 10)
        const col = 2 + (count % 5) * 2;
        const rowIdx = 4; // Row 'e'

        const pinX = 37 + (col - 1) * 18.5;
        const pinY = 32 + rowIdx * 14;

        let relativeFirstPinX = 15;
        let relativeFirstPinY = 35;

        if (type === 'led') {
          relativeFirstPinX = 20;
          relativeFirstPinY = 60;
        } else if (type === 'resistor') {
          relativeFirstPinX = 15;
          relativeFirstPinY = 35;
        } else if (type === 'ldr') {
          relativeFirstPinX = 15;
          relativeFirstPinY = 40;
        } else if (type === 'buzzer') {
          relativeFirstPinX = 25;
          relativeFirstPinY = 50;
        }

        targetX = Math.round(breadboard.x + pinX - relativeFirstPinX);
        targetY = Math.round(breadboard.y + pinY - relativeFirstPinY);
      } else if (['arduino_uno', 'esp32'].includes(type)) {
        const index = updatedComponents.filter(c => ['arduino_uno', 'esp32'].includes(c.type)).length;
        targetX = Math.round(breadboard.x - 200 + index * 40);
        targetY = Math.round(breadboard.y - 140);
      } else if (['servo', 'ultrasonic', 'relay', 'lcd'].includes(type)) {
        const index = updatedComponents.filter(c => ['servo', 'ultrasonic', 'relay', 'lcd'].includes(c.type)).length;
        targetX = Math.round(breadboard.x + 320);
        targetY = Math.round(breadboard.y + index * 80 - 10);
      } else if (type === 'breadboard') {
        const index = updatedComponents.filter(c => c.type === 'breadboard').length;
        targetX = 120;
        targetY = 150 + index * 120;
      }
    }

    return { x: targetX, y: targetY };
  };

  // Spawn component using Tinkercad-style optimal placement (snapping onto breadboard index)
  const spawnComponentOptimal = (type: string, name: string) => {
    let breadboard = components.find(c => c.type === 'breadboard');
    let updatedComponents = [...components];

    // Auto-spawn breadboard first if we are adding small, breadboard-dependent parts
    if (!breadboard && ['led', 'resistor', 'buzzer', 'ldr'].includes(type)) {
      const breadboardId = `breadboard_${Date.now()}`;
      let bbPins: { [key: string]: { x: number; y: number } } = {};
      const rows = ['a', 'b', 'c', 'd', 'e'];
      for (let rIndex = 0; rIndex < rows.length; rIndex++) {
        const rName = rows[rIndex];
        for (let col = 1; col <= 12; col++) {
          const pinName = `${rName}${col}`;
          bbPins[pinName] = {
            x: Math.round(37 + (col - 1) * 18.5),
            y: Math.round(32 + rIndex * 14)
          };
        }
      }

      breadboard = {
        id: breadboardId,
        type: 'breadboard',
        name: 'Mini Breadboard',
        x: 100,
        y: 150,
        rotation: 0,
        pins: bbPins
      };
      updatedComponents.push(breadboard);
      addConsoleLine(`[Circuit] Tinkercad Engine: Auto-loaded Mini Breadboard for snapping.`);
    }

    let pins: { [key: string]: { x: number; y: number } } = {};
    if (type === 'arduino_uno') {
      pins = {
        '5V': { x: 95, y: 150 },
        '3V3': { x: 80, y: 150 },
        'GND': { x: 110, y: 150 },
        'D13': { x: 140, y: 35 },
        'D12': { x: 130, y: 35 },
        'D11': { x: 120, y: 35 },
        'D10': { x: 110, y: 35 },
        'D8': { x: 90, y: 35 },
        'D3': { x: 60, y: 35 },
        'D2': { x: 50, y: 35 },
        'A0': { x: 140, y: 150 },
        'A1': { x: 150, y: 150 }
      };
    } else if (type === 'esp32') {
      pins = {
        '3V3': { x: 95, y: 130 },
        'GND': { x: 80, y: 130 },
        'GPIO12': { x: 110, y: 40 },
        'A1': { x: 130, y: 40 }
      };
    } else if (type === 'led') {
      pins = { 'Anode': { x: 20, y: 60 }, 'Cathode': { x: 40, y: 60 } };
    } else if (type === 'resistor') {
      pins = { 'Pin A': { x: 15, y: 35 }, 'Pin B': { x: 75, y: 35 } };
    } else if (type === 'buzzer') {
      pins = { 'Pos': { x: 25, y: 50 }, 'Neg': { x: 45, y: 50 } };
    } else if (type === 'ultrasonic') {
      pins = { 'Trig': { x: 20, y: 65 }, 'Echo': { x: 35, y: 65 }, 'GND': { x: 50, y: 65 } };
    } else if (type === 'servo') {
      pins = { 'Signal': { x: 20, y: 70 }, 'Power': { x: 35, y: 70 }, 'Ground': { x: 50, y: 70 } };
    } else if (type === 'relay') {
      pins = { 'IN': { x: 15, y: 60 }, 'VCC': { x: 35, y: 60 }, 'GND': { x: 55, y: 60 } };
    } else if (type === 'lcd') {
      pins = { 'VSS': { x: 15, y: 80 }, 'VDD': { x: 30, y: 80 }, 'RS': { x: 45, y: 80 }, 'E': { x: 60, y: 80 }, 'D4': { x: 75, y: 80 } };
    } else if (type === 'ldr') {
      pins = { 'Pin1': { x: 15, y: 40 }, 'Pin2': { x: 35, y: 40 } };
    } else if (type === 'breadboard') {
      const rows = ['a', 'b', 'c', 'd', 'e'];
      for (let rIndex = 0; rIndex < rows.length; rIndex++) {
        const rName = rows[rIndex];
        for (let col = 1; col <= 12; col++) {
          const pinName = `${rName}${col}`;
          pins[pinName] = {
            x: Math.round(37 + (col - 1) * 18.5),
            y: Math.round(32 + rIndex * 14)
          };
        }
      }
    } else {
      pins = { 'Pin A': { x: 15, y: 35 }, 'Pin B': { x: 45, y: 35 } };
    }

    let targetX = 140 + Math.random() * 60;
    let targetY = 110 + Math.random() * 60;

    if (breadboard) {
      if (['led', 'resistor', 'buzzer', 'ldr'].includes(type)) {
        const placedOnBreadboard = updatedComponents.filter(c => 
          c.id !== breadboard?.id && 
          ['led', 'resistor', 'buzzer', 'ldr'].includes(c.type)
        );
        const count = placedOnBreadboard.length;
        // Evenly spacing columns to prevent collision (Col 2, 4, 6, 8, 10)
        const col = 2 + (count % 5) * 2;
        const rowIdx = 4; // Row 'e'

        const pinX = 37 + (col - 1) * 18.5;
        const pinY = 32 + rowIdx * 14;

        let relativeFirstPinX = 15;
        let relativeFirstPinY = 35;

        if (type === 'led') {
          relativeFirstPinX = 20;
          relativeFirstPinY = 60;
        } else if (type === 'resistor') {
          relativeFirstPinX = 15;
          relativeFirstPinY = 35;
        } else if (type === 'ldr') {
          relativeFirstPinX = 15;
          relativeFirstPinY = 40;
        } else if (type === 'buzzer') {
          relativeFirstPinX = 25;
          relativeFirstPinY = 50;
        }

        targetX = Math.round(breadboard.x + pinX - relativeFirstPinX);
        targetY = Math.round(breadboard.y + pinY - relativeFirstPinY);
        addConsoleLine(`[Circuit] Tinkercad snapp: aligned (${name}) onto Breadboard row e, col ${col}`);
      } else if (['arduino_uno', 'esp32'].includes(type)) {
        const index = updatedComponents.filter(c => ['arduino_uno', 'esp32'].includes(c.type)).length;
        targetX = Math.round(breadboard.x - 200 + index * 40);
        targetY = Math.round(breadboard.y - 140);
        addConsoleLine(`[Circuit] Aligned Controller board (${name}) neat representation adjacent to Breadboard.`);
      } else if (['servo', 'ultrasonic', 'relay', 'lcd'].includes(type)) {
        const index = updatedComponents.filter(c => ['servo', 'ultrasonic', 'relay', 'lcd'].includes(c.type)).length;
        targetX = Math.round(breadboard.x + 320);
        targetY = Math.round(breadboard.y + index * 80 - 10);
        addConsoleLine(`[Circuit] Aligned accessory (${name}) near Breadboard layout.`);
      } else if (type === 'breadboard') {
        const index = updatedComponents.filter(c => c.type === 'breadboard').length;
        targetX = 120;
        targetY = 150 + index * 120;
      }
    } else {
      if (['arduino_uno', 'esp32'].includes(type)) {
        targetX = 80;
        targetY = 120;
      } else if (type === 'breadboard') {
        targetX = 100;
        targetY = 220;
      }
    }

    const targetId = `${type}_${Date.now()}`;
    const startX = Math.max(10, targetX - 220);
    const startY = Math.max(10, targetY - 40);

    const newComp: CircuitComponent = {
      id: targetId,
      type,
      name,
      x: startX,
      y: startY,
      rotation: 0,
      pins,
      value: type === 'led' ? 'Red' : type === 'resistor' ? '220Ω' : undefined
    };

    setComponents([...updatedComponents, newComp]);
    addConsoleLine(`[Circuit] Tinkercad Quick-Added electronic part: ${name}`);

    // Slide and glide animation into snapped coordinate
    const duration = 450; // ms
    const startTime = performance.now();
    
    const easeOutBack = (t: number) => {
      const c1 = 1.4;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const animateGlide = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutBack(progress);

      const currentX = Math.round(startX + (targetX - startX) * eased);
      const currentY = Math.round(startY + (targetY - startY) * eased);

      setComponents(prev => prev.map(c => {
        if (c.id === targetId) {
          return { ...c, x: currentX, y: currentY };
        }
        return c;
      }));

      if (progress < 1) {
        requestAnimationFrame(animateGlide);
      }
    };

    requestAnimationFrame(animateGlide);
  };

  // Drag element logic
  const handleDrag = (id: string, dx: number, dy: number) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          x: Math.max(0, c.x + dx),
          y: Math.max(0, c.y + dy)
        };
      }
      return c;
    }));
  };

  // Rotate part 90 degrees
  const rotateComponent = (id: string) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          rotation: (c.rotation + 90) % 360
        };
      }
      return c;
    }));
    addConsoleLine('[Circuit] Rotated component 90°');
  };

  // Delete part and remove associated wire jump connectors
  const deleteComponent = (id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    setWires(prev => prev.filter(w => w.fromComponentId !== id && w.toComponentId !== id));
    if (selectedCompId === id) setSelectedCompId(null);
    addConsoleLine('[Circuit] Deleted electronic part.');
  };

  // Jumper wires maker logic
  const handlePinClick = (componentId: string, pinName: string) => {
    if (!wireStart) {
      setWireStart({ componentId, pinName });
      addConsoleLine(`[Circuit] Wire starting from ${componentId} pin [${pinName}]. Click target pin to connect!`);
    } else {
      // Create new wire connection hook
      if (wireStart.componentId === componentId) {
        // Reset if clicking the same device
        setWireStart(null);
        return;
      }

      const newWire: WireConnection = {
        id: `wire_${Date.now()}`,
        fromComponentId: wireStart.componentId,
        fromPin: wireStart.pinName,
        toComponentId: componentId,
        toPin: pinName,
        color: selectedWireColor
      };

      setWires(prev => [...prev, newWire]);
      addConsoleLine(`[Circuit] Connected jumper wire: [${wireStart.fromPin}] ➔ [${pinName}]`);
      setWireStart(null);
    }
  };

  // Clear wire layout
  const clearWires = () => {
    setWires([]);
    addConsoleLine('[Circuit] Wire jumpers deleted.');
  };

  // Wiring Fault Checkers (Simulated for feedback error boxes)
  const isLeddiredDirectly = () => {
    // Check if an LED is connected directly from Uno 5V or ESP 3V3 pin to LED anode/cathode with NO resistor
    const directToPower = wires.some(w => 
      (w.fromComponentId.includes('arduino_uno') && w.fromPin === '5V' && w.toComponentId.includes('led')) ||
      (w.fromComponentId.includes('esp32') && w.fromPin === '3V3' && w.toComponentId.includes('led'))
    );
    const hasResistor = components.some(c => c.type === 'resistor');
    return directToPower && !hasResistor;
  };

  const hasShortCircuit = () => {
    // 5V connected straight to GND
    return wires.some(w => 
      (w.fromPin === '5V' && w.toPin === 'GND') ||
      (w.fromPin === '3V3' && w.toPin === 'GND')
    );
  };

  // Calculate coordinates dynamic curve calculations
  const getPinGlobalCoordinates = (c: CircuitComponent, pinName: string) => {
    const pinOffset = c.pins[pinName] || { x: 0, y: 0 };
    // Handle approximate pivot centers depending on orientation rotation degrees
    const r = (c.rotation * Math.PI) / 180;
    const cos = Math.cos(r);
    const sin = Math.sin(r);

    // Approximate size pivots for alignment
    const width = c.type === 'arduino_uno' ? 200 : c.type === 'esp32' ? 160 : c.type === 'breadboard' ? 300 : 80;
    const height = c.type === 'arduino_uno' ? 140 : c.type === 'esp32' ? 120 : c.type === 'breadboard' ? 100 : 60;

    const cx = width / 2;
    const cy = height / 2;

    const relativeX = pinOffset.x - cx;
    const relativeY = pinOffset.y - cy;

    const rotatedX = relativeX * cos - relativeY * sin;
    const rotatedY = relativeX * sin + relativeY * cos;

    return {
      x: Math.round(c.x + cx + rotatedX),
      y: Math.round(c.y + cy + rotatedY)
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-140px)] select-none">
      
      {/* SIDEBAR: PARTS DRAWER selection drawer */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden shadow-xs">
        
        {/* Parts Drawer Header & Voice Lab toggle */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-850">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" /> Parts Drawer
            </h3>
            <button
              onClick={() => setShowVoicePanel(!showVoicePanel)}
              className={`text-[10px] font-extrabold px-2 py-1 rounded-lg flex items-center gap-1 transition-all shrink-0 ${
                showVoicePanel 
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/45 dark:text-rose-400' 
                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/45 dark:text-indigo-400 hover:bg-indigo-100'
              }`}
            >
              <Mic className="w-3 h-3" />
              <span>Voice Memo {voiceNotes.length > 0 ? `(${voiceNotes.length})` : ''}</span>
            </button>
          </div>

          {/* Search bar & Speech keyword matcher */}
          <div className="relative flex items-center gap-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-450 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold pl-8 pr-7 py-1.5 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-150 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={triggerVoiceSearch}
              title="Speak component keyword to filter"
              className={`p-1.5 rounded-xl border transition-all shrink-0 ${
                isSpeackingSearch
                  ? 'bg-rose-500 border-rose-450 text-white animate-pulse'
                  : 'bg-gray-50 hover:bg-emerald-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-emerald-500 hover:border-emerald-300'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Voice recorder laboratory panel */}
        {showVoicePanel && (
          <div className="p-3 bg-indigo-50/45 dark:bg-indigo-950/15 border-b border-indigo-100/30 dark:border-indigo-900/40 space-y-2 animate-fade-in shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-750 dark:text-indigo-300">
                Voice Notes Lab
              </span>
              {isRecording && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  Recording: {recordingDuration}s
                </span>
              )}
            </div>

            {speechError && (
              <p className="text-[9px] font-semibold text-rose-500">{speechError}</p>
            )}

            <div className="flex gap-2">
              {!isRecording ? (
                <button
                  onClick={startVoiceRecording}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <Mic className="w-3.5 h-3.5" /> Record Memo
                </button>
              ) : (
                <button
                  onClick={stopVoiceRecording}
                  className="flex-1 bg-gray-800 hover:bg-gray-950 text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs animate-pulse transition-all"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Stop & Save
                </button>
              )}
            </div>

            {voiceNotes.length > 0 && (
              <div className="max-h-24 overflow-y-auto space-y-1 pt-1 border-t border-indigo-100/10 dark:border-indigo-900/30">
                {voiceNotes.map(note => (
                  <div key={note.id} className="bg-white/95 dark:bg-gray-950/90 p-1.5 rounded-lg border border-indigo-100/10 flex flex-col gap-1 text-[10px]">
                    <div className="flex items-center justify-between font-extrabold text-gray-750 dark:text-gray-300">
                      <span className="truncate max-w-[110px]">{note.name}</span>
                      <span className="text-[8px] opacity-75">{note.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <audio src={note.url} controls className="h-5 w-full text-xs scale-90 -ml-2" />
                      <button
                        onClick={() => deleteVoiceNote(note.id)}
                        className="text-gray-400 hover:text-red-500 p-0.5 shrink-0 focus:outline-none"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wire Color Chooser */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 space-y-1">
          <label className="text-[9px] font-black uppercase text-gray-400 tracking-wider">
            Active Jumper Wire Hue
          </label>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {wireColors.map(col => (
              <button
                key={col.hex}
                onClick={() => setSelectedWireColor(col.hex)}
                className={`w-5 h-5 rounded-full shrink-0 border transition-all ${
                  selectedWireColor === col.hex ? 'ring-2 ring-emerald-400 scale-105' : 'border-gray-300'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>
        </div>

        {/* Parts Drawer scrolling area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredParts.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 space-y-1">
              <Sparkles className="w-5 h-5 mx-auto opacity-40 animate-pulse text-indigo-400" />
              <p className="text-[10px] font-black uppercase tracking-wider">No matching components</p>
              <p className="text-[9px] font-semibold">Try voice terms or another query!</p>
            </div>
          ) : (
            filteredParts.map(part => (
              <div key={part.type} className="relative group/part animate-fade-in">
                <div
                  className={`w-full flex items-center justify-between gap-3 border border-gray-150/85 dark:border-gray-700/60 hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-[1.01] hover:shadow-xs p-2 rounded-xl text-left text-xs text-gray-750 dark:text-gray-250 transition-all bg-white dark:bg-gray-800 ${part.color}`}
                >
                  {/* Clickable Area for standard spawning */}
                  <div 
                    onClick={() => spawnComponent(part.type, part.name)}
                    className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                    title="Click here to add at default position"
                  >
                    <div className="relative shrink-0 w-10 h-10 group/img">
                      <img
                        src={part.image}
                        alt={part.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-lg border border-gray-200/50 dark:border-gray-700/70 bg-white shadow-inner cursor-pointer"
                        onMouseEnter={() => {
                          const coords = getOptimalPreviewCoords(part.type);
                          if (coords) {
                            setHoveredPartPreview({
                              type: part.type,
                              name: part.name,
                              x: coords.x,
                              y: coords.y
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredPartPreview(null)}
                      />
                      {/* Status indicator glow dot */}
                      <span 
                        className={`absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full border border-white dark:border-gray-800 shadow-sm ${
                          part.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} 
                        title={part.status === 'Available' ? 'Available' : 'Out of Stock'}
                      >
                        {part.status === 'Available' && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                        )}
                      </span>
                      {/* Absolute status banner at the bottom of the picture */}
                      <span className={`absolute bottom-0 left-0 right-0 text-[5px] font-black uppercase tracking-wider text-center py-[1px] rounded-b-lg text-white font-mono select-none ${
                        part.status === 'Available' ? 'bg-emerald-500/90' : 'bg-rose-500/90'
                      }`}>
                        {part.status === 'Available' ? 'STOCK' : 'OOS'}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="truncate block pr-1 text-[11px] font-black text-gray-800 dark:text-gray-100 group-hover/part:text-emerald-500 transition-colors">
                        {part.name}
                      </span>
                      <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block mt-0.5">
                        {part.category}
                      </span>
                    </div>
                  </div>

                  {/* Tinkercad Quick Add Action */}
                  <div className="shrink-0 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (part.status === 'Out of Stock') {
                          addConsoleLine(`[Circuit] Alert: Standard placement bypass used for Out of Stock component (${part.name}).`);
                        }
                        spawnComponentOptimal(part.type, part.name);
                      }}
                      className="text-[9px] font-black text-white bg-indigo-600 hover:bg-emerald-500 active:scale-95 px-2 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-xs cursor-pointer border-none outline-none dark:bg-indigo-500 hover:shadow-md"
                      title="Quick Add: Snap and align directly onto breadboard row/column slots like Tinkercad"
                    >
                      <Zap className="w-2.5 h-2.5 fill-current text-amber-300 animate-pulse" />
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>

                {/* HOVER SPEC TOOLTIP CARD OVERLAY */}
                <div className="hidden group-hover/part:block absolute left-[98%] top-[-10px] ml-4 w-72 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-2xl p-4 shadow-2xl z-50 pointer-events-none animate-fade-in text-gray-800 dark:text-gray-100">
                  <div className="flex items-center gap-2.5 mb-2.5 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <img
                      src={part.image}
                      alt={part.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-white"
                    />
                    <div>
                      <h4 className="text-xs font-black text-gray-950 dark:text-white leading-tight">
                        {part.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-block text-[8px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded leading-none">
                          {part.category}
                        </span>
                        <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded leading-none ${
                          part.status === 'Available'
                            ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40'
                            : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40'
                        }`}>
                          {part.status === 'Available' ? 'Available' : 'Out Of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-300 leading-normal mb-3">
                    {part.summary}
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-950/95 p-2.5 rounded-xl border border-gray-100 dark:border-gray-850">
                    <div className="flex items-center gap-1 mb-1">
                      <Info className="w-3 h-3 text-indigo-400" />
                      <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                        Pinout Specification
                      </span>
                    </div>
                    <span className="text-[9.5px] font-mono font-medium text-gray-650 dark:text-gray-400 leading-normal block">
                      {part.pinDetails}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CENTER: SVG CIRCUIT DRAWING GRID */}
      <div className="lg:col-span-9 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200/60 dark:border-gray-800 flex flex-col h-full overflow-hidden relative">
        
        {/* Workspace Canvas Header options */}
        <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              <span className="text-xs font-black dark:text-white uppercase tracking-wider">
                Virtual Breadboard
              </span>
            </div>
            {wireStart && (
              <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-md animate-pulse">
                ★ Select target pin to lock wire ★
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.4))}
              title="Zoom In"
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.7))}
              title="Zoom Out"
              className="p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-gray-800 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button
              onClick={clearWires}
              className="text-xs font-extrabold text-gray-500 hover:text-orange-500 transition-colors"
            >
              Reset Wires
            </button>
            <button
              onClick={() => { setComponents([]); setWires([]);setSelectedCompId(null); }}
              className="text-xs font-extrabold text-rose-500 hover:underline"
            >
              Clear Canvas
            </button>
          </div>
        </div>

        {/* Warning Board Banners */}
        {isRunning && isLeddiredDirectly() && (
          <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-2.5 text-xs font-semibold flex items-center justify-between animate-bounce">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-spin-slow" />
              <strong>Warning: No resistor!</strong> LED is connected straight to active power lines and burned out! 🔥
            </span>
            <span className="text-[10px] opacity-75 uppercase font-bold">Burned!</span>
          </div>
        )}

        {isRunning && hasShortCircuit() && (
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-2.5 text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600 animate-pulse" />
              <strong>Short Circuit Fault:</strong> Board voltage paths are crossed. Current loops backwards immediately! ⚠️
            </span>
            <span className="text-[10px] uppercase font-bold">Short Circuit</span>
          </div>
        )}

        {/* Dynamic SVG / HTML Grid Elements Canvas */}
        <div className="flex-1 w-full overflow-auto relative p-4 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]">
          
          <svg 
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            {/* Draw active wiring jumper lines */}
            {wires.map((wire) => {
              const fromComp = components.find(c => c.id === wire.fromComponentId);
              const toComp = components.find(c => c.id === wire.toComponentId);
              
              if (!fromComp || !toComp) return null;

              const startCoords = getPinGlobalCoordinates(fromComp, wire.fromPin);
              const endCoords = getPinGlobalCoordinates(toComp, wire.toPin);

              // Draw beautiful soft curves mimicking realistic elastic wiring strings
              const dx = endCoords.x - startCoords.x;
              const dy = endCoords.y - startCoords.y;
              const controlPointX1 = startCoords.x + dx * 0.2;
              const controlPointY1 = startCoords.y + dy * 0.9;
              const controlPointX2 = startCoords.x + dx * 0.8;
              const controlPointY2 = startCoords.y + dy * 0.1;

              return (
                <g key={wire.id}>
                  <path
                    d={`M ${startCoords.x} ${startCoords.y} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${endCoords.x} ${endCoords.y}`}
                    fill="none"
                    stroke={wire.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="opacity-95"
                  />
                  {/* Glowing dynamic current flow simulator particle animations */}
                  {isRunning && (
                    <path
                      d={`M ${startCoords.x} ${startCoords.y} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${endCoords.x} ${endCoords.y}`}
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="2.5"
                      strokeDasharray="8, 12"
                      strokeLinecap="round"
                      className="animate-dash"
                      style={{ animationDuration: '1.2s' }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Place and drag physical components */}
          <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            {components.map((comp) => {
              const isSelected = selectedCompId === comp.id;
              
              return (
                <div
                  key={comp.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedCompId(comp.id); }}
                  className={`absolute rounded-2xl cursor-grab active:cursor-grabbing select-none transition-transform z-20 ${
                    isSelected ? 'ring-3 ring-orange-400 p-1 bg-white/5 shadow-md' : ''
                  }`}
                  style={{ 
                    left: comp.x, 
                    top: comp.y, 
                    transform: `rotate(${comp.rotation}deg)`,
                  }}
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startCompX = comp.x;
                    const startCompY = comp.y;
                    let lastSnappedPin = "";

                    const onMouseMove = (moveEvt: MouseEvent) => {
                      const dx = moveEvt.clientX - startX;
                      const dy = moveEvt.clientY - startY;
                      
                      const tentativeX = startCompX + dx;
                      const tentativeY = startCompY + dy;
                      
                      let finalX = tentativeX;
                      let finalY = tentativeY;
                      let snapResult: {
                        breadboardId: string;
                        breadboardPin: string;
                        draggedId: string;
                        draggedPin: string;
                      } | null = null;
                      
                      if (comp.type !== 'breadboard') {
                        const activeBreadboard = components.find(c => c.type === 'breadboard');
                        if (activeBreadboard) {
                          const bbPinsList = Object.entries(activeBreadboard.pins).map(([pinName, offset]) => {
                            return {
                              name: pinName,
                              absX: activeBreadboard.x + offset.x,
                              absY: activeBreadboard.y + offset.y
                            };
                          });
                          
                          let bestSnap = null;
                          let minDistanceVal = 24; // snapping radius of 24 pixels
                          
                          for (const [compPinName, compOffset] of Object.entries(comp.pins)) {
                            const compPinAbsX = tentativeX + compOffset.x;
                            const compPinAbsY = tentativeY + compOffset.y;
                            
                            for (const bbPin of bbPinsList) {
                              const dist = Math.hypot(compPinAbsX - bbPin.absX, compPinAbsY - bbPin.absY);
                              if (dist < minDistanceVal) {
                                minDistanceVal = dist;
                                bestSnap = {
                                  compPinName,
                                  bbPinName: bbPin.name,
                                  bbAbsX: bbPin.absX,
                                  bbAbsY: bbPin.absY,
                                  compRelX: compOffset.x,
                                  compRelY: compOffset.y
                                };
                              }
                            }
                          }
                          
                          if (bestSnap) {
                            finalX = Math.round(bestSnap.bbAbsX - bestSnap.compRelX);
                            finalY = Math.round(bestSnap.bbAbsY - bestSnap.compRelY);
                            snapResult = {
                              breadboardId: activeBreadboard.id,
                              breadboardPin: bestSnap.bbPinName,
                              draggedId: comp.id,
                              draggedPin: bestSnap.compPinName
                            };

                            if (lastSnappedPin !== bestSnap.bbPinName) {
                              addConsoleLine(`[Circuit] Snapped: Aligned ${comp.name} pin [${bestSnap.compPinName}] to Breadboard tie-point [${bestSnap.bbPinName}]`);
                              lastSnappedPin = bestSnap.bbPinName;
                            }
                          } else {
                            if (lastSnappedPin !== "") {
                              addConsoleLine(`[Circuit] Unsnapped ${comp.name}`);
                              lastSnappedPin = "";
                            }
                          }
                        }
                      }
                      
                      setActiveSnap(snapResult);
                      setComponents(prev => prev.map(c => {
                        if (c.id === comp.id) {
                          return { ...c, x: finalX, y: finalY };
                        }
                        return c;
                      }));
                    };

                    const onMouseUp = () => {
                      document.removeEventListener('mousemove', onMouseMove);
                      document.removeEventListener('mouseup', onMouseUp);
                      setActiveSnap(null);
                    };

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                  }}
                >
                  {/* High Fidelity Visual Models for boards & micro components */}
                  {comp.type === 'arduino_uno' && (
                    <div className="w-[180px] h-[120px] bg-sky-900 border-2 border-sky-400 rounded-xl flex flex-col justify-between p-3 text-white overflow-hidden shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black tracking-widest text-sky-200">ARDUINO UNO R3</span>
                        <div className="w-5 h-5 rounded-md bg-amber-400 border border-yellow-200 flex items-center justify-center text-[8px] font-bold text-gray-900">
                          USB
                        </div>
                      </div>
                      
                      {/* Grid pin sockets */}
                      <div className="flex justify-between px-1">
                        <div className="flex flex-col gap-1">
                          <span className="text-[7px] text-sky-300">POWER</span>
                          <div className="flex gap-1">
                            {['5V', '3V3', 'GND'].map(pin => (
                              <button
                                key={pin}
                                onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                                className={`w-4 h-4 rounded-sm text-[7px] font-extrabold flex items-center justify-center border font-mono ${
                                  wireStart?.componentId === comp.id && wireStart?.pinName === pin
                                    ? 'bg-rose-500 text-white border-rose-300 scale-105'
                                    : 'bg-black text-white hover:bg-emerald-400 hover:text-gray-900 border-gray-600'
                                }`}
                              >
                                {pin}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[7px] text-sky-300 text-right">DIGITAL</span>
                          <div className="flex gap-1">
                            {['D13', 'D12', 'D11', 'D10', 'D8', 'D3', 'D2'].map(pin => (
                              <button
                                key={pin}
                                onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                                className={`w-3.5 h-3.5 rounded-sm text-[6px] font-extrabold flex items-center justify-center border font-mono ${
                                  wireStart?.componentId === comp.id && wireStart?.pinName === pin
                                    ? 'p bg-rose-500 text-white border-rose-300'
                                    : 'bg-black text-white hover:bg-emerald-400 hover:text-gray-900 border-gray-600'
                                }`}
                              >
                                {pin}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {comp.type === 'esp32' && (
                    <div className="w-[160px] h-[100px] bg-neutral-900 border-2 border-red-500 rounded-xl flex flex-col justify-between p-3 text-white overflow-hidden shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black tracking-widest text-red-500">ESP32 Dev Core</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                          <span className="text-[6px] text-gray-400">POWER</span>
                          <div className="flex gap-1.5">
                            {['3V3', 'GND'].map(pin => (
                              <button
                                key={pin}
                                onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                                className="w-4 h-4 bg-gray-800 border border-gray-600 hover:bg-red-400 rounded-sm text-[6px] flex items-center justify-center font-bold"
                              >
                                {pin}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[6px] text-gray-400 text-right">GPIO</span>
                          <div className="flex gap-1.5">
                            {['GPIO12', 'A1'].map(pin => (
                              <button
                                key={pin}
                                onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                                className="w-4 h-4 bg-gray-800 border border-gray-600 hover:bg-red-400 rounded-sm text-[6px] flex items-center justify-center font-bold"
                              >
                                {pin}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {comp.type === 'breadboard' && (
                    <div className="w-[300px] h-[100px] bg-amber-50/50 dark:bg-zinc-800 border-2 border-amber-200/40 dark:border-zinc-750 rounded-2xl flex flex-col justify-between p-2 shadow-md relative">
                      {/* Top Header Label */}
                      <div className="text-[7px] text-amber-800/80 dark:text-zinc-400 font-mono font-black uppercase tracking-widest text-center border-b border-amber-200/20 pb-0.5 leading-none">
                        🎓 Solderless Breadboard Rig
                      </div>

                      <div className="flex-1 flex flex-col justify-center mt-1">
                        {/* Column Numeric Row Headers: 1 to 12 */}
                        <div className="flex pl-[32px] gap-[8.5px] mb-0.5 select-none font-bold">
                          {Array.from({ length: 12 }).map((_, colIdx) => (
                            <span 
                              key={colIdx} 
                              className="text-[7px] font-mono leading-none font-black text-amber-850/60 dark:text-zinc-500 w-2.5 text-center"
                            >
                              {colIdx + 1}
                            </span>
                          ))}
                        </div>

                        {/* Interactive grid of holes */}
                        <div className="space-y-0.5">
                          {['a', 'b', 'c', 'd', 'e'].map((rowLetter, rIndex) => (
                            <div key={rowLetter} className="flex items-center">
                              {/* Left Row Letter Label */}
                              <span className="text-[7.5px] font-mono font-black uppercase text-amber-850/70 dark:text-zinc-400 w-8 pr-1.5 text-right select-none leading-none">
                                {rowLetter}
                              </span>

                              {/* Rows of connection pin slots */}
                              <div className="flex gap-[8.5px]">
                                {Array.from({ length: 12 }).map((_, colIdx) => {
                                  const colNo = colIdx + 1;
                                  const pinName = `${rowLetter}${colNo}`;
                                  const isPinSelected = wireStart?.componentId === comp.id && wireStart?.pinName === pinName;
                                  const isSnapped = activeSnap?.breadboardId === comp.id && activeSnap?.breadboardPin === pinName;
                                  
                                  return (
                                    <button
                                      key={pinName}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePinClick(comp.id, pinName);
                                      }}
                                      title={isSnapped ? `Snapped Pin: ${pinName}` : `Breadboard tie-point ${pinName}`}
                                      className={`w-2.5 h-2.5 rounded-full flex items-center justify-center border transition-all pointer-events-auto cursor-crosshair ${
                                        isPinSelected
                                          ? 'bg-rose-500 border-rose-300 animate-pulse scale-110 shadow-lg shadow-rose-500/30'
                                          : isSnapped
                                          ? 'bg-amber-400 border-amber-300 scale-125 shadow-md shadow-amber-400/50 ring-2 ring-amber-450 animate-pulse'
                                          : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-emerald-300 dark:hover:bg-emerald-700 border-zinc-250 dark:border-zinc-700 hover:scale-110'
                                      }`}
                                    >
                                      {/* Core center dot of realistic terminal clip pin */}
                                      <div className={`w-1 h-1 rounded-full ${isSnapped ? 'bg-amber-950' : 'bg-zinc-455 dark:bg-zinc-550'}`} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Power rails banner/bus indicator */}
                      <div className="flex items-center justify-center gap-1.5 border-t border-amber-200/10 pt-1 select-none">
                        <span className="text-[6.5px] text-red-500 font-black font-mono leading-none">+ VCC</span>
                        <div className="h-0.5 w-16 bg-red-400/30 rounded-full" />
                        <span className="text-[5.5px] text-amber-700/50 dark:text-zinc-500 font-mono tracking-wider leading-none uppercase font-bold">Bus Rails</span>
                        <div className="h-0.5 w-16 bg-blue-400/30 rounded-full" />
                        <span className="text-[6.5px] text-blue-500 font-black font-mono leading-none">- GND</span>
                      </div>
                    </div>
                  )}

                  {comp.type === 'led' && (
                    <div className="w-[60px] h-[60px] flex flex-col items-center justify-center bg-gray-150 rounded-xl border border-gray-200 shadow-2xs">
                      <div className={`w-7 h-7 rounded-full border-t border-white shadow-inner flex items-center justify-center relative ${
                        isRunning && !isLeddiredDirectly()
                          ? 'bg-rose-500 animate-pulse ring-4 ring-rose-400/40'
                          : 'bg-rose-800'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-white/40 absolute top-1 left-1" />
                      </div>
                      
                      <div className="flex gap-1.5 pt-1">
                        {['Anode', 'Cathode'].map(pin => {
                          const isPinSnapped = activeSnap?.draggedId === comp.id && activeSnap?.draggedPin === pin;
                          return (
                            <button
                              key={pin}
                              onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                              className={`text-[6px] px-1 font-mono rounded-[2px] transition-all ${
                                isPinSnapped 
                                  ? 'bg-amber-400 text-gray-950 font-black scale-110 ring-1 ring-amber-300 animate-pulse' 
                                  : 'bg-gray-800 text-white hover:bg-emerald-400'
                              }`}
                              title={pin}
                            >
                              {pin === 'Anode' ? '+' : '-'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {comp.type === 'resistor' && (
                    <div className="w-[80px] h-[40px] skeleton-resistor bg-amber-500/20 border border-amber-600/35 rounded-md flex flex-col justify-between p-1.5 text-center shadow-2xs">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-1.5 h-4 bg-orange-700 rounded-sm" />
                        <div className="w-1.5 h-4 bg-yellow-500 rounded-sm" />
                        <div className="w-1.5 h-4 bg-red-600 rounded-sm" />
                        <div className="w-1.5 h-4 bg-yellow-600 rounded-sm" />
                      </div>
                      <div className="flex justify-between items-center text-[6px] font-bold">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, 'Pin A'); }} 
                          className={`p-0.5 rounded-sm transition-all ${
                            activeSnap?.draggedId === comp.id && activeSnap?.draggedPin === 'Pin A'
                              ? 'bg-amber-400 text-gray-950 font-black scale-110 ring-1 ring-amber-300 animate-pulse'
                              : 'bg-gray-800 text-white'
                          }`}
                        >
                          A
                        </button>
                        <span className="text-[7.5px] font-black text-orange-900 leading-none">220Ω</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, 'Pin B'); }} 
                          className={`p-0.5 rounded-sm transition-all ${
                            activeSnap?.draggedId === comp.id && activeSnap?.draggedPin === 'Pin B'
                              ? 'bg-amber-400 text-gray-950 font-black scale-110 ring-1 ring-amber-300 animate-pulse'
                              : 'bg-gray-800 text-white'
                          }`}
                        >
                          B
                        </button>
                      </div>
                    </div>
                  )}

                  {comp.type === 'buzzer' && (
                    <div className="w-[60px] h-[65px] bg-neutral-900 border border-gray-700 text-white rounded-full flex flex-col items-center justify-center p-2 shadow-2xs">
                      <div className={`w-5 h-5 rounded-full border border-gray-500/30 font-bold flex items-center justify-center text-[10px] ${isRunning ? 'animate-ping text-yellow-300' : 'text-gray-400'}`}>
                        🔊
                      </div>
                      <div className="flex gap-1 mt-1">
                        {['Pos', 'Neg'].map(pin => {
                          const isPinSnapped = activeSnap?.draggedId === comp.id && activeSnap?.draggedPin === pin;
                          return (
                            <button
                              key={pin}
                              onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                              className={`text-[5.5px] px-1 border rounded-xs font-mono transition-all ${
                                isPinSnapped
                                  ? 'bg-amber-400 text-gray-950 border-amber-300 font-black scale-110 animate-pulse'
                                  : 'bg-gray-800 text-white border-transparent hover:bg-emerald-400'
                              }`}
                            >
                              {pin}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {comp.type === 'servo' && (
                    <div className="w-[75px] h-[75px] bg-blue-600 border-2 border-blue-400 rounded-xl flex flex-col justify-between p-2 text-white shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[7.5px] uppercase font-black">Servo Joint</span>
                        <div className="w-5 h-2 bg-white/30 rounded-full animate-pulse" />
                      </div>

                      {/* Moving arm visualhorn based on simulation state */}
                      <div className="flex justify-center py-1">
                        <div 
                          className="w-1.5 h-7 bg-white rounded-md origin-bottom transition-transform duration-500"
                          style={{ transform: isRunning ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        />
                      </div>

                      <div className="flex gap-1 justify-center">
                        {['Signal', 'Power', 'Ground'].map(pin => (
                          <button
                            key={pin}
                            onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                            className="bg-black/60 border border-white/10 rounded-xs p-0.5 text-[5px]"
                          >
                            {pin[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {comp.type === 'ultrasonic' && (
                    <div className="w-[100px] h-[70px] bg-indigo-900 border border-indigo-500 rounded-xl flex flex-col justify-between p-2 text-white shadow-2xs">
                      {/* Ultrasound visual transmitter scales */}
                      <div className="flex justify-around">
                        <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-indigo-400 flex items-center justify-center font-bold text-xs">O</div>
                        <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-indigo-400 flex items-center justify-center font-bold text-xs font-mono">O</div>
                      </div>

                      {/* Responsive interactive range slider */}
                      {isRunning && (
                        <div className="px-1">
                          <input 
                            type="range" 
                            min="2" 
                            max="400" 
                            value={sensorValues[comp.id] || 45}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSensorValues(prev => ({ ...prev, [comp.id]: val }));
                              addConsoleLine(`[Simulator] Adjusted Ultrasonic Range to: ${val} cm`);
                            }}
                            className="w-full accent-emerald-400 h-1.5 rounded-full cursor-col-resize"
                          />
                          <p className="text-[6px] text-center font-extrabold text-emerald-400">
                            Dist: {sensorValues[comp.id] || 45} cm
                          </p>
                        </div>
                      )}

                      <div className="flex gap-1 justify-center mt-1">
                        {['Trig', 'Echo', 'GND'].map(pin => (
                          <button
                            key={pin}
                            onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                            className="w-5 h-3 bg-gray-900 text-[5px] font-bold flex items-center justify-center rounded-xs"
                          >
                            {pin}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LDR Component */}
                  {comp.type === 'ldr' && (
                    <div className="w-[60px] h-[60px] bg-amber-50 border border-amber-300 rounded-xl p-1.5 flex flex-col justify-between text-center text-gray-800">
                      <div className={`text-xs ${isRunning ? 'animate-bounce' : ''}`}>☀️</div>
                      {isRunning && (
                        <div>
                          <input 
                            type="range" 
                            min="10" 
                            max="1023"
                            value={sensorValues[comp.id] || 450}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setSensorValues(prev => ({ ...prev, [comp.id]: val }));
                              addConsoleLine(`[Simulator] Adjusted LDR Light to: ${val} lm`);
                            }}
                            className="w-full h-1 accent-amber-500"
                          />
                        </div>
                      )}
                      <div className="flex gap-1 justify-center">
                        {['Pin1', 'Pin2'].map(pin => {
                          const isPinSnapped = activeSnap?.draggedId === comp.id && activeSnap?.draggedPin === pin;
                          return (
                            <button
                              key={pin}
                              onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                              className={`px-0.5 rounded-[2px] text-[5px] transition-all ${
                                isPinSnapped
                                  ? 'bg-amber-400 text-gray-950 font-black scale-110 ring-1 ring-amber-305 animate-pulse'
                                  : 'bg-gray-800 text-white'
                              }`}
                            >
                              {pin}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* General Component layout fallback */}
                  {!['arduino_uno', 'esp32', 'breadboard', 'led', 'resistor', 'buzzer', 'servo', 'ultrasonic', 'ldr'].includes(comp.type) && (
                    <div className="w-[80px] h-[60px] bg-white dark:bg-gray-800 border-2 border-emerald-500 rounded-xl p-2 flex flex-col justify-between shadow-2xs">
                      <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 truncate">{comp.name}</span>
                      <div className="w-full h-1 bg-emerald-100 dark:bg-emerald-950 rounded-full" />
                      <div className="flex justify-around">
                        {Object.keys(comp.pins).slice(0, 3).map(pin => (
                          <button
                            key={pin}
                            onClick={(e) => { e.stopPropagation(); handlePinClick(comp.id, pin); }}
                            className="w-4 h-3 bg-black text-white text-[5px] rounded-xs font-bold"
                          >
                            {pin}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pop up floating Component controller tools */}
                  {isSelected && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1.5 rounded-lg shadow-md z-50 animate-fade-in pointer-events-auto shrink-0 select-none">
                      <button
                        onClick={(e) => { e.stopPropagation(); rotateComponent(comp.id); }}
                        title="Rotate Part 90°"
                        className="p-1 rounded bg-gray-50 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-950 hover:text-orange-500"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteComponent(comp.id); }}
                        title="Delete Device"
                        className="p-1 rounded bg-gray-50 dark:bg-gray-700 hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              );
            })}

            {/* Ghosted planning preview coordinate snap feedback */}
            {hoveredPartPreview && (
              <div
                className="absolute rounded-xl pointer-events-none z-10 border-2 border-dashed border-emerald-500/80 dark:border-emerald-400/80 bg-emerald-500/10 dark:bg-emerald-500/15 flex flex-col items-center justify-center p-2 shadow-inner transition-all duration-300 ease-out animate-pulse"
                style={{
                  left: hoveredPartPreview.x,
                  top: hoveredPartPreview.y,
                  width: hoveredPartPreview.type === 'arduino_uno' ? 180 : hoveredPartPreview.type === 'esp32' ? 160 : hoveredPartPreview.type === 'breadboard' ? 300 : hoveredPartPreview.type === 'resistor' ? 80 : 60,
                  height: hoveredPartPreview.type === 'arduino_uno' ? 120 : hoveredPartPreview.type === 'esp32' ? 100 : hoveredPartPreview.type === 'breadboard' ? 100 : hoveredPartPreview.type === 'resistor' ? 40 : 60,
                  transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1), top 0.2s cubic-bezier(0.16, 1, 0.3, 1), width 0.2s, height 0.2s'
                }}
              >
                <div className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-center flex flex-col items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-500/90" style={{ animationDuration: '4s' }} />
                  <span className="truncate max-w-[120px] font-black">{hoveredPartPreview.name}</span>
                  <span className="text-[6.5px] font-extrabold px-1 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 rounded text-emerald-700 dark:text-emerald-300 font-mono tracking-normal leading-none space-y-1">
                    Snaps Here (Quick Add)
                  </span>
                </div>
              </div>
            )}
          </div>

          {components.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center p-8 bg-white/40 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/80 rounded-2xl max-w-sm pointer-events-none">
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto animate-pulse mb-3" />
              <h4 className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-wider">Canvas is Ready!</h4>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                Choose any electronics part on the left-hand menu, connect colorful wires, and power up!
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
