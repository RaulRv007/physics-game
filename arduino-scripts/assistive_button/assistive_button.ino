#include <BleKeyboard.h>

BleKeyboard bleKeyboard;

// Pin assignments
const int pinJump = 5;     // GPIO for jump (e.g., W)
const int pinLeft = 16;    // GPIO for left (e.g., Q)
const int pinRight = 27;   // GPIO for right (e.g., E)

// Debounce state
bool jumpPressed = false;
bool leftPressed = false;
bool rightPressed = false;

void setup() {
  Serial.begin(115200);

  // Set button pins
  pinMode(pinJump, INPUT_PULLUP);
  pinMode(pinLeft, INPUT_PULLUP);
  pinMode(pinRight, INPUT_PULLUP);

  // Start BLE keyboard
  bleKeyboard.begin();
}

void loop() {
  if (bleKeyboard.isConnected()) {
    // Jump (W key)
    if (digitalRead(pinJump) == LOW) {
      if (!jumpPressed) {
        bleKeyboard.write('w');
        jumpPressed = true;
        Serial.println("Jump pressed");
      }
    } else {
      jumpPressed = false;
    }

    // Left (Q key)
    if (digitalRead(pinLeft) == LOW) {
      if (!leftPressed) {
        bleKeyboard.write('q');
        leftPressed = true;
        Serial.println("Left pressed");
      }
    } else {
      leftPressed = false;
    }

    // Right (E key)
    if (digitalRead(pinRight) == LOW) {
      if (!rightPressed) {
        bleKeyboard.write('e');
        rightPressed = true;
        Serial.println("Right pressed");
      }
    } else {
      rightPressed = false;
    }
  }

  delay(10); // Basic debounce
}
