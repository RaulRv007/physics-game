#include <BleKeyboard.h>

BleKeyboard bleKeyboard;
const int buttonPin = 26;  
bool wasPressed = false;

void setup() {
  Serial.begin(115200);
  pinMode(buttonPin, INPUT_PULLUP); 
  pinMode(27, INPUT_PULLUP); 
  bleKeyboard.begin();
}

void loop() {
  if (bleKeyboard.isConnected()) {
    if (digitalRead(27) == LOW) {
      if (!wasPressed) {
        bleKeyboard.write('w'); 
        wasPressed = true;
      }
    } else {
      wasPressed = false;
    }
  }
  delay(10);
}
