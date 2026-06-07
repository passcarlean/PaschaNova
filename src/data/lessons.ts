import { Lesson } from '../types';

export const STEM_LESSONS: Lesson[] = [
  {
    id: 'les_leds',
    title: 'Flashing Bright LEDs',
    description: 'Learn how to configure electronic pins and write code to blink a digital LED on and off!',
    difficulty: 'Easy',
    category: 'LEDs',
    steps: [
      {
        stepNumber: 1,
        title: 'Place an LED Indicator',
        explanation: 'Every circuit needs output components to show us options. Open the Circuit Builder tab and find the LED in the parts drawer. Drag it onto your visual board!',
        hint: 'Click the LED in the Components menu inside the Circuit Builder to spawn it on the board.',
        goalType: 'connect_circuit',
        targetValue: 'led'
      },
      {
        stepNumber: 2,
        title: 'Add a Turn ON Block',
        explanation: 'We need to tell the Arduino to power Pin 13 up. Go to the Blockly Studio tab, open the "Outputs" category, and drag out a "turn LED Pin 13 to ON" block.',
        hint: 'Find "turn LED Pin 13 to ON" from the Outputs shelf on the left.',
        goalType: 'add_block',
        targetValue: 'out_led'
      },
      {
        stepNumber: 3,
        title: 'Run your Simulation!',
        explanation: 'Success! Now press "Run" in the top right header to activate power supply. Watch the virtual LED illuminate!',
        hint: 'Press the "Run" play symbol in the navbar.',
        goalType: 'run_simulation'
      }
    ]
  },
  {
    id: 'les_sensors',
    title: 'Reading Distance Sensors',
    description: 'Hook up an ultrasonic distance sensor to measure distances and detect obstacles in real-time!',
    difficulty: 'Medium',
    category: 'Sensors',
    steps: [
      {
        stepNumber: 1,
        title: 'Place Ultrasonic Distance sensor',
        explanation: 'HC-SR04 uses sound waves to measure distances. Let\'s place one on our breadboard!',
        hint: 'Select the Ultrasonic sensor from the component selection list.',
        goalType: 'connect_circuit',
        targetValue: 'ultrasonic'
      },
      {
        stepNumber: 2,
        title: 'Add Ultrasonic Measurement Block',
        explanation: 'In Blockly Studio, go to the "Sensors" category and drag "read ultrasonic distance" block to let the CPU begin recording echo metrics.',
        hint: 'Purple sensor category holds the ultrasonic read blocks.',
        goalType: 'add_block',
        targetValue: 'sensor_ultrasonic'
      },
      {
        stepNumber: 3,
        title: 'Simulate & Measure Ultrasonic Ping',
        explanation: 'Now hit the "Run" button to start the system, slide the distance slider, and look at the virtual console print live numbers!',
        hint: 'Press Run, then adjust the ultrasonic sensor range on screen.',
        goalType: 'run_simulation'
      }
    ]
  },
  {
    id: 'les_motors',
    title: 'Controlling Servo Joint Motors',
    description: 'Learn how robotic joints rotate. Position a high-torque 180-degree servo motor via code!',
    difficulty: 'Medium',
    category: 'Motors',
    steps: [
      {
        stepNumber: 1,
        title: 'Position Micro-Servo Core',
        explanation: 'Locate national micro servo motor modules and install them to joint pins.',
        hint: 'Add a servo motor in the components list.',
        goalType: 'connect_circuit',
        targetValue: 'servo'
      },
      {
        stepNumber: 2,
        title: 'Drag Servo Rotation Instruction',
        explanation: 'Place down a "rotate servo Pin 10 to 90°" block to command the robotic flap to swing open!',
        hint: 'Find the servo output control blocks inside Output options.',
        goalType: 'add_block',
        targetValue: 'out_servo'
      },
      {
        stepNumber: 3,
        title: 'Start Simulation to See Sweep',
        explanation: 'Press the main Run action, and see the digital servo horn sweep instantly to your designated angle.',
        hint: 'Initiate Run simulation to sweep the servo.',
        goalType: 'run_simulation'
      }
    ]
  },
  {
    id: 'les_arduino_basics',
    title: 'Arduino Programming 101',
    description: 'Learn digital inputs, outputs, values, and loop parameters inside Arduino IDE blocks.',
    difficulty: 'Easy',
    category: 'Arduino basics',
    steps: [
      {
        stepNumber: 1,
        title: 'Introduce a Forever Loop wrapper',
        explanation: 'Arduino programs rely on two key structures: setup() running once, and loop() running continuously! Drag out a "repeat forever (loop)" block so our code loops.',
        hint: 'Look into Green Loops category shelf.',
        goalType: 'add_block',
        targetValue: 'loop_forever'
      },
      {
        stepNumber: 2,
        title: 'Drag digital write pin instruction',
        explanation: 'To declare Pin out status dynamically, drop an Arduino digital write block into your code canvas.',
        hint: 'Arduino Teal shelf contains digitalWrite pins.',
        goalType: 'add_block',
        targetValue: 'ard_digital_write'
      }
    ]
  },
  {
    id: 'les_esp_basics',
    title: 'ESP32 Internet of Things Hub',
    description: 'Learn how to bridge your breadboards directly to Wi-Fi nodes to enable cloud dashboard controls.',
    difficulty: 'Hard',
    category: 'ESP32 basics',
    steps: [
      {
        stepNumber: 1,
        title: 'Join Internet Router wireless lines',
        explanation: 'Drag an ESP Wi-Fi Connect node to establishing wireless handshakes on startup.',
        hint: 'Red ESP32 category -> Wi-Fi connect block.',
        goalType: 'add_block',
        targetValue: 'esp_wifi_connect'
      },
      {
        stepNumber: 2,
        title: 'Run Simulation to Connect Online',
        explanation: 'Hit the Run trigger and witness your virtual phone hub receive automated updates directly through the WiFi nodes!',
        hint: 'Fire up the simulation to sync with dashboard.',
        goalType: 'run_simulation'
      }
    ]
  }
];
