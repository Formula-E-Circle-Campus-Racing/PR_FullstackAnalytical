/*
 * PR_FsA ~ Particle Board
 * Author: Disguised_Coffee
 * Date: 3-24-2025
 *
 * Description:
 *  With another Arduino connected to the Particle board, 
 *  requests data from the Arduino and publishes it to the cloud.
 */

// Include Particle Device OS APIs
#include "Particle.h"

#include "ByteConvert.h"
#include "ArduinoJson.h"

// Show system, cloud connectivity, and application logs over USB
// View logs with CLI using 'particle serial monitor --follow'
SerialLogHandler logHandler(LOG_LEVEL_INFO);

// :: function headers ::
void requestData();
void pubData();
char* getSubstring(char* in, const uint8_t start, const uint8_t end);

// :: global variables ::
char buffer[256]; // JSON Buffer (for later)
char rawDataBuffer[11]; // Raw Data Buffer
JsonDocument doc; // JSON Document

// runs once when the device is first turned on
void setup() {
  Serial.begin(9600);
  Wire.begin();
}

void loop() {
  // beg for data
  requestData();
  pubData();
  delay(4000);  
}

// we want this done on a separate thread so we can do other things while waiting for the data
void requestData(){
  // :: request for information from the peripheral ::
  Wire.requestFrom(4, 10);

  // :: Read from the buffer ::
  u_int8_t j = 0;
  while (Wire.available()) {
    // read the data from the peripheral
    rawDataBuffer[j] = Wire.read();
    
    // Debugging
    // Log.info("Data: %c", rawDataBuffer[j]);
    // Log.info("DataNum: %d", rawDataBuffer[j]);

    // Increment the index
    j++;
  }

  // null terminate the string
  rawDataBuffer[10] = '\0'; 

  // debug raw data
  Log.info("Data: %s", rawDataBuffer);

}

void pubData(){
  // :: check if data exists ::
  if(strlen(rawDataBuffer) == 0){
    Log.warn("No data to publish!");
    return;
  }
  
  // :: check if connected to the cloud ::
  if(Particle.connected() == false){
    Log.warn("Not connected to the cloud!");
    return;
  }

  // :: Setup and Populate the JSON Document ::
  // reset the doc
  doc.clear();
  
  // populate the doc
  doc["shortOne"] = ByteConvert::toUShort(getSubstring(rawDataBuffer, 0, 2));
  doc["shortTwo"] = ByteConvert::toUShort(getSubstring(rawDataBuffer, 2, 4));
  doc["boolOne"] = ByteConvert::toBool(&(rawDataBuffer[4])); // since we access the arr, just return its address
  
  // For debugging purposes
  doc["rawData"] = rawDataBuffer;
  
  // Turn the JSON Doc into a string 
  serializeJson(doc, buffer);

  // :: publish the data ::
  Particle.publish("blah", buffer);
}


/**
 * @brief Get a substring from a string
 * 
 * @return char* - the substring
 */
char* getSubstring(char* in, const uint8_t start, const uint8_t end){
  char* out = (char*)malloc(end - start + 1);
  for(uint8_t i = start; i < end; i++){
    out[i - start] = in[i];
  }
  out[end - start] = '\0';
  return out;
}