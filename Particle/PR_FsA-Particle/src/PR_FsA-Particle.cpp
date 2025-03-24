/*
 * PR_FsA ~ Particle Board
 * Author: Disguised_Coffee
 * Date: 3-24-2025
 *
 * Note: It'd be nice to have separate files.
 * 
 */

// Include Particle Device OS APIs
#include "Particle.h"

// Show system, cloud connectivity, and application logs over USB
// View logs with CLI using 'particle serial monitor --follow'
SerialLogHandler logHandler(LOG_LEVEL_INFO);

// Run the application and system concurrently in separate threads
SYSTEM_THREAD(ENABLED);

// function headers
void requestData();

// setup() runs once, when the device is first turned on
void setup() {
  Serial.begin(9600);
  Wire.begin();
}

// JSON Buffer (for later)
char buffer[256];

// Raw Data Buffer
char rawDataBuffer[11];

void loop() {
  // beg for data
  requestData();
  delay(4000);  
}

// we want this done on a separate thread so we can do other things while waiting for the data
void requestData(){
  // request for information from the peripheral
  Wire.requestFrom(4, 10);

  // Read from the buffer
  u_int8_t j = 0;
  while (Wire.available()) {
    // read the data from the peripheral
    rawDataBuffer[j] = Wire.read();
    
    // Debugging
    Log.info("Data: %c", rawDataBuffer[j]);
    Log.info("DataNum: %d", rawDataBuffer[j]);

    // Increment the index
    j++;
  }

  // null terminate the string
  rawDataBuffer[10] = '\0'; 

  // debug raw data
  Log.info("Data: %s", rawDataBuffer);

}