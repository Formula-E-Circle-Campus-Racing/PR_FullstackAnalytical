//
// 3-24-2025
// TO BE OVERWRITTEN, USED AS TEMPORARY TEST FILE
//
#include <Arduino.h>
#include <Wire.h>

// char buffer to send over i2C
char buffer[11] = "ThisIsATe ";

void sendData(){
  Serial.println("Sending Data");
  
  Wire.write(buffer);
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