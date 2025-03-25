#include <stdlib.h>
#include "ByteConvert.h"
#include <inttypes.h>
#include <cstring>

// :: Converts bytes to ints :: 
union CharToInt
{
  char bytes[2];
  int intValue;
} shortConverter;

/**
 * @brief Converts a char* to a boolean
 * 
 * @param data The data (one byte) to convert
 * @return bool
 */
bool ByteConvert::toBool(char* data){
    return data[0] != 0; // keep an eye on this... (false is 255)
}

/**
 * @brief Converts a char* to a uint16_t
 * 
 * @param data The data (two bytes) to convert
 * @return uint16_t
 */
uint16_t ByteConvert::toUShort(char* data){
    // cpy it in reverse order
    shortConverter.bytes[0] = data[1];
    shortConverter.bytes[1] = data[0];
    return (uint16_t)shortConverter.intValue;
}

/**
 * @brief Converts a char* to a double
 * 
 * @param data The data (four bytes) to convert
 * @return double
 */
double ByteConvert::toDouble(char* data){
    return 0.0;
}