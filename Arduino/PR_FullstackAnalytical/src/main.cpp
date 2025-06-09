/*
 * PR_FsA ~ Arduino Board
 * Author: Disguised_Coffee
 * Date: 5-22-2025
 *
 * Description:
 * This code is for an Arduino board that reads data from a joystick and a DHT sensor.
 */
#include <Arduino.h>
#include <Wire.h>
#include <DHT.h>

// :: PORTS ::
#define X_AXIS A2
#define Y_AXIS A1
#define SW_AXIS 2

// DHT-11
#define DHTPIN 4
#define DHTTYPE DHT11

// :: GLOBAL VARIABLES ::
DHT dht(DHTPIN, DHTTYPE); // DHT sensor object
float h, t, hi; // DHT variables
bool dhtReadError = false; // DHT read error

// char buffer to send over i2C
char buffer[11];
bool bufferReady = false;

// joystick variables
short x, y;
bool button;

// function headers
void sendData();
void updateJoystickData();
void updateStringBuffer();

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Wire.begin(4);
  Wire.onRequest(sendData); 

  // initialize joystick btn
  pinMode(SW_AXIS, INPUT_PULLUP);
  
  dht.begin(); // begin DHT
}

void loop() {
  // update DHT data
  updateDHTData();
  updateJoystickData();
  updateStringBuffer();

  delay(1000);
}

// :: update the joystick data ::
void updateJoystickData(){
  x = analogRead(X_AXIS);
  y = analogRead(Y_AXIS);
  button = digitalRead(SW_AXIS);
}

// :: update the DHT data ::
void updateDHTData(){
  // DHT library already implements the noinerrupt read functionality,
  // so we can just call the read functions directly.
  
  // Read humidity
  h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  t = dht.readTemperature();
  
  hi = dht.computeHeatIndex(t, h, false);
  
  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(hi)) {
    dhtReadError = true;
    return;
  }
}

// :: EXAMPLE BUFFER ::
// {
//   // JOYSTICK
//   0x03, 0x10,   // First two bytes convert to 784 (0x0310 in hexadecimal)
//   0x02, 0x00,   // Second two bytes convert to 512 (0x0200 in hexadecimal)
//   0x01,         // Fifth byte as a boolean value of true (0x01 is typically used for true)
//   // DHT
//   0x01, 0xF4,   // Humidity: 50.0% (0x01F4 in hexadecimal, 50.0 * 100 = 500)
//   0x0C, 0x35,   // Temperature: 31.25°C (0x0C35 in hexadecimal, 31.25 * 100 = 3125)
//   // Error flag
//   0x00          // last as error. (0x00 is no error, 0x01 is error)
// };

/**
 * @brief Updates the string buffer with the latest joystick and DHT data.
 */
void updateStringBuffer(){
  // disable interrupts to prevent any issues during i2c interaction
  // this is important to ensure that the data is not being read while we are updating it.
  noInterrupts();

  // reset error flag
  buffer[10] = 0x00; // no error flag

  // :: input joystick data ::
  // we are doing a big-endian conversion here, so the first byte is 
  // the high byte and the second byte is the low byte.
  // x and y are both 10-bit values, so we need to shift them to fit in 2 bytes.
  buffer[0] = (x >> 8) & 0xFF; // first byte
  buffer[1] = x & 0xFF; // second byte
  buffer[2] = (y >> 8) & 0xFF; // third byte
  buffer[3] = y & 0xFF; // fourth byte
  buffer[4] = button ? 0x01 : 0x00; // fifth byte

  // :: input DHT data ::
  if(dhtReadError){
    // if there is a read error, set the buffer to 0x01
    buffer[10] &= 0x01; // error flag
    
  }
  else{
    // IMPORTANT: ENSURE THAT PROCESS IS REVERSED CORRECTLY. []
    // humidity is a percentage (0-100),
    buffer[5] = (uint16_t)(h * 100) >> 8; // sixth byte (humidity high byte)
    buffer[6] = (uint16_t)(h * 100) & 0xFF; // seventh byte (humidity low byte)
    // temperature is in Celsius (0-50)
    buffer[7] = (uint16_t)(t * 100) >> 8; // eighth byte (temperature high byte)
    buffer[8] = (uint16_t)(t * 100) & 0xFF; // ninth byte (temperature low byte)
  }
  // no checksum is needed for this protocol, as the data is small and simple.


  // enable interrupts again so that the i2c can be used again.
  interrupts();
}

// send back the 10 bytes requested.
void sendData(){
  // :: send data as normal ::
  Serial.println("Sending Data");
  
  for (size_t i = 0; i < 11; ++i)
  {
    Wire.write(buffer[i]);
  }
  
}

