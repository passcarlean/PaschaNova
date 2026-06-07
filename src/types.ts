export interface BlockType {
  id: string;
  type: string; // 'logic_if', 'loop_repeat', 'output_led', etc.
  category: string;
  label: string;
  color: string;
  inputs?: string[];
  fields?: { [key: string]: string | number | boolean };
  nextBlockId?: string;
  innerBlockId?: string; // For loops/branch statements block content
}

export interface WorkspaceBlock extends BlockType {
  x: number;
  y: number;
}

export interface BlockCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  blocks: BlockType[];
}

export interface CircuitComponent {
  id: string;
  type: string; // 'arduino_uno', 'esp32', 'breadboard', 'led', 'resistor', 'buzzer', 'servo', etc.
  name: string;
  x: number;
  y: number;
  rotation: number; // in degrees (0, 90, 180, 270)
  pins: { [name: string]: { x: number; y: number; connectedTo?: { componentId: string; pinName: string; color: string } } };
  value?: string | number; // e.g. '220 Ohm', 'Red'
}

export interface WireConnection {
  id: string;
  fromComponentId: string;
  fromPin: string;
  toComponentId: string;
  toPin: string;
  color: string;
}

export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Coding' | 'Circuits' | 'Robotics' | 'IoT' | 'AI';
  blocks: WorkspaceBlock[];
  components: CircuitComponent[];
  wires: WireConnection[];
  initialRobotPosition?: { x: number; y: number; angle: number };
}

export interface SavedProject {
  id: string;
  title: string;
  description: string;
  blocks: WorkspaceBlock[];
  components: CircuitComponent[];
  wires: WireConnection[];
  savedAt: string;
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  explanation: string;
  hint: string;
  goalType: 'add_block' | 'connect_circuit' | 'run_simulation';
  targetValue?: string; // e.g. block type to add, component to place
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'LEDs' | 'Sensors' | 'Motors' | 'IoT' | 'AI' | 'Arduino basics' | 'ESP32 basics' | 'robotics';
  steps: LessonStep[];
  preFilledBlocks?: WorkspaceBlock[];
  preFilledComponents?: CircuitComponent[];
}

export interface RobotState {
  x: number;
  y: number;
  angle: number; // in degrees
  speed: number;
  leftSensorDetected: boolean;
  rightSensorDetected: boolean;
  centerSensorDetected: boolean;
  distanceToObstacle: number;
  isMoving: boolean;
  servoAngle: number;
  linePositionX: number; // Line for line follower
  obstacleX: number;
  obstacleY: number;
}

export interface IotDashboardState {
  smartLightOn: boolean;
  fanSpeed: number; // 0, 1, 2, 3
  sprinklerOn: boolean;
  temperature: number;
  humidity: number;
  moisture: number;
  gasDetected: boolean;
  historyData: { time: string; temp: number; hum: number; moisture: number }[];
}

export interface AiLabState {
  cameraActive: boolean;
  detectType: 'face' | 'object' | 'color' | 'voice' | 'none';
  detectedItems: string[];
  overlayVisible: boolean;
  voiceComandActive: boolean;
  lastSpokenPhrase: string;
  ttsActive: boolean;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'student' | 'maker' | 'admin';
  createdAt: string;
  updatedAt: string;
  isLocal?: boolean;
}

