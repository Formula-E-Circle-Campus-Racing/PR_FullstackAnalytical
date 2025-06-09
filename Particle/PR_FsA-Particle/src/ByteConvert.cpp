#include <stdlib.h>
#include "ByteConvert.h"
#include <inttypes.h>
#include <cstring>

/**
 * 
 * @file ByteConvert.cpp
 * @brief ByteConvert class implementation
 * 
 * 
 */

// for now, don't use this union, as we can do bitwise operations directly on the char array.

// // :: Converts bytes to ints :: 
// union CharToInt
// {
//   char bytes[2];
//   int intValue;
// } shortConverter;

/**
 * @brief Converts a char* to a boolean. Definitely not useful.
 * 
 * @param data The data (one byte) to convert
 * @return bool
 */
bool ByteConvert::toBool(char* data){
    return data[0] != 0; // keep an eye on this... (false is 255)
}

/**
 * @brief Converts a char* to a uint16_t. Expects big endian format!
 * 
 * 
 * @param data The data (two bytes) to convert
 * @return uint16_t
 */
uint16_t ByteConvert::toUShort(char* data){
    return (short)( data[0]<< 8 | (data[1] )); // Combine the two bytes into a uint16_t
}

/**
 * @brief Converts a char* to a double. Expects big endian format.
 * 
 * @param data The data (TWO bytes) to convert
 * @return double
 */
double ByteConvert::toDouble(char* data, u_int8_t multiplier){
    // Convert the first two bytes to a uint16_t and divide by the multiplier

    // ignore 3 lines below for now, it is not used in the project
    // if (multiplier == 0) {
    //     return 0.0; // Avoid division by zero
    // }

    return ((double)((uint16_t)data[0] << 8 | (uint16_t)data[1])) / multiplier;
}