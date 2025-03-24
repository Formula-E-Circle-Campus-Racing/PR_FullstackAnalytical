#include <stdlib.h>
#include "ByteConvert.h"
#include <inttypes.h>

// :: not using this for now! :: 
// union FloatToBytes
// {
//   uint8_t bytes[sizeof(float)]; // 8 * 4 = 32 bytes
//   float floatValue;
// };

// FloatToBytes floatConverter;

/**
 * @brief Converts a char* to a boolean
 * 
 * @param data The data (one byte) to convert
 * @return bool
 */
bool ByteConvert::toBool(char* data){
    return (bool)atoi(data);
}

/**
 * @brief Converts a char* to a uint16_t
 * 
 * @param data The data (two bytes) to convert
 * @return uint16_t
 */
uint16_t ByteConvert::toUShort(char* data){
    return (uint16_t)atoi(data);
}

/**
 * @brief Converts a char* to a double
 * 
 * @param data The data (four bytes) to convert
 * @return double
 */
double ByteConvert::toDouble(char* data){
    return (double)atof(data);
}