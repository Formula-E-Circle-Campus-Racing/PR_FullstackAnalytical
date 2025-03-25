//
// 3-24-2025
// TO BE OVERWRITTEN, USED AS TEMPORARY TEST FILE
//
#include <Arduino.h>
#include <Wire.h>

// char buffer to send over i2C
char buffer[11] = {
  0x03, 0x10,   // First two bytes convert to 1023 (0x03FF in hexadecimal)
  0x02, 0x00,   // Second two bytes convert to 512 (0x0200 in hexadecimal)
  0x00,          // Fifth byte as a boolean value of true (0x01 is typically used for true)
  0x52          // Fifth byte as a boolean value of true (0x01 is typically used for true)
};

void sendData(){
  Serial.println("Sending Data");
  
  for (size_t i = 0; i < 11; ++i)
  {
    Wire.write(buffer[i]);
  }
  
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Wire.begin(4);
  Wire.onRequest(sendData); 
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(1000);

}