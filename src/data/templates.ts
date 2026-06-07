import { ProjectTemplate } from '../types';

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'blink_led',
    title: 'Blink LED',
    description: 'The "Hello World" of electronics! Make a colorful LED blink on and off.',
    difficulty: 'Beginner',
    category: 'Coding',
    components: [
      {
        id: 'board_1',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        x: 100,
        y: 80,
        rotation: 0,
        pins: {
          '5V': { x: 195, y: 190 },
          'GND': { x: 180, y: 190 },
          'D13': { x: 160, y: 45 }
        }
      },
      {
        id: 'led_1',
        type: 'led',
        name: 'Red LED',
        x: 350,
        y: 120,
        rotation: 0,
        pins: {
          'Anode': { x: 355, y: 150 },
          'Cathode': { x: 365, y: 150 }
        },
        value: 'Red'
      },
      {
        id: 'res_1',
        type: 'resistor',
        name: 'Resistor 220Ω',
        x: 350,
        y: 200,
        rotation: 90,
        pins: {
          'Pin A': { x: 350, y: 180 },
          'Pin B': { x: 350, y: 220 }
        },
        value: '220Ω'
      }
    ],
    wires: [
      { id: 'w1', fromComponentId: 'board_1', fromPin: 'D13', toComponentId: 'led_1', toPin: 'Anode', color: '#EF4444' },
      { id: 'w2', fromComponentId: 'led_1', fromPin: 'Cathode', toComponentId: 'res_1', toPin: 'Pin A', color: '#111827' },
      { id: 'w3', fromComponentId: 'res_1', fromPin: 'Pin B', toComponentId: 'board_1', toPin: 'GND', color: '#111827' }
    ],
    blocks: [
      { id: 'b1', type: 'out_led', category: 'outputs', label: 'turn LED Pin 13 to ON', color: '#FF6680', fields: { pin: 13, state: 'HIGH' }, x: 50, y: 50 },
      { id: 'b2', type: 'time_wait', category: 'timing', label: 'wait 1 second (1000ms)', color: '#D4155C', fields: { ms: 1000 }, x: 50, y: 130 },
      { id: 'b3', type: 'out_led', category: 'outputs', label: 'turn LED Pin 13 to OFF', color: '#FF6680', fields: { pin: 13, state: 'LOW' }, x: 50, y: 210 },
      { id: 'b4', type: 'time_wait', category: 'timing', label: 'wait 1 second (1000ms)', color: '#D4155C', fields: { ms: 1000 }, x: 50, y: 290 }
    ]
  },
  {
    id: 'traffic_light',
    title: 'Traffic Light controller',
    description: 'Simulate a realistic street traffic light with Green, Yellow, and Red indicators.',
    difficulty: 'Beginner',
    category: 'Circuits',
    components: [
      {
        id: 'board_1',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        x: 80,
        y: 80,
        rotation: 0,
        pins: {
          'GND': { x: 180, y: 190 },
          'D11': { x: 140, y: 45 },
          'D12': { x: 150, y: 45 },
          'D13': { x: 160, y: 45 }
        }
      },
      { id: 'led_red', type: 'led', name: 'Red LED', x: 380, y: 80, rotation: 0, pins: { 'Anode': { x: 385, y: 110 }, 'Cathode': { x: 395, y: 110 } }, value: 'Red' },
      { id: 'led_yellow', type: 'led', name: 'Yellow LED', x: 380, y: 140, rotation: 0, pins: { 'Anode': { x: 385, y: 170 }, 'Cathode': { x: 395, y: 170 } }, value: 'Yellow' },
      { id: 'led_green', type: 'led', name: 'Green LED', x: 380, y: 200, rotation: 0, pins: { 'Anode': { x: 385, y: 230 }, 'Cathode': { x: 395, y: 230 } }, value: 'Green' }
    ],
    wires: [
      { id: 'wl1', fromComponentId: 'board_1', fromPin: 'D13', toComponentId: 'led_red', toPin: 'Anode', color: '#EF4444' },
      { id: 'wl2', fromComponentId: 'board_1', fromPin: 'D12', toComponentId: 'led_yellow', toPin: 'Anode', color: '#FBBF24' },
      { id: 'wl3', fromComponentId: 'board_1', fromPin: 'D11', toComponentId: 'led_green', toPin: 'Anode', color: '#10B981' },
      { id: 'w_gnd_r', fromComponentId: 'led_red', fromPin: 'Cathode', toComponentId: 'board_1', toPin: 'GND', color: '#111827' },
      { id: 'w_gnd_y', fromComponentId: 'led_yellow', fromPin: 'Cathode', toComponentId: 'board_1', toPin: 'GND', color: '#111827' },
      { id: 'w_gnd_g', fromComponentId: 'led_green', fromPin: 'Cathode', toComponentId: 'board_1', toPin: 'GND', color: '#111827' }
    ],
    blocks: [
      { id: 'tl1', type: 'out_led', category: 'outputs', label: 'turn LED Pin 13 to ON', color: '#FF6680', fields: { pin: 13, state: 'HIGH' }, x: 50, y: 50 },
      { id: 'tl2', type: 'out_led', category: 'outputs', label: 'turn LED Pin 12 to OFF', color: '#FF6680', fields: { pin: 12, state: 'LOW' }, x: 50, y: 120 },
      { id: 'tl3', type: 'out_led', category: 'outputs', label: 'turn LED Pin 11 to OFF', color: '#FF6680', fields: { pin: 11, state: 'LOW' }, x: 50, y: 190 },
      { id: 'tl4', type: 'time_wait', category: 'timing', label: 'wait 4 seconds (4000ms)', color: '#D4155C', fields: { ms: 4000 }, x: 50, y: 260 },
      { id: 'tl5', type: 'out_led', category: 'outputs', label: 'turn LED Pin 13 to OFF', color: '#FF6680', fields: { pin: 13, state: 'LOW' }, x: 50, y: 330 },
      { id: 'tl6', type: 'out_led', category: 'outputs', label: 'turn LED Pin 12 to ON', color: '#FF6680', fields: { pin: 12, state: 'HIGH' }, x: 50, y: 400 }
    ]
  },
  {
    id: 'servo_control',
    title: 'Servo Sweep Control',
    description: 'Learn to control robotic joint angles. Make a micro-servo motor rotate backwards and forwards.',
    difficulty: 'Intermediate',
    category: 'Robotics',
    components: [
      {
        id: 'board_1',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        x: 100,
        y: 80,
        rotation: 0,
        pins: {
          '5V': { x: 195, y: 190 },
          'GND': { x: 180, y: 190 },
          'D10': { x: 125, y: 45 }
        }
      },
      {
        id: 'servo_1',
        type: 'servo',
        name: 'TowerProSG90',
        x: 380,
        y: 120,
        rotation: 0,
        pins: {
          'Signal': { x: 380, y: 140 },
          'Power': { x: 390, y: 140 },
          'Ground': { x: 400, y: 140 }
        }
      }
    ],
    wires: [
      { id: 'ws1', fromComponentId: 'board_1', fromPin: 'D10', toComponentId: 'servo_1', toPin: 'Signal', color: '#F97316' }, // PWM Signal (Orange)
      { id: 'ws2', fromComponentId: 'board_1', fromPin: '5V', toComponentId: 'servo_1', toPin: 'Power', color: '#EF4444' }, // VCC (Red)
      { id: 'ws3', fromComponentId: 'board_1', fromPin: 'GND', toComponentId: 'servo_1', toPin: 'Ground', color: '#4B5563' } // GND (Brown)
    ],
    blocks: [
      { id: 'sv1', type: 'out_servo', category: 'outputs', label: 'rotate servo Pin 10 to 0°', color: '#FF6680', fields: { pin: 10, angle: 0 }, x: 50, y: 50 },
      { id: 'sv2', type: 'time_wait', category: 'timing', label: 'wait 1 second (1000ms)', color: '#D4155C', fields: { ms: 1000 }, x: 50, y: 120 },
      { id: 'sv3', type: 'out_servo', category: 'outputs', label: 'rotate servo Pin 10 to 90°', color: '#FF6680', fields: { pin: 10, angle: 90 }, x: 50, y: 190 },
      { id: 'sv4', type: 'time_wait', category: 'timing', label: 'wait 1 second (1000ms)', color: '#D4155C', fields: { ms: 1000 }, x: 50, y: 260 },
      { id: 'sv5', type: 'out_servo', category: 'outputs', label: 'rotate servo Pin 10 to 180°', color: '#FF6680', fields: { pin: 10, angle: 180 }, x: 50, y: 330 }
    ]
  },
  {
    id: 'smart_home_light',
    title: 'Smart Home Automated Light',
    description: 'Create an energy-saving light! Lights go ON automatically with a relay connection when it is dark.',
    difficulty: 'Intermediate',
    category: 'IoT',
    components: [
      {
        id: 'board_1',
        type: 'esp32',
        name: 'ESP32 NodeMCU',
        x: 100,
        y: 100,
        rotation: 0,
        pins: {
          '3V3': { x: 195, y: 190 },
          'GND': { x: 180, y: 190 },
          'GPIO12': { x: 120, y: 50 },
          'A1': { x: 135, y: 50 }
        }
      },
      {
        id: 'ldr_1',
        type: 'ldr',
        name: 'LDR Photoresistor',
        x: 350,
        y: 80,
        rotation: 0,
        pins: { 'Pin1': { x: 350, y: 100 }, 'Pin2': { x: 360, y: 100 } }
      },
      {
        id: 'relay_1',
        type: 'relay',
        name: '5V Single-Channel Relay',
        x: 340,
        y: 180,
        rotation: 0,
        pins: { 'IN': { x: 340, y: 190 }, 'VCC': { x: 350, y: 190 }, 'GND': { x: 360, y: 190 } }
      }
    ],
    wires: [
      { id: 'wi1', fromComponentId: 'board_1', fromPin: 'GPIO12', toComponentId: 'relay_1', toPin: 'IN', color: '#EF4444' },
      { id: 'wi2', fromComponentId: 'board_1', fromPin: 'A1', toComponentId: 'ldr_1', toPin: 'Pin1', color: '#9333EA' },
      { id: 'wi3', fromComponentId: 'board_1', fromPin: '3V3', toComponentId: 'ldr_1', toPin: 'Pin2', color: '#F59E0B' },
      { id: 'wi4', fromComponentId: 'board_1', fromPin: 'GND', toComponentId: 'relay_1', toPin: 'GND', color: '#111827' }
    ],
    blocks: [
      { id: 'sh1', type: 'auto_light', category: 'automation', label: 'smart light auto on (LDR Pin A1, Relay Pin 12)', color: '#00CED1', fields: { triggerVal: 300, ldrPin: 'A1', relayPin: 12 }, x: 50, y: 50 }
    ]
  },
  {
    id: 'fire_detector',
    title: 'Burglar & Disaster Alarm',
    description: 'Keep your smart room safe using interactive sirens, relays, and motion sensors.',
    difficulty: 'Intermediate',
    category: 'AI',
    components: [
      { id: 'board_1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 80, rotation: 0, pins: { 'GND': { x: 180, y: 190 }, 'D7': { x: 110, y: 45 }, 'D8': { x: 115, y: 45 } } },
      { id: 'pir_1', type: 'pir', name: 'PIR Motion Sensor', x: 350, y: 80, rotation: 0, pins: { 'Out': { x: 350, y: 110 }, 'VCC': { x: 360, y: 110 }, 'GND': { x: 370, y: 110 } } },
      { id: 'buzz_1', type: 'buzzer', name: 'Active Spindle Siren', x: 350, y: 200, rotation: 0, pins: { 'Pos': { x: 350, y: 230 }, 'Neg': { x: 360, y: 230 } } }
    ],
    wires: [
      { id: 'wf1', fromComponentId: 'board_1', fromPin: 'D7', toComponentId: 'pir_1', toPin: 'Out', color: '#10B981' },
      { id: 'wf2', fromComponentId: 'board_1', fromPin: 'D8', toComponentId: 'buzz_1', toPin: 'Pos', color: '#EF4444' },
      { id: 'wf3', fromComponentId: 'pir_1', fromPin: 'GND', toComponentId: 'board_1', toPin: 'GND', color: '#111827' },
      { id: 'wf4', fromComponentId: 'buzz_1', fromPin: 'Neg', toComponentId: 'board_1', toPin: 'GND', color: '#111827' }
    ],
    blocks: [
      { id: 'da1', type: 'auto_alarm', category: 'automation', label: 'security burglar alarm (PIR Pin 7, Buzzer Pin 8)', color: '#00CED1', fields: { pirPin: 7, buzzerPin: 8 }, x: 50, y: 50 }
    ]
  },
  {
    id: 'ultrasonic_parking',
    title: 'Ultrasonic Parking Tracker',
    description: 'Simulates smart reversing sensors. Buzzer triggers faster as components get closer.',
    difficulty: 'Advanced',
    category: 'Circuits',
    components: [
      { id: 'board_1', type: 'arduino_uno', name: 'Arduino Uno R3', x: 100, y: 80, rotation: 0, pins: { 'GND': { x: 180, y: 190 }, 'D2': { x: 105, y: 45 }, 'D3': { x: 110, y: 45 }, 'D8': { x: 115, y: 45 } } },
      { id: 'hc_sr04', type: 'ultrasonic', name: 'Ultrasonic Distance Meter', x: 360, y: 80, rotation: 0, pins: { 'Trig': { x: 360, y: 120 }, 'Echo': { x: 370, y: 120 }, 'GND': { x: 380, y: 120 } } },
      { id: 'buzz_1', type: 'buzzer', name: 'Buzzer', x: 360, y: 200, rotation: 0, pins: { 'Pos': { x: 360, y: 220 }, 'Neg': { x: 370, y: 220 } } }
    ],
    wires: [
      { id: 'wu1', fromComponentId: 'board_1', fromPin: 'D2', toComponentId: 'hc_sr04', toPin: 'Trig', color: '#9333EA' },
      { id: 'wu2', fromComponentId: 'board_1', fromPin: 'D3', toComponentId: 'hc_sr04', toPin: 'Echo', color: '#10B981' },
      { id: 'wu3', fromComponentId: 'board_1', fromPin: 'D8', toComponentId: 'buzz_1', toPin: 'Pos', color: '#EF4444' },
      { id: 'wu4', fromComponentId: 'hc_sr04', fromPin: 'GND', toComponentId: 'board_1', toPin: 'GND', color: '#111827' },
      { id: 'wu5', fromComponentId: 'buzz_1', fromPin: 'Neg', toComponentId: 'board_1', toPin: 'GND', color: '#111827' }
    ],
    blocks: [
      { id: 'up1', type: 'sensor_ultrasonic', category: 'sensors', label: 'read ultrasonic distance (Trig: 2, Echo: 3)', color: '#9966FF', fields: { trig: 2, echo: 3 }, x: 50, y: 50 },
      { id: 'up2', type: 'out_buzzer', category: 'outputs', label: 'play buzzer note at Pin 8', color: '#FF6680', fields: { pin: 8, freq: 880, time: 100 }, x: 50, y: 130 }
    ]
  },
  {
    id: 'robot_car',
    title: 'Autonomous obstacle Avoidance Robot',
    description: 'Program a mobile car that drives forward but immediately turns when an obstacle is detected!',
    difficulty: 'Advanced',
    category: 'Robotics',
    components: [
      { id: 'board_1', type: 'arduino_uno', name: 'Arduino Nano R3', x: 100, y: 80, rotation: 0, pins: { 'GND': { x: 180, y: 190 }, 'D2': { x: 105, y: 45 }, 'D3': { x: 110, y: 45 } } },
      { id: 'hc_sr04_rob', type: 'ultrasonic', name: 'Ultrasonic Shield', x: 360, y: 80, rotation: 0, pins: { 'Trig': { x: 360, y: 110 }, 'Echo': { x: 370, y: 110 } } }
    ],
    wires: [
      { id: 'rob_w1', fromComponentId: 'board_1', fromPin: 'D2', toComponentId: 'hc_sr04_rob', toPin: 'Trig', color: '#4F46E5' },
      { id: 'rob_w2', fromComponentId: 'board_1', fromPin: 'D3', toComponentId: 'hc_sr04_rob', toPin: 'Echo', color: '#06B6D4' }
    ],
    blocks: [
      { id: 'rb1', type: 'robot_move', category: 'robotics', label: 'drive robot FORWARD at speed 100', color: '#2CA02C', fields: { dir: 'FORWARD', speed: 100 }, x: 50, y: 50 },
      { id: 'rb2', type: 'robot_avoid', category: 'robotics', label: 'if obstacle nearby, dodge LEFT', color: '#2CA02C', fields: { dist: 20 }, x: 50, y: 120 }
    ]
  },
  {
    id: 'rfid_attendance',
    title: 'RFID smart Locker',
    description: 'Use RFID access badges to activate a small virtual feedback servo and welcome readers.',
    difficulty: 'Advanced',
    category: 'IoT',
    components: [
      { id: 'board_1', type: 'arduino_uno', name: 'Arduino Web R3', x: 100, y: 80, rotation: 0, pins: { 'GND': { x: 180, y: 190 }, 'D10': { x: 125, y: 45 } } },
      { id: 'servo_rfid', type: 'servo', name: 'Locker Servo Door', x: 360, y: 150, rotation: 0, pins: { 'Signal': { x: 360, y: 170 } } }
    ],
    wires: [
      { id: 'rf_w1', fromComponentId: 'board_1', fromPin: 'D10', toComponentId: 'servo_rfid', toPin: 'Signal', color: '#10B981' }
    ],
    blocks: [
      { id: 'rfid_b1', type: 'out_servo', category: 'outputs', label: 'rotate servo Pin 10 to 90°', color: '#FF6680', fields: { pin: 10, angle: 90 }, x: 50, y: 50 },
      { id: 'rfid_b2', type: 'time_wait', category: 'timing', label: 'wait 2 seconds (2000ms)', color: '#D4155C', fields: { ms: 2000 }, x: 50, y: 120 },
      { id: 'rfid_b3', type: 'out_servo', category: 'outputs', label: 'rotate servo Pin 10 to 0°', color: '#FF6680', fields: { pin: 10, angle: 0 }, x: 50, y: 190 }
    ]
  },
  {
    id: 'weather_station',
    title: 'IoT Weather Hub Dashboard',
    description: 'Sends real-world telemetry such as humidity and heat from ESP32 microcontrollers straight to dashboards.',
    difficulty: 'Intermediate',
    category: 'IoT',
    components: [
      { id: 'board_1', type: 'esp32', name: 'ESP32 IoT Hub', x: 100, y: 100, rotation: 0, pins: { 'GND': { x: 180, y: 190 }, 'A1': { x: 135, y: 50 } } },
      { id: 'sensor_dht', type: 'temp', name: 'DHT11 Sense Core', x: 350, y: 100, rotation: 0, pins: { 'OUT': { x: 350, y: 120 } } }
    ],
    wires: [
      { id: 'we_w1', fromComponentId: 'board_1', fromPin: 'A1', toComponentId: 'sensor_dht', toPin: 'OUT', color: '#8B5CF6' }
    ],
    blocks: [
      { id: 'weth_b1', type: 'esp_wifi_connect', category: 'esp32', label: 'connect to Wi-Fi SSID "MakerNet"', color: '#E7352C', fields: { ssid: 'MakerNet', pass: 'STEM1234' }, x: 50, y: 50 },
      { id: 'weth_b2', type: 'esp_mqtt_publish', category: 'esp32', label: 'publish msg to "home/lights"', color: '#E7352C', fields: { topic: 'home/weather', msg: 'Temp:24C,Hum:62%' }, x: 50, y: 120 }
    ]
  }
];
