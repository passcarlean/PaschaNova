import { BlockCategory, BlockType } from '../types';

export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    id: 'logic',
    name: 'Logic',
    color: '#FFAB19', // Orange
    icon: 'Brain',
    blocks: [
      { id: 'logic_if', type: 'logic_if', category: 'logic', label: 'if <condition> then', color: '#FFAB19', inputs: ['condition'] },
      { id: 'logic_if_else', type: 'logic_if_else', category: 'logic', label: 'if <condition> then / else', color: '#FFAB19', inputs: ['condition'] },
      { id: 'logic_compare', type: 'logic_compare', category: 'logic', label: 'A = B', color: '#FFAB19', fields: { valA: 'sensorValue', op: '==', valB: '100' } },
      { id: 'logic_true_false', type: 'logic_true_false', category: 'logic', label: 'True', color: '#FFAB19', fields: { value: 'true' } },
      { id: 'logic_and_or', type: 'logic_and_or', category: 'logic', label: 'A and B', color: '#FFAB19', fields: { op: '&&' } }
    ]
  },
  {
    id: 'loops',
    name: 'Loops',
    color: '#0FBD8C', // Green
    icon: 'RotateCw',
    blocks: [
      { id: 'loop_forever', type: 'loop_forever', category: 'loops', label: 'repeat forever (loop)', color: '#0FBD8C' },
      { id: 'loop_repeat', type: 'loop_repeat', category: 'loops', label: 'repeat 10 times', color: '#0FBD8C', fields: { times: 10 } },
      { id: 'loop_while', type: 'loop_while', category: 'loops', label: 'while <condition>', color: '#0FBD8C', inputs: ['condition'] }
    ]
  },
  {
    id: 'variables',
    name: 'Variables',
    color: '#FF8C1A', // Amber
    icon: 'Variable',
    blocks: [
      { id: 'var_create', type: 'var_create', category: 'variables', label: 'create variable x', color: '#FF8C1A', fields: { name: 'distance' } },
      { id: 'var_set', type: 'var_set', category: 'variables', label: 'set x to', color: '#FF8C1A', fields: { name: 'distance', val: 0 } },
      { id: 'var_increase', type: 'var_increase', category: 'variables', label: 'change x by 1', color: '#FF8C1A', fields: { name: 'distance', change: 1 } }
    ]
  },
  {
    id: 'math',
    name: 'Math',
    color: '#4C97FF', // Light Blue
    icon: 'Calculator',
    blocks: [
      { id: 'math_op', type: 'math_op', category: 'math', label: 'A + B', color: '#4C97FF', fields: { valA: '10', op: '+', valB: '5' } },
      { id: 'math_random', type: 'math_random', category: 'math', label: 'pick random from 1 to 100', color: '#4C97FF', fields: { min: 1, max: 100 } }
    ]
  },
  {
    id: 'timing',
    name: 'Timing',
    color: '#D4155C', // Rose Red
    icon: 'Clock',
    blocks: [
      { id: 'time_wait', type: 'time_wait', category: 'timing', label: 'wait 1 second (1000ms)', color: '#D4155C', fields: { ms: 1000 } },
      { id: 'time_timer', type: 'time_timer', category: 'timing', label: 'get elapsed time (ms)', color: '#D4155C' }
    ]
  },
  {
    id: 'arduino',
    name: 'Arduino Board',
    color: '#00979C', // Arduino Teal
    icon: 'Cpu',
    blocks: [
      { id: 'ard_digital_write', type: 'ard_digital_write', category: 'arduino', label: 'digital write Pin 13 to HIGH', color: '#00979C', fields: { pin: 13, val: 'HIGH' } },
      { id: 'ard_digital_read', type: 'ard_digital_read', category: 'arduino', label: 'digital read Pin 2', color: '#00979C', fields: { pin: 2 } },
      { id: 'ard_analog_read', type: 'ard_analog_read', category: 'arduino', label: 'analog read Pin A0', color: '#00979C', fields: { pin: 'A0' } },
      { id: 'ard_pwm_write', type: 'ard_pwm_write', category: 'arduino', label: 'set PWM Pin 9 to speed 255', color: '#00979C', fields: { pin: 9, speed: 255 } }
    ]
  },
  {
    id: 'esp32',
    name: 'ESP32 IoT',
    color: '#E7352C', // ESP Red/Orange
    icon: 'Wifi',
    blocks: [
      { id: 'esp_wifi_connect', type: 'esp_wifi_connect', category: 'esp32', label: 'connect to Wi-Fi SSID "MakerNet"', color: '#E7352C', fields: { ssid: 'MakerNet', pass: 'STEM1234' } },
      { id: 'esp_mqtt_publish', type: 'esp_mqtt_publish', category: 'esp32', label: 'publish msg to "home/lights"', color: '#E7352C', fields: { topic: 'home/lights', msg: 'ON' } },
      { id: 'esp_http_get', type: 'esp_http_get', category: 'esp32', label: 'send HTTP GET request', color: '#E7352C', fields: { url: 'https://api.weather.com/v1' } }
    ]
  },
  {
    id: 'sensors',
    name: 'Sensors',
    color: '#9966FF', // Violet
    icon: 'Combine',
    blocks: [
      { id: 'sensor_ultrasonic', type: 'sensor_ultrasonic', category: 'sensors', label: 'read ultrasonic distance (Trig: 2, Echo: 3)', color: '#9966FF', fields: { trig: 2, echo: 3 } },
      { id: 'sensor_ldr', type: 'sensor_ldr', category: 'sensors', label: 'read LDR light level at Pin A1', color: '#9966FF', fields: { pin: 'A1' } },
      { id: 'sensor_temp', type: 'sensor_temp', category: 'sensors', label: 'read DHT11 temperature C° at Pin 4', color: '#9966FF', fields: { pin: 4 } },
      { id: 'sensor_pir', type: 'sensor_pir', category: 'sensors', label: 'motion detected on PIR Pin 7', color: '#9966FF', fields: { pin: 7 } },
      { id: 'sensor_gas', type: 'sensor_gas', category: 'sensors', label: 'gaseous smoke detected (A2)', color: '#9966FF', fields: { pin: 'A2' } }
    ]
  },
  {
    id: 'outputs',
    name: 'Outputs',
    color: '#FF6680', // Pink
    icon: 'RadioReceiver',
    blocks: [
      { id: 'out_led', type: 'out_led', category: 'outputs', label: 'turn LED Pin 13 to ON', color: '#FF6680', fields: { pin: 13, state: 'HIGH' } },
      { id: 'out_buzzer', type: 'out_buzzer', category: 'outputs', label: 'play buzzer note at Pin 8', color: '#FF6680', fields: { pin: 8, freq: 440, time: 200 } },
      { id: 'out_servo', type: 'out_servo', category: 'outputs', label: 'rotate servo Pin 10 to 90°', color: '#FF6680', fields: { pin: 10, angle: 90 } },
      { id: 'out_lcd', type: 'out_lcd', category: 'outputs', label: 'show on LCD: "Hello PaschaNova!"', color: '#FF6680', fields: { text: 'Hello PaschaNova!' } }
    ]
  },
  {
    id: 'robotics',
    name: 'Robotics',
    color: '#2CA02C', // Deep Green
    icon: 'Bot',
    blocks: [
      { id: 'robot_move', type: 'robot_move', category: 'robotics', label: 'drive robot FORWARD at speed 100', color: '#2CA02C', fields: { dir: 'FORWARD', speed: 100 } },
      { id: 'robot_turn', type: 'robot_turn', category: 'robotics', label: 'turn robot LEFT at speed 80', color: '#2CA02C', fields: { dir: 'LEFT', speed: 80 } },
      { id: 'robot_stop', type: 'robot_stop', category: 'robotics', label: 'STOP all motors', color: '#2CA02C' },
      { id: 'robot_avoid', type: 'robot_avoid', category: 'robotics', label: 'if obstacle nearby, dodge LEFT', color: '#2CA02C', fields: { dist: 20 } }
    ]
  },
  {
    id: 'ai',
    name: 'AI & Smart Tools',
    color: '#8A2BE2', // Magenta/Blue Violet
    icon: 'Sparkles',
    blocks: [
      { id: 'ai_face', type: 'ai_face', category: 'ai', label: 'when face detected, toggle LED Pin 13', color: '#8A2BE2', fields: { pin: 13 } },
      { id: 'ai_voice', type: 'ai_voice', category: 'ai', label: 'when voice hears "open sesame", open relay Pin 12', color: '#8A2BE2', fields: { command: 'open sesame', pin: 12 } },
      { id: 'ai_tts', type: 'ai_tts', category: 'ai', label: 'speech synthesis say: "Object detected!"', color: '#8A2BE2', fields: { quote: 'Object detected!' } }
    ]
  },
  {
    id: 'automation',
    name: 'Automation',
    color: '#00CED1', // Dark Turquoise
    icon: 'Layers',
    blocks: [
      { id: 'auto_light', type: 'auto_light', category: 'automation', label: 'smart light auto on (LDR Pin A1, Relay Pin 12)', color: '#00CED1', fields: { triggerVal: 300, ldrPin: 'A1', relayPin: 12 } },
      { id: 'auto_alarm', type: 'auto_alarm', category: 'automation', label: 'security burglar alarm (PIR Pin 7, Buzzer Pin 8)', color: '#00CED1', fields: { pirPin: 7, buzzerPin: 8 } }
    ]
  }
];

export function generateArduinoCode(blocks: BlockType[]): string {
  let setupCode = 'void setup() {\n  Serial.begin(9600);\n';
  let loopCode = 'void loop() {\n';
  let variablesDeclaration = '';

  const declaredVars = new Set<string>();

  blocks.forEach((block) => {
    switch (block.type) {
      case 'var_create': {
        const name = block.fields?.name || 'distance';
        if (!declaredVars.has(String(name))) {
          variablesDeclaration += `int ${name} = 0;\n`;
          declaredVars.add(String(name));
        }
        break;
      }
      case 'var_set': {
        const name = block.fields?.name || 'distance';
        const val = block.fields?.val !== undefined ? block.fields.val : 0;
        loopCode += `  ${name} = ${val};\n`;
        break;
      }
      case 'var_increase': {
        const name = block.fields?.name || 'distance';
        const change = block.fields?.change !== undefined ? block.fields.change : 1;
        loopCode += `  ${name} += ${change};\n`;
        break;
      }
      case 'ard_digital_write': {
        const pin = block.fields?.pin || 13;
        const val = block.fields?.val || 'HIGH';
        setupCode += `  pinMode(${pin}, OUTPUT);\n`;
        loopCode += `  digitalWrite(${pin}, ${val});\n`;
        break;
      }
      case 'ard_digital_read': {
        const pin = block.fields?.pin || 2;
        setupCode += `  pinMode(${pin}, INPUT_PULLUP);\n`;
        loopCode += `  int val_${pin} = digitalRead(${pin});\n`;
        break;
      }
      case 'ard_analog_read': {
        const pin = block.fields?.pin || 'A0';
        loopCode += `  int val_${pin} = analogRead(${pin});\n`;
        break;
      }
      case 'ard_pwm_write': {
        const pin = block.fields?.pin || 9;
        const speed = block.fields?.speed || 255;
        setupCode += `  pinMode(${pin}, OUTPUT);\n`;
        loopCode += `  analogWrite(${pin}, ${speed});\n`;
        break;
      }
      case 'time_wait': {
        const ms = block.fields?.ms || 1000;
        loopCode += `  delay(${ms});\n`;
        break;
      }
      case 'out_led': {
        const pin = block.fields?.pin || 13;
        const state = block.fields?.state || 'HIGH';
        setupCode += `  pinMode(${pin}, OUTPUT);\n`;
        loopCode += `  digitalWrite(${pin}, ${state});\n`;
        break;
      }
      case 'out_buzzer': {
        const pin = block.fields?.pin || 8;
        const freq = block.fields?.freq || 440;
        const time = block.fields?.time || 200;
        setupCode += `  pinMode(${pin}, OUTPUT);\n`;
        loopCode += `  tone(${pin}, ${freq}, ${time});\n  delay(${time});\n`;
        break;
      }
      case 'out_servo': {
        const pin = block.fields?.pin || 10;
        const angle = block.fields?.angle || 90;
        if (!declaredVars.has('servo')) {
          variablesDeclaration = '#include <Servo.h>\nServo myServo;\n' + variablesDeclaration;
          declaredVars.add('servo');
        }
        setupCode += `  myServo.attach(${pin});\n`;
        loopCode += `  myServo.write(${angle});\n`;
        break;
      }
      case 'out_lcd': {
        const text = block.fields?.text || 'Hello PaschaNova!';
        if (!declaredVars.has('lcd')) {
          variablesDeclaration = '#include <LiquidCrystal.h>\nLiquidCrystal lcd(12, 11, 5, 4, 3, 2);\n' + variablesDeclaration;
          declaredVars.add('lcd');
        }
        setupCode += `  lcd.begin(16, 2);\n  lcd.print("PaschaNova!");\n`;
        loopCode += `  lcd.setCursor(0, 1);\n  lcd.print("${text}");\n`;
        break;
      }
      case 'sensor_ultrasonic': {
        const trig = block.fields?.trig || 2;
        const echo = block.fields?.echo || 3;
        setupCode += `  pinMode(${trig}, OUTPUT);\n  pinMode(${echo}, INPUT);\n`;
        loopCode += `  digitalWrite(${trig}, LOW);\n  delayMicroseconds(2);\n  digitalWrite(${trig}, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(${trig}, LOW);\n  long duration = pulseIn(${echo}, HIGH);\n  int final_distance = duration * 0.034 / 2;\n  Serial.print("Distance (cm): ");\n  Serial.println(final_distance);\n`;
        break;
      }
      case 'sensor_ldr': {
        const pin = block.fields?.pin || 'A1';
        loopCode += `  int ldr_value = analogRead(${pin});\n  Serial.print("Light level: ");\n  Serial.println(ldr_value);\n`;
        break;
      }
      case 'sensor_pir': {
        const pin = block.fields?.pin || 7;
        setupCode += `  pinMode(${pin}, INPUT);\n`;
        loopCode += `  int motion = digitalRead(${pin});\n  if (motion == HIGH) {\n    Serial.println("MOTION DETECTED!");\n  }\n`;
        break;
      }
      case 'robot_move': {
        const dir = block.fields?.dir || 'FORWARD';
        const speed = block.fields?.speed || 100;
        setupCode += `  pinMode(5, OUTPUT); // Motor A direction\n  pinMode(6, OUTPUT); // Motor A speed (PWM)\n  pinMode(7, OUTPUT); // Motor B direction\n  pinMode(8, OUTPUT); // Motor B speed (PWM)\n`;
        loopCode += `  // Drive motor robot ${dir}\n  digitalWrite(5, ${dir === 'FORWARD' ? 'HIGH' : 'LOW'});\n  analogWrite(6, ${speed});\n  digitalWrite(7, ${dir === 'FORWARD' ? 'HIGH' : 'LOW'});\n  analogWrite(8, ${speed});\n`;
        break;
      }
      case 'auto_light': {
        const ldr = block.fields?.ldrPin || 'A1';
        const relay = block.fields?.relayPin || 12;
        const trigger = block.fields?.triggerVal || 300;
        setupCode += `  pinMode(${relay}, OUTPUT);\n`;
        loopCode += `  if (analogRead(${ldr}) < ${trigger}) {\n    digitalWrite(${relay}, HIGH); // Lights ON\n  } else {\n    digitalWrite(${relay}, LOW);\n  }\n`;
        break;
      }
      default:
        break;
    }
  });

  setupCode += '}\n\n';
  loopCode += '}\n';

  return `/**\n * Auto-generated Sketch for Arduino Uno/Nano\n * Platform: PaschaNova Labs STEM Studio\n */\n\n${variablesDeclaration}\n${setupCode}${loopCode}`;
}

export function generateEspCode(blocks: BlockType[]): string {
  let setupCode = 'void setup() {\n  Serial.begin(115200);\n';
  let loopCode = 'void loop() {\n';
  let variablesDeclaration = '';

  const declaredVars = new Set<string>();

  blocks.forEach((block) => {
    switch (block.type) {
      case 'esp_wifi_connect': {
        const ssid = block.fields?.ssid || 'MakerNet';
        const pass = block.fields?.pass || 'STEM1234';
        if (!declaredVars.has('wifi')) {
          variablesDeclaration = '#include <WiFi.h>\n' + variablesDeclaration;
          declaredVars.add('wifi');
        }
        setupCode += `  WiFi.begin("${ssid}", "${pass}");\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(".");\n  }\n  Serial.println("Connected to WiFi!");\n`;
        break;
      }
      case 'esp_mqtt_publish': {
        const topic = block.fields?.topic || 'home/lights';
        const msg = block.fields?.msg || 'ON';
        if (!declaredVars.has('pubsub')) {
          variablesDeclaration = '#include <PubSubClient.h>\nWiFiClient espClient;\nPubSubClient client(espClient);\n' + variablesDeclaration;
          declaredVars.add('pubsub');
        }
        setupCode += `  client.setServer("broker.hivemq.com", 1883);\n`;
        loopCode += `  if (!client.connected()) {\n    client.connect("ESP32Client");\n  }\n  client.publish("${topic}", "${msg}");\n`;
        break;
      }
      case 'esp_http_get': {
        const url = block.fields?.url || 'https://api.weather.com/v1';
        if (!declaredVars.has('http')) {
          variablesDeclaration = '#include <HTTPClient.h>\n' + variablesDeclaration;
          declaredVars.add('http');
        }
        loopCode += `  if (WiFi.status() == WL_CONNECTED) {\n    HTTPClient http;\n    http.begin("${url}");\n    int httpCode = http.GET();\n    if (httpCode > 0) {\n      String payload = http.getString();\n      Serial.println(payload);\n    }\n    http.end();\n  }\n`;
        break;
      }
      default: {
        // Fallback to basic copy
        break;
      }
    }
  });

  setupCode += '}\n\n';
  loopCode += '}\n';

  return `/**\n * Auto-generated IoT Sketch for ESP32 Dev Module\n * Platform: PaschaNova Labs STEM Studio\n */\n\n${variablesDeclaration}\n${setupCode}${loopCode}`;
}
